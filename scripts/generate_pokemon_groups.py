#!/usr/bin/env python3
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path

import numpy as np
from scipy.optimize import Bounds, LinearConstraint, milp
from scipy.sparse import lil_matrix

ROOT = Path(__file__).resolve().parents[1]
SPECIES_CSV = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/pokemon_species.csv")
GROUP_FILE = ROOT / "src/pokemonGroups.ts"
POKEMON_FILE = ROOT / "public/data/pokemon.json"

TYPE_META = {
    "normal": ("Bản Năng Hoang Dã", "sức mạnh bản năng và khả năng thích nghi", "#a8a29a"),
    "fire": ("Quân Đoàn Hỏa Diệm", "ngọn lửa chiến đấu không bao giờ tắt", "#ed7a35"),
    "water": ("Đội Hình Thủy Triều", "sức mạnh cuộn trào của biển sâu", "#4f8fc8"),
    "electric": ("Biệt Đội Lôi Đình", "tốc độ và điện năng xé toạc chiến trường", "#d7b83f"),
    "grass": ("Hộ Vệ Đại Ngàn", "sinh lực nguyên thủy của rừng xanh", "#59a765"),
    "ice": ("Quân Đoàn Băng Giá", "hơi lạnh khóa chặt mọi đối thủ", "#75bcd4"),
    "fighting": ("Võ Đường Chiến Thần", "thể thuật được tôi luyện tới cực hạn", "#d36b4d"),
    "poison": ("Mật Hội Độc Tố", "nanh vuốt và độc tố đầy hiểm họa", "#9d63aa"),
    "ground": ("Kỵ Binh Địa Chấn", "sức mạnh rung chuyển mặt đất", "#c99658"),
    "flying": ("Phi Đội Thiên Không", "đôi cánh làm chủ tầng không", "#6d9fc4"),
    "psychic": ("Hội Đồng Tâm Linh", "tâm trí bẻ cong mọi giới hạn", "#d56c9b"),
    "bug": ("Binh Đoàn Giáp Trùng", "bản năng chiến đấu dưới lớp giáp cứng", "#8fa64d"),
    "rock": ("Vệ Binh Nham Thạch", "sức nặng nghiền nát mọi phòng tuyến", "#a88b65"),
    "ghost": ("Đoàn Quân Linh Hồn", "những bóng ma bước ra từ cõi tối", "#7868bd"),
    "dragon": ("Long Tộc Viễn Cổ", "huyết mạch rồng thức tỉnh", "#cf5546"),
    "dark": ("Quân Đoàn Hắc Ám", "uy áp và bản năng săn mồi trong đêm", "#6f748c"),
    "steel": ("Cận Vệ Thiết Giáp", "pháo đài sống với lớp giáp bất khuất", "#8fa9b7"),
    "fairy": ("Cung Điện Tiên Giới", "ma lực thanh tao nhưng đầy quyền năng", "#db8eb8"),
}
TYPE_LABELS = {
    "normal": "Thường", "fire": "Lửa", "water": "Nước", "electric": "Điện",
    "grass": "Cỏ", "ice": "Băng", "fighting": "Giác Đấu", "poison": "Độc",
    "ground": "Đất", "flying": "Bay", "psychic": "Siêu Linh", "bug": "Côn Trùng",
    "rock": "Đá", "ghost": "Ma", "dragon": "Rồng", "dark": "Bóng Tối",
    "steel": "Thép", "fairy": "Tiên",
}
FORM_META = {
    "mega": ("Mega Tiến Hóa", "nguồn năng lượng Mega giải phóng hình thái tối thượng", "#ef616f"),
    "gigamax": ("Gigamax Khổng Lồ", "sức mạnh Dynamax đạt tới quy mô cực đại", "#d85ba8"),
    "alola": ("Biến Thể Alola", "hình thái thích nghi với quần đảo nhiệt đới", "#48b7ae"),
    "galar": ("Biến Thể Galar", "hình thái tiến hóa trong môi trường Galar", "#865ac7"),
    "hisui": ("Biến Thể Hisui", "dáng hình cổ xưa từ vùng đất Hisui", "#c18857"),
}


def roman(number: int) -> str:
    values = ((100, "C"), (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"))
    result = ""
    for value, symbol in values:
        while number >= value:
            result += symbol
            number -= value
    return result


def form_category(row: dict) -> str | None:
    label = f'{row["pokemon_name"]} {row["pokemon_sub_name"]}'.lower()
    for category in FORM_META:
        if category in label:
            return category
    return None


with POKEMON_FILE.open(encoding="utf-8") as handle:
    pokemon_rows = json.load(handle)["pokemons"]
pokemon_by_key = {
    (int(row["zukan_id"]), int(row["zukan_sub_id"])): row for row in pokemon_rows
}

parent = {}
with SPECIES_CSV.open(encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        pokemon_id = int(row["id"])
        if pokemon_id <= 1025:
            parent[pokemon_id] = int(row["evolves_from_species_id"]) if row["evolves_from_species_id"] else None


@lru_cache(None)
def evolution_stage(pokemon_id: int) -> int:
    previous = parent.get(pokemon_id)
    return 1 if not previous else evolution_stage(previous) + 1


source = GROUP_FILE.read_text(encoding="utf-8")
list_match = re.search(r"(export const POKEMON_GROUPS: PokemonGroup\[\] = \[\n)(.*?)(\n\];)", source, re.S)
if not list_match:
    raise RuntimeError("Could not find POKEMON_GROUPS")

existing_lines = [line for line in list_match.group(2).splitlines() if line.strip()]
fixed_lines = existing_lines[:20]
fixed_keys = {
    (int(pokemon_id), int(sub_id or 0))
    for line in fixed_lines
    for pokemon_id, sub_id in re.findall(r"\{ id: (\d+)(?:, subId: (\d+))?, stage: [123] \}", line)
}

# Include every evolved base species and every alternate/special form.
eligible_keys = {
    key for key in pokemon_by_key
    if key[1] > 0 or evolution_stage(key[0]) >= 2
}
remaining_keys = sorted(eligible_keys - fixed_keys)

options = []
options_by_pokemon = defaultdict(list)
for key in remaining_keys:
    row = pokemon_by_key[key]
    category = form_category(row) if key[1] > 0 else None
    candidates = []
    if category:
        candidates.append((f"form:{category}", 0))
    for preference, pokemon_type in enumerate(row["pokemon_type_id"].split(","), start=1):
        candidates.append((f"type:{pokemon_type}", preference))
    for bucket, preference in candidates:
        option_index = len(options)
        options.append((key, bucket, preference))
        options_by_pokemon[key].append(option_index)

buckets_available = sorted({bucket for _, bucket, _ in options})
variable_count = len(options) + len(buckets_available)
constraint_count = len(remaining_keys) + len(buckets_available)
matrix = lil_matrix((constraint_count, variable_count))
target = np.zeros(constraint_count)

for row_index, key in enumerate(remaining_keys):
    for option_index in options_by_pokemon[key]:
        matrix[row_index, option_index] = 1
    target[row_index] = 1

for bucket_index, bucket in enumerate(buckets_available):
    row_index = len(remaining_keys) + bucket_index
    for option_index, (_, option_bucket, _) in enumerate(options):
        if option_bucket == bucket:
            matrix[row_index, option_index] = 1
    matrix[row_index, len(options) + bucket_index] = -5

objective = np.zeros(variable_count)
for option_index, (_, _, preference) in enumerate(options):
    objective[option_index] = preference * 0.01

lower = np.zeros(variable_count)
upper = np.ones(variable_count)
upper[len(options):] = len(remaining_keys) / 5
result = milp(
    objective,
    integrality=np.ones(variable_count),
    bounds=Bounds(lower, upper),
    constraints=LinearConstraint(matrix.tocsr(), target, target),
)
if not result.success:
    raise RuntimeError(result.message)

assigned = defaultdict(list)
for option_index, (key, bucket, _) in enumerate(options):
    if result.x[option_index] > 0.5:
        assigned[bucket].append(key)


def generation(pokemon_id: int) -> int:
    limits = (151, 251, 386, 493, 649, 721, 809, 905, 1025)
    return next(index + 1 for index, limit in enumerate(limits) if pokemon_id <= limit)


def make_groups(bucket: str, keys: list[tuple[int, int]]) -> list[list[tuple[int, int]]]:
    remaining = set(keys)
    groups = []
    while remaining:
        seed = min(remaining)
        remaining.remove(seed)
        seed_types = set(pokemon_by_key[seed]["pokemon_type_id"].split(","))
        seed_category = form_category(pokemon_by_key[seed])

        def score(candidate: tuple[int, int]):
            row = pokemon_by_key[candidate]
            candidate_types = set(row["pokemon_type_id"].split(","))
            shared_types = len(seed_types & candidate_types)
            same_form = seed_category and seed_category == form_category(row)
            same_generation = generation(seed[0]) == generation(candidate[0])
            return (-bool(same_form), -shared_types, -same_generation, abs(seed[0] - candidate[0]), candidate)

        companions = sorted(remaining, key=score)[:4]
        for key in companions:
            remaining.remove(key)
        groups.append([seed, *companions])
    return groups


generated_lines = []
for bucket in sorted(assigned):
    bucket_groups = make_groups(bucket, assigned[bucket])
    bucket_kind, bucket_name = bucket.split(":", 1)
    if bucket_kind == "form":
        base_title, base_subtitle, accent = FORM_META[bucket_name]
    else:
        base_title, base_subtitle, accent = TYPE_META[bucket_name]

    for index, members in enumerate(bucket_groups, start=1):
        subtitle = base_subtitle
        if bucket_kind == "type":
            secondary_counts = Counter(
                pokemon_type
                for key in members
                for pokemon_type in pokemon_by_key[key]["pokemon_type_id"].split(",")
                if pokemon_type != bucket_name
            )
            if secondary_counts and secondary_counts.most_common(1)[0][1] >= 3:
                subtitle += f", cộng hưởng cùng hệ {TYPE_LABELS[secondary_counts.most_common(1)[0][0]]}"

        member_parts = []
        for pokemon_id, sub_id in members:
            sub_text = f", subId: {sub_id}" if sub_id else ""
            member_parts.append(f"{{ id: {pokemon_id}{sub_text}, stage: {evolution_stage(pokemon_id)} }}")
        members_text = ", ".join(member_parts)
        safe_bucket = bucket.replace(":", "-")
        generated_lines.append(
            f'  {{ id: "{safe_bucket}-squad-{index}", title: "{base_title} {roman(index)}", '
            f'subtitle: "{subtitle}", accent: "{accent}", members: [{members_text}] }},'
        )

all_lines = fixed_lines + generated_lines
replacement = list_match.group(1) + "\n".join(all_lines) + list_match.group(3)
GROUP_FILE.write_text(source[:list_match.start()] + replacement + source[list_match.end():], encoding="utf-8")

all_keys = []
for line in all_lines:
    all_keys.extend(
        (int(pokemon_id), int(sub_id or 0))
        for pokemon_id, sub_id in re.findall(r"\{ id: (\d+)(?:, subId: (\d+))?, stage: [123] \}", line)
    )

assert len(all_lines) == 142
assert len(all_keys) == 710
assert len(set(all_keys)) == 710
assert set(all_keys) == eligible_keys
assert all(len(re.findall(r"\{ id:", line)) == 6 for line in all_lines)

print(json.dumps({
    "groups": len(all_lines),
    "members": len(all_keys),
    "base_evolved": sum(1 for key in all_keys if key[1] == 0),
    "special_forms": sum(1 for key in all_keys if key[1] > 0),
    "unique": len(set(all_keys)),
}, ensure_ascii=False))
