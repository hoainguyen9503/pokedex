#!/usr/bin/env python3
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path

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

# Include every evolved base species and every alternate/special form.
eligible_keys = {
    key for key in pokemon_by_key
    if key[1] > 0 or evolution_stage(key[0]) >= 2
}

# A Pokémon belongs to every type concept it actually has. Special forms also
# belong to their own form concept, so cross-group repetition is intentional.
assigned = defaultdict(list)
for key in sorted(eligible_keys):
    row = pokemon_by_key[key]
    for pokemon_type in row["pokemon_type_id"].split(","):
        assigned[f"type:{pokemon_type}"].append(key)
    category = form_category(row)
    if category:
        assigned[f"form:{category}"].append(key)


def generation(pokemon_id: int) -> int:
    limits = (151, 251, 386, 493, 649, 721, 809, 905, 1025)
    return next(index + 1 for index, limit in enumerate(limits) if pokemon_id <= limit)


def make_groups(bucket: str, keys: list[tuple[int, int]]) -> list[list[tuple[int, int]]]:
    pool = sorted(set(keys))
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
        group = [seed, *companions]

        # Bucket sizes are not always divisible by five. Reuse the strongest
        # matching members from an earlier group to complete the final squad.
        # Repetition across groups is allowed, never inside one group.
        if len(group) < 5:
            padding = sorted((key for key in pool if key not in group), key=score)[:5 - len(group)]
            group.extend(padding)
        groups.append(group)
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

assert len(fixed_lines) == 20
assert set(all_keys) == eligible_keys
assert all(len(re.findall(r"\{ id:", line)) == 6 for line in all_lines)
assert all(
    len(keys) == len(set(keys))
    for line in all_lines
    for keys in [[
        (int(pokemon_id), int(sub_id or 0))
        for pokemon_id, sub_id in re.findall(r"\{ id: (\d+)(?:, subId: (\d+))?, stage: [123] \}", line)
    ]]
)

for bucket, expected_keys in assigned.items():
    bucket_prefix = bucket.replace(":", "-") + "-squad-"
    bucket_lines = [line for line in generated_lines if f'id: "{bucket_prefix}' in line]
    bucket_keys = {
        (int(pokemon_id), int(sub_id or 0))
        for line in bucket_lines
        for pokemon_id, sub_id in re.findall(r"\{ id: (\d+)(?:, subId: (\d+))?, stage: [123] \}", line)
    }
    assert set(expected_keys) <= bucket_keys

print(json.dumps({
    "groups": len(all_lines),
    "placements": len(all_keys),
    "base_evolved": sum(1 for key in set(all_keys) if key[1] == 0),
    "special_forms": sum(1 for key in set(all_keys) if key[1] > 0),
    "unique": len(set(all_keys)),
    "repeated_placements": len(all_keys) - len(set(all_keys)),
}, ensure_ascii=False))
