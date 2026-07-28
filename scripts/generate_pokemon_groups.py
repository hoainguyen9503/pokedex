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


def roman(number: int) -> str:
    values = ((10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"))
    result = ""
    for value, symbol in values:
        while number >= value:
            result += symbol
            number -= value
    return result


with POKEMON_FILE.open(encoding="utf-8") as handle:
    pokemon_rows = json.load(handle)["pokemons"]
pokemon_by_id = {
    int(row["zukan_id"]): row for row in pokemon_rows if row["zukan_sub_id"] == 0
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
fixed_ids = {
    int(value)
    for line in fixed_lines
    for value in re.findall(r"\{ id: (\d+), stage: [23] \}", line)
}

# These four are transitional second-stage forms and intentionally fail the
# "stage II must look battle-ready" rule. Removing them makes 480 eligible
# Pokémon, which can be partitioned into exact squads of five.
excluded_by_rule = {113, 176, 233, 315}
eligible_ids = {
    pokemon_id for pokemon_id in parent
    if evolution_stage(pokemon_id) >= 2
} - excluded_by_rule
remaining_ids = sorted(eligible_ids - fixed_ids)

types = sorted({
    pokemon_type
    for pokemon_id in remaining_ids
    for pokemon_type in pokemon_by_id[pokemon_id]["pokemon_type_id"].split(",")
})
options = []
options_by_pokemon = defaultdict(list)
for pokemon_id in remaining_ids:
    for preference, pokemon_type in enumerate(pokemon_by_id[pokemon_id]["pokemon_type_id"].split(",")):
        option_index = len(options)
        options.append((pokemon_id, pokemon_type, preference))
        options_by_pokemon[pokemon_id].append(option_index)

variable_count = len(options) + len(types)
constraint_count = len(remaining_ids) + len(types)
matrix = lil_matrix((constraint_count, variable_count))
target = np.zeros(constraint_count)

for row_index, pokemon_id in enumerate(remaining_ids):
    for option_index in options_by_pokemon[pokemon_id]:
        matrix[row_index, option_index] = 1
    target[row_index] = 1

for type_index, pokemon_type in enumerate(types):
    row_index = len(remaining_ids) + type_index
    for option_index, (_, option_type, _) in enumerate(options):
        if option_type == pokemon_type:
            matrix[row_index, option_index] = 1
    matrix[row_index, len(options) + type_index] = -5

objective = np.zeros(variable_count)
for option_index, (_, _, preference) in enumerate(options):
    objective[option_index] = preference * 0.01

lower = np.zeros(variable_count)
upper = np.ones(variable_count)
upper[len(options):] = len(remaining_ids) / 5
result = milp(
    objective,
    integrality=np.ones(variable_count),
    bounds=Bounds(lower, upper),
    constraints=LinearConstraint(matrix.tocsr(), target, target),
)
if not result.success:
    raise RuntimeError(result.message)

buckets = defaultdict(list)
for option_index, (pokemon_id, pokemon_type, _) in enumerate(options):
    if result.x[option_index] > 0.5:
        buckets[pokemon_type].append(pokemon_id)


def generation(pokemon_id: int) -> int:
    limits = (151, 251, 386, 493, 649, 721, 809, 905, 1025)
    return next(index + 1 for index, limit in enumerate(limits) if pokemon_id <= limit)


def make_type_groups(pokemon_type: str, pokemon_ids: list[int]) -> list[list[int]]:
    remaining = set(pokemon_ids)
    groups = []
    while remaining:
        seed = min(remaining)
        remaining.remove(seed)
        seed_types = set(pokemon_by_id[seed]["pokemon_type_id"].split(","))

        def score(candidate: int):
            candidate_types = set(pokemon_by_id[candidate]["pokemon_type_id"].split(","))
            shared_secondary = len((seed_types & candidate_types) - {pokemon_type})
            same_generation = generation(seed) == generation(candidate)
            return (-shared_secondary, -same_generation, abs(seed - candidate), candidate)

        companions = sorted(remaining, key=score)[:4]
        for pokemon_id in companions:
            remaining.remove(pokemon_id)
        groups.append([seed, *companions])
    return groups


generated_lines = []
for pokemon_type in sorted(buckets):
    type_groups = make_type_groups(pokemon_type, buckets[pokemon_type])
    base_title, base_subtitle, accent = TYPE_META[pokemon_type]
    for index, members in enumerate(type_groups, start=1):
        secondary_counts = Counter(
            candidate_type
            for pokemon_id in members
            for candidate_type in pokemon_by_id[pokemon_id]["pokemon_type_id"].split(",")
            if candidate_type != pokemon_type
        )
        shared_secondary = secondary_counts.most_common(1)[0][0] if secondary_counts and secondary_counts.most_common(1)[0][1] >= 3 else None
        subtitle = (
            f"{base_subtitle}, cộng hưởng cùng hệ {TYPE_LABELS[shared_secondary]}"
            if shared_secondary else base_subtitle
        )
        members_text = ", ".join(
            f"{{ id: {pokemon_id}, stage: {evolution_stage(pokemon_id)} }}"
            for pokemon_id in members
        )
        generated_lines.append(
            f'  {{ id: "{pokemon_type}-squad-{index}", title: "{base_title} {roman(index)}", '
            f'subtitle: "{subtitle}", accent: "{accent}", members: [{members_text}] }},'
        )

all_lines = fixed_lines + generated_lines
replacement = list_match.group(1) + "\n".join(all_lines) + list_match.group(3)
GROUP_FILE.write_text(source[:list_match.start()] + replacement + source[list_match.end():], encoding="utf-8")

all_ids = [
    int(value)
    for line in all_lines
    for value in re.findall(r"\{ id: (\d+), stage: [23] \}", line)
]
assert len(all_lines) == 96
assert len(all_ids) == 480
assert len(set(all_ids)) == 480
assert set(all_ids) == eligible_ids
assert all(len(re.findall(r"\{ id:", line)) == 6 for line in all_lines)

print(json.dumps({
    "groups": len(all_lines),
    "members": len(all_ids),
    "unique": len(set(all_ids)),
    "excluded_by_stage_two_style_rule": sorted(excluded_by_rule),
}, ensure_ascii=False))
