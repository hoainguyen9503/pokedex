export type PokemonGroupMember = {
  id: number;
  stage: 2 | 3;
};

export type PokemonGroup = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  members: PokemonGroupMember[];
};

export const POKEMON_GROUPS: PokemonGroup[] = [
  { id: "ancient-dragons", title: "Cổ Long Thức Tỉnh", subtitle: "Những long thú thống trị bầu trời", accent: "#cf5546", members: [{ id: 6, stage: 3 }, { id: 149, stage: 3 }, { id: 373, stage: 3 }, { id: 445, stage: 3 }, { id: 887, stage: 3 }] },
  { id: "steel-titans", title: "Titan Thép", subtitle: "Pháo đài sống với lớp giáp bất khuất", accent: "#8fa9b7", members: [{ id: 306, stage: 3 }, { id: 376, stage: 3 }, { id: 462, stage: 3 }, { id: 681, stage: 3 }, { id: 983, stage: 3 }] },
  { id: "shadow-assassins", title: "Sát Thủ Bóng Đêm", subtitle: "Nhanh, lặng lẽ và đầy sát khí", accent: "#8564c8", members: [{ id: 94, stage: 3 }, { id: 461, stage: 2 }, { id: 658, stage: 3 }, { id: 571, stage: 2 }, { id: 908, stage: 3 }] },
  { id: "blazing-warriors", title: "Chiến Binh Hỏa Diệm", subtitle: "Ý chí chiến đấu bùng cháy không ngừng", accent: "#ed7a35", members: [{ id: 59, stage: 2 }, { id: 257, stage: 3 }, { id: 392, stage: 3 }, { id: 500, stage: 3 }, { id: 937, stage: 2 }] },
  { id: "ocean-predators", title: "Hung Thần Biển Sâu", subtitle: "Những kẻ săn mồi dưới làn nước tối", accent: "#3e93c7", members: [{ id: 130, stage: 2 }, { id: 319, stage: 2 }, { id: 350, stage: 2 }, { id: 768, stage: 2 }, { id: 902, stage: 2 }] },
  { id: "forest-guardians", title: "Vệ Thần Đại Ngàn", subtitle: "Sức mạnh nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 3, stage: 3 }, { id: 254, stage: 3 }, { id: 389, stage: 3 }, { id: 724, stage: 3 }, { id: 812, stage: 3 }] },
  { id: "psychic-sovereigns", title: "Đế Chế Tâm Linh", subtitle: "Quyền năng bẻ cong ý chí và không gian", accent: "#d56c9b", members: [{ id: 65, stage: 3 }, { id: 196, stage: 2 }, { id: 282, stage: 3 }, { id: 475, stage: 3 }, { id: 858, stage: 3 }] },
  { id: "frozen-reapers", title: "Tử Thần Băng Giá", subtitle: "Hơi lạnh đóng băng mọi chiến trường", accent: "#75bcd4", members: [{ id: 91, stage: 2 }, { id: 478, stage: 2 }, { id: 473, stage: 3 }, { id: 614, stage: 2 }, { id: 998, stage: 3 }] },
  { id: "toxic-nightmares", title: "Ác Mộng Độc Tố", subtitle: "Nanh vuốt mang theo chất độc chí mạng", accent: "#9d63aa", members: [{ id: 34, stage: 3 }, { id: 169, stage: 3 }, { id: 452, stage: 2 }, { id: 454, stage: 2 }, { id: 904, stage: 2 }] },
  { id: "martial-legends", title: "Võ Thần Truyền Thuyết", subtitle: "Thể thuật được tôi luyện tới cực hạn", accent: "#d36b4d", members: [{ id: 68, stage: 3 }, { id: 106, stage: 2 }, { id: 448, stage: 2 }, { id: 534, stage: 3 }, { id: 979, stage: 3 }] },
  { id: "armored-knights", title: "Kỵ Sĩ Thiết Giáp", subtitle: "Lưỡi kiếm, áo giáp và danh dự", accent: "#c6a45d", members: [{ id: 212, stage: 2 }, { id: 589, stage: 2 }, { id: 823, stage: 3 }, { id: 865, stage: 2 }, { id: 936, stage: 2 }] },
  { id: "storm-lords", title: "Lãnh Chúa Lôi Đình", subtitle: "Sấm sét xé toạc bầu trời đêm", accent: "#d7b83f", members: [{ id: 26, stage: 3 }, { id: 181, stage: 3 }, { id: 405, stage: 3 }, { id: 466, stage: 3 }, { id: 738, stage: 3 }] },
  { id: "phantom-court", title: "Vương Triều Linh Hồn", subtitle: "Những bóng ma cai trị miền u tối", accent: "#7868bd", members: [{ id: 429, stage: 2 }, { id: 477, stage: 3 }, { id: 609, stage: 3 }, { id: 709, stage: 2 }, { id: 911, stage: 3 }] },
  { id: "desert-beasts", title: "Mãnh Thú Hoang Mạc", subtitle: "Sinh tồn giữa cát nóng và bão bụi", accent: "#c99658", members: [{ id: 28, stage: 2 }, { id: 330, stage: 3 }, { id: 553, stage: 3 }, { id: 530, stage: 2 }, { id: 980, stage: 2 }] },
  { id: "fairy-royals", title: "Hoàng Gia Tiên Giới", subtitle: "Vẻ đẹp thanh tao ẩn giấu ma lực lớn", accent: "#db8eb8", members: [{ id: 36, stage: 3 }, { id: 468, stage: 3 }, { id: 700, stage: 2 }, { id: 730, stage: 3 }, { id: 959, stage: 3 }] },
  { id: "dark-tyrants", title: "Bạo Chúa Hắc Ám", subtitle: "Uy áp khiến mọi đối thủ phải lùi bước", accent: "#6f748c", members: [{ id: 248, stage: 3 }, { id: 635, stage: 3 }, { id: 727, stage: 3 }, { id: 861, stage: 3 }, { id: 943, stage: 2 }] },
  { id: "winged-hunters", title: "Thợ Săn Không Trung", subtitle: "Đôi cánh sinh ra cho tốc độ và truy kích", accent: "#6d9fc4", members: [{ id: 18, stage: 3 }, { id: 398, stage: 3 }, { id: 663, stage: 3 }, { id: 715, stage: 2 }, { id: 941, stage: 2 }] },
  { id: "rock-colossi", title: "Cự Tượng Nham Thạch", subtitle: "Sức nặng nghiền nát mọi phòng tuyến", accent: "#a88b65", members: [{ id: 76, stage: 3 }, { id: 464, stage: 3 }, { id: 526, stage: 3 }, { id: 934, stage: 3 }, { id: 839, stage: 3 }] },
  { id: "insect-elite", title: "Côn Trùng Tinh Nhuệ", subtitle: "Giáp cứng, tốc độ và bản năng chiến đấu", accent: "#8fa64d", members: [{ id: 15, stage: 3 }, { id: 416, stage: 2 }, { id: 542, stage: 3 }, { id: 637, stage: 2 }, { id: 920, stage: 2 }] },
  { id: "aquatic-royalty", title: "Vương Giả Thủy Triều", subtitle: "Những chiến binh cao quý của đại dương", accent: "#4f8fc8", members: [{ id: 230, stage: 3 }, { id: 260, stage: 3 }, { id: 395, stage: 3 }, { id: 503, stage: 3 }, { id: 914, stage: 3 }] },
];

export function inspectPokemonGroups(groups: PokemonGroup[]) {
  const members = groups.flatMap((group) => group.members);
  const seen = new Set<number>();
  const duplicateIds = members.filter((member) => {
    if (seen.has(member.id)) return true;
    seen.add(member.id);
    return false;
  }).map((member) => member.id);

  return {
    groupCount: groups.length,
    memberCount: members.length,
    invalidGroupCount: groups.filter((group) => group.members.length !== 5).length,
    invalidStageCount: members.filter((member) => member.stage < 2).length,
    duplicateIds,
  };
}
