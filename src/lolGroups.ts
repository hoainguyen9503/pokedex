export type GroupableSkin = {
  id: string;
  num: number;
  name: string;
  championId: string;
  championName: string;
};

export type SkinGroup<T extends GroupableSkin> = {
  id: string;
  concept: string;
  skins: T[];
  isMixed: boolean;
};

const CONCEPT_RULES: Array<[string, string[]]> = [
  ["Esports & Nhà Vô Địch", ["cktg", "vo dich", "championship", "worlds", "msi", "t1", "skt", "drx", "dwg", "edg", "fpx", "ssg", "ig ", "fnatic"]],
  ["Vệ Binh Tinh Tú & Học Viện", ["ve binh tinh tu", "star guardian", "hoc vien chien binh", "battle academia", "hoc sinh", "giao su"]],
  ["Công Nghệ & Tương Lai", ["sieu pham", "project", "may moc", "mecha", "cong nghe", "pulsefire", "vu khi toi thuong", "chien binh thep", "omega", "cyber", "robot"]],
  ["Vũ Trụ & Thiên Thể", ["vu tru", "hac tinh", "dark star", "thien ha", "tinh tu", "nguyet", "nhat thuc", "thai duong", "cosmic", "khong gian"]],
  ["Hắc Ám & Kinh Dị", ["huyet nguyet", "ma su", "ac mong", "dia nguc", "tu than", "quy", "zombie", "thay ma", "huyen bi", "tien hac am", "coven", "noi am anh"]],
  ["Thần Thoại & Linh Giới", ["than long", "long", "tien kiem", "hoa linh", "linh hon", "bat tu", "son hai", "than", "spirit blossom", "huyen thoai"]],
  ["Âm Nhạc & Sân Khấu", ["k/da", "true damage", "pentakill", "am nhac", "ban nhac", "dj", "popstar", "rock", "vu cong"]],
  ["Lễ Hội & Thể Thao", ["tiec be boi", "pool party", "doi bong", "bong da", "sieu sao", "the thao", "giang sinh", "tuyet", "tet", "phao hoa", "le hoi", "tinh yeu", "valentine"]],
  ["Quân Đội & Chiến Binh", ["dac nhiem", "biet kich", "chien binh", "quan doan", "tuong cuop", "samurai", "cao boi", "high noon", "chien tuong", "do doc", "hiep si"]],
  ["Thiên Nhiên & Nguyên Tố", ["lua", "bang", "sam", "bien", "dai duong", "rung", "sa mac", "hoa", "ong", "nguyen to", "doc", "bao", "mua"]],
  ["Nghề Nghiệp & Đời Thường", ["bac si", "y ta", "canh sat", "dau bep", "cong so", "tho san", "phi cong", "tho mo", "giao vien", "phuc vu"]],
  ["Hoàng Gia & Thanh Lịch", ["hoang gia", "quy toc", "nu hoang", "vua", "hoang tu", "cong chua", "tien phong", "tien hac", "da hoi", "pha le"]],
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
}

function conceptOf(skin: GroupableSkin) {
  if (skin.num === 0) return "Tướng Nguyên Bản";
  const name = normalize(skin.name);
  return CONCEPT_RULES.find(([, keywords]) => keywords.some((keyword) => name.includes(keyword)))?.[0]
    ?? "Đa Vũ Trụ Ngoại Truyện";
}

function extractFullGroups<T extends GroupableSkin>(skins: T[], concept: string) {
  const queues = new Map<string, T[]>();
  skins.forEach((skin) => queues.set(skin.championId, [...(queues.get(skin.championId) ?? []), skin]));
  const groups: SkinGroup<T>[] = [];

  while ([...queues.values()].filter((queue) => queue.length).length >= 5) {
    const candidates = [...queues.entries()]
      .filter(([, queue]) => queue.length)
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .slice(0, 5);
    const picked = candidates.map(([, queue]) => queue.shift()!);
    groups.push({ id: "", concept, skins: picked, isMixed: concept === "Đa Vũ Trụ Ngoại Truyện" });
  }

  return { groups, leftovers: [...queues.values()].flat() };
}

function validGroups<T extends GroupableSkin>(groups: SkinGroup<T>[], source: T[]) {
  const grouped = groups.flatMap((group) => group.skins);
  const ids = new Set(grouped.map((skin) => skin.id));
  return grouped.length === source.length
    && ids.size === source.length
    && groups.every((group) => new Set(group.skins.map((skin) => skin.championId)).size === group.skins.length);
}

export function buildSkinGroups<T extends GroupableSkin>(skins: T[]) {
  const buckets = new Map<string, T[]>();
  skins.forEach((skin) => {
    const concept = conceptOf(skin);
    buckets.set(concept, [...(buckets.get(concept) ?? []), skin]);
  });

  const groups: SkinGroup<T>[] = [];
  const overflow: T[] = [];
  [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b, "vi")).forEach(([concept, items]) => {
    const result = extractFullGroups(items, concept);
    groups.push(...result.groups);
    overflow.push(...result.leftovers);
  });

  const mixed = extractFullGroups(overflow, "Đa Vũ Trụ Ngoại Truyện");
  groups.push(...mixed.groups);
  if (mixed.leftovers.length) {
    groups.push({ id: "", concept: "Biệt Đội Ngoại Truyện", skins: mixed.leftovers, isMixed: true });
  }

  groups.forEach((group, index) => { group.id = `group-${String(index + 1).padStart(3, "0")}`; });
  if (!validGroups(groups, skins)) {
    const fallback = extractFullGroups(skins, "Đa Vũ Trụ Tổng Hợp");
    const safe = [...fallback.groups];
    if (fallback.leftovers.length) safe.push({ id: "", concept: "Biệt Đội Ngoại Truyện", skins: fallback.leftovers, isMixed: true });
    safe.forEach((group, index) => { group.id = `group-${String(index + 1).padStart(3, "0")}`; });
    return safe;
  }
  return groups;
}

export function inspectSkinGroups<T extends GroupableSkin>(groups: SkinGroup<T>[], sourceCount: number) {
  const all = groups.flatMap((group) => group.skins);
  return {
    groupCount: groups.length,
    skinCount: all.length,
    uniqueSkinCount: new Set(all.map((skin) => skin.id)).size,
    groupsWithDuplicateChampion: groups.filter((group) =>
      new Set(group.skins.map((skin) => skin.championId)).size !== group.skins.length).length,
    complete: all.length === sourceCount && new Set(all.map((skin) => skin.id)).size === sourceCount,
  };
}
