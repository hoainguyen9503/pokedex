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
  { id: "bug-squad-1", title: "Binh Đoàn Giáp Trùng I", subtitle: "bản năng chiến đấu dưới lớp giáp cứng", accent: "#8fa64d", members: [{ id: 11, stage: 2 }, { id: 12, stage: 3 }, { id: 14, stage: 2 }, { id: 47, stage: 2 }, { id: 49, stage: 2 }] },
  { id: "bug-squad-2", title: "Binh Đoàn Giáp Trùng II", subtitle: "bản năng chiến đấu dưới lớp giáp cứng, cộng hưởng cùng hệ Bay", accent: "#8fa64d", members: [{ id: 166, stage: 2 }, { id: 267, stage: 3 }, { id: 284, stage: 2 }, { id: 291, stage: 2 }, { id: 414, stage: 2 }] },
  { id: "bug-squad-3", title: "Binh Đoàn Giáp Trùng III", subtitle: "bản năng chiến đấu dưới lớp giáp cứng, cộng hưởng cùng hệ Độc", accent: "#8fa64d", members: [{ id: 168, stage: 2 }, { id: 269, stage: 3 }, { id: 544, stage: 2 }, { id: 545, stage: 3 }, { id: 205, stage: 2 }] },
  { id: "bug-squad-4", title: "Binh Đoàn Giáp Trùng IV", subtitle: "bản năng chiến đấu dưới lớp giáp cứng", accent: "#8fa64d", members: [{ id: 266, stage: 2 }, { id: 268, stage: 2 }, { id: 292, stage: 2 }, { id: 402, stage: 2 }, { id: 413, stage: 2 }] },
  { id: "bug-squad-5", title: "Binh Đoàn Giáp Trùng V", subtitle: "bản năng chiến đấu dưới lớp giáp cứng", accent: "#8fa64d", members: [{ id: 469, stage: 2 }, { id: 666, stage: 3 }, { id: 541, stage: 2 }, { id: 558, stage: 2 }, { id: 596, stage: 2 }] },
  { id: "bug-squad-6", title: "Binh Đoàn Giáp Trùng VI", subtitle: "bản năng chiến đấu dưới lớp giáp cứng", accent: "#8fa64d", members: [{ id: 617, stage: 2 }, { id: 665, stage: 2 }, { id: 737, stage: 2 }, { id: 743, stage: 2 }, { id: 825, stage: 2 }] },
  { id: "bug-squad-7", title: "Binh Đoàn Giáp Trùng VII", subtitle: "bản năng chiến đấu dưới lớp giáp cứng", accent: "#8fa64d", members: [{ id: 826, stage: 3 }, { id: 954, stage: 2 }, { id: 873, stage: 2 }, { id: 900, stage: 2 }, { id: 918, stage: 2 }] },
  { id: "dark-squad-1", title: "Quân Đoàn Hắc Ám I", subtitle: "uy áp và bản năng săn mồi trong đêm", accent: "#6f748c", members: [{ id: 197, stage: 2 }, { id: 262, stage: 2 }, { id: 430, stage: 2 }, { id: 510, stage: 2 }, { id: 560, stage: 2 }] },
  { id: "dark-squad-2", title: "Quân Đoàn Hắc Ám II", subtitle: "uy áp và bản năng săn mồi trong đêm", accent: "#6f748c", members: [{ id: 634, stage: 2 }, { id: 687, stage: 2 }, { id: 828, stage: 2 }, { id: 860, stage: 2 }, { id: 862, stage: 3 }] },
  { id: "dragon-squad-1", title: "Long Tộc Viễn Cổ I", subtitle: "huyết mạch rồng thức tỉnh", accent: "#cf5546", members: [{ id: 148, stage: 2 }, { id: 372, stage: 2 }, { id: 444, stage: 2 }, { id: 611, stage: 2 }, { id: 612, stage: 3 }] },
  { id: "dragon-squad-2", title: "Long Tộc Viễn Cổ II", subtitle: "huyết mạch rồng thức tỉnh", accent: "#cf5546", members: [{ id: 705, stage: 2 }, { id: 706, stage: 3 }, { id: 783, stage: 2 }, { id: 886, stage: 2 }, { id: 997, stage: 2 }] },
  { id: "electric-squad-1", title: "Biệt Đội Lôi Đình I", subtitle: "tốc độ và điện năng xé toạc chiến trường", accent: "#d7b83f", members: [{ id: 25, stage: 2 }, { id: 101, stage: 2 }, { id: 125, stage: 2 }, { id: 135, stage: 2 }, { id: 180, stage: 2 }] },
  { id: "electric-squad-2", title: "Biệt Đội Lôi Đình II", subtitle: "tốc độ và điện năng xé toạc chiến trường", accent: "#d7b83f", members: [{ id: 310, stage: 2 }, { id: 404, stage: 2 }, { id: 523, stage: 2 }, { id: 603, stage: 2 }, { id: 604, stage: 3 }] },
  { id: "electric-squad-3", title: "Biệt Đội Lôi Đình III", subtitle: "tốc độ và điện năng xé toạc chiến trường", accent: "#d7b83f", members: [{ id: 695, stage: 2 }, { id: 836, stage: 2 }, { id: 849, stage: 2 }, { id: 922, stage: 2 }, { id: 939, stage: 2 }] },
  { id: "fairy-squad-1", title: "Cung Điện Tiên Giới I", subtitle: "ma lực thanh tao nhưng đầy quyền năng", accent: "#db8eb8", members: [{ id: 35, stage: 2 }, { id: 40, stage: 3 }, { id: 210, stage: 2 }, { id: 670, stage: 2 }, { id: 671, stage: 3 }] },
  { id: "fairy-squad-2", title: "Cung Điện Tiên Giới II", subtitle: "ma lực thanh tao nhưng đầy quyền năng", accent: "#db8eb8", members: [{ id: 683, stage: 2 }, { id: 685, stage: 2 }, { id: 869, stage: 2 }, { id: 927, stage: 2 }, { id: 958, stage: 2 }] },
  { id: "fighting-squad-1", title: "Võ Đường Chiến Thần I", subtitle: "thể thuật được tôi luyện tới cực hạn", accent: "#d36b4d", members: [{ id: 57, stage: 2 }, { id: 67, stage: 2 }, { id: 107, stage: 2 }, { id: 237, stage: 2 }, { id: 297, stage: 2 }] },
  { id: "fighting-squad-2", title: "Võ Đường Chiến Thần II", subtitle: "thể thuật được tôi luyện tới cực hạn", accent: "#d36b4d", members: [{ id: 308, stage: 2 }, { id: 533, stage: 2 }, { id: 620, stage: 2 }, { id: 675, stage: 2 }, { id: 740, stage: 2 }] },
  { id: "fighting-squad-3", title: "Võ Đường Chiến Thần III", subtitle: "thể thuật được tôi luyện tới cực hạn", accent: "#d36b4d", members: [{ id: 784, stage: 3 }, { id: 853, stage: 2 }, { id: 892, stage: 2 }, { id: 903, stage: 2 }, { id: 923, stage: 3 }] },
  { id: "fire-squad-1", title: "Quân Đoàn Hỏa Diệm I", subtitle: "ngọn lửa chiến đấu không bao giờ tắt", accent: "#ed7a35", members: [{ id: 5, stage: 2 }, { id: 38, stage: 2 }, { id: 78, stage: 2 }, { id: 126, stage: 2 }, { id: 136, stage: 2 }] },
  { id: "fire-squad-2", title: "Quân Đoàn Hỏa Diệm II", subtitle: "ngọn lửa chiến đấu không bao giờ tắt", accent: "#ed7a35", members: [{ id: 156, stage: 2 }, { id: 157, stage: 3 }, { id: 229, stage: 2 }, { id: 256, stage: 2 }, { id: 323, stage: 2 }] },
  { id: "fire-squad-3", title: "Quân Đoàn Hỏa Diệm III", subtitle: "ngọn lửa chiến đấu không bao giờ tắt", accent: "#ed7a35", members: [{ id: 391, stage: 2 }, { id: 499, stage: 2 }, { id: 467, stage: 3 }, { id: 514, stage: 2 }, { id: 555, stage: 2 }] },
  { id: "fire-squad-4", title: "Quân Đoàn Hỏa Diệm IV", subtitle: "ngọn lửa chiến đấu không bao giờ tắt", accent: "#ed7a35", members: [{ id: 608, stage: 2 }, { id: 654, stage: 2 }, { id: 655, stage: 3 }, { id: 662, stage: 2 }, { id: 668, stage: 2 }] },
  { id: "fire-squad-5", title: "Quân Đoàn Hỏa Diệm V", subtitle: "ngọn lửa chiến đấu không bao giờ tắt", accent: "#ed7a35", members: [{ id: 726, stage: 2 }, { id: 814, stage: 2 }, { id: 815, stage: 3 }, { id: 851, stage: 2 }, { id: 910, stage: 2 }] },
  { id: "flying-squad-1", title: "Phi Đội Thiên Không I", subtitle: "đôi cánh làm chủ tầng không", accent: "#6d9fc4", members: [{ id: 334, stage: 2 }, { id: 528, stage: 2 }, { id: 630, stage: 2 }, { id: 733, stage: 3 }, { id: 822, stage: 2 }] },
  { id: "ghost-squad-1", title: "Đoàn Quân Linh Hồn I", subtitle: "những bóng ma bước ra từ cõi tối", accent: "#7868bd", members: [{ id: 93, stage: 2 }, { id: 354, stage: 2 }, { id: 356, stage: 2 }, { id: 426, stage: 2 }, { id: 563, stage: 2 }] },
  { id: "ghost-squad-2", title: "Đoàn Quân Linh Hồn II", subtitle: "những bóng ma bước ra từ cõi tối", accent: "#7868bd", members: [{ id: 711, stage: 2 }, { id: 770, stage: 2 }, { id: 855, stage: 2 }, { id: 864, stage: 2 }, { id: 972, stage: 2 }] },
  { id: "grass-squad-1", title: "Hộ Vệ Đại Ngàn I", subtitle: "sinh lực nguyên thủy của rừng xanh, cộng hưởng cùng hệ Độc", accent: "#59a765", members: [{ id: 2, stage: 2 }, { id: 44, stage: 2 }, { id: 45, stage: 3 }, { id: 70, stage: 2 }, { id: 71, stage: 3 }] },
  { id: "grass-squad-2", title: "Hộ Vệ Đại Ngàn II", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 103, stage: 2 }, { id: 153, stage: 2 }, { id: 154, stage: 3 }, { id: 182, stage: 3 }, { id: 188, stage: 2 }] },
  { id: "grass-squad-3", title: "Hộ Vệ Đại Ngàn III", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 189, stage: 3 }, { id: 723, stage: 2 }, { id: 192, stage: 2 }, { id: 253, stage: 2 }, { id: 274, stage: 2 }] },
  { id: "grass-squad-4", title: "Hộ Vệ Đại Ngàn IV", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 275, stage: 3 }, { id: 332, stage: 2 }, { id: 286, stage: 2 }, { id: 388, stage: 2 }, { id: 407, stage: 3 }] },
  { id: "grass-squad-5", title: "Hộ Vệ Đại Ngàn V", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 421, stage: 2 }, { id: 460, stage: 2 }, { id: 465, stage: 2 }, { id: 470, stage: 2 }, { id: 496, stage: 2 }] },
  { id: "grass-squad-6", title: "Hộ Vệ Đại Ngàn VI", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 497, stage: 3 }, { id: 512, stage: 2 }, { id: 547, stage: 2 }, { id: 549, stage: 2 }, { id: 591, stage: 2 }] },
  { id: "grass-squad-7", title: "Hộ Vệ Đại Ngàn VII", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 598, stage: 2 }, { id: 651, stage: 2 }, { id: 652, stage: 3 }, { id: 673, stage: 2 }, { id: 754, stage: 2 }] },
  { id: "grass-squad-8", title: "Hộ Vệ Đại Ngàn VIII", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 756, stage: 2 }, { id: 762, stage: 2 }, { id: 763, stage: 3 }, { id: 811, stage: 2 }, { id: 830, stage: 2 }] },
  { id: "grass-squad-9", title: "Hộ Vệ Đại Ngàn IX", subtitle: "sinh lực nguyên thủy của rừng xanh, cộng hưởng cùng hệ Rồng", accent: "#59a765", members: [{ id: 841, stage: 2 }, { id: 842, stage: 2 }, { id: 1011, stage: 2 }, { id: 1019, stage: 3 }, { id: 907, stage: 2 }] },
  { id: "grass-squad-10", title: "Hộ Vệ Đại Ngàn X", subtitle: "sinh lực nguyên thủy của rừng xanh", accent: "#59a765", members: [{ id: 929, stage: 2 }, { id: 930, stage: 3 }, { id: 947, stage: 2 }, { id: 952, stage: 2 }, { id: 1013, stage: 2 }] },
  { id: "ground-squad-1", title: "Kỵ Binh Địa Chấn I", subtitle: "sức mạnh rung chuyển mặt đất", accent: "#c99658", members: [{ id: 51, stage: 2 }, { id: 105, stage: 2 }, { id: 112, stage: 2 }, { id: 232, stage: 2 }, { id: 329, stage: 2 }] },
  { id: "ground-squad-2", title: "Kỵ Binh Địa Chấn II", subtitle: "sức mạnh rung chuyển mặt đất", accent: "#c99658", members: [{ id: 344, stage: 2 }, { id: 450, stage: 2 }, { id: 472, stage: 2 }, { id: 552, stage: 2 }, { id: 623, stage: 2 }] },
  { id: "ground-squad-3", title: "Kỵ Binh Địa Chấn III", subtitle: "sức mạnh rung chuyển mặt đất", accent: "#c99658", members: [{ id: 750, stage: 2 }, { id: 844, stage: 2 }, { id: 867, stage: 2 }, { id: 901, stage: 3 }, { id: 949, stage: 2 }] },
  { id: "ice-squad-1", title: "Quân Đoàn Băng Giá I", subtitle: "hơi lạnh khóa chặt mọi đối thủ", accent: "#75bcd4", members: [{ id: 124, stage: 2 }, { id: 866, stage: 3 }, { id: 221, stage: 2 }, { id: 362, stage: 2 }, { id: 364, stage: 2 }] },
  { id: "ice-squad-2", title: "Quân Đoàn Băng Giá II", subtitle: "hơi lạnh khóa chặt mọi đối thủ", accent: "#75bcd4", members: [{ id: 471, stage: 2 }, { id: 583, stage: 2 }, { id: 584, stage: 3 }, { id: 713, stage: 2 }, { id: 975, stage: 2 }] },
  { id: "normal-squad-1", title: "Bản Năng Hoang Dã I", subtitle: "sức mạnh bản năng và khả năng thích nghi, cộng hưởng cùng hệ Bay", accent: "#a8a29a", members: [{ id: 17, stage: 2 }, { id: 22, stage: 2 }, { id: 85, stage: 2 }, { id: 164, stage: 2 }, { id: 277, stage: 2 }] },
  { id: "normal-squad-2", title: "Bản Năng Hoang Dã II", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 20, stage: 2 }, { id: 39, stage: 2 }, { id: 53, stage: 2 }, { id: 143, stage: 2 }, { id: 162, stage: 2 }] },
  { id: "normal-squad-3", title: "Bản Năng Hoang Dã III", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 217, stage: 2 }, { id: 242, stage: 3 }, { id: 264, stage: 2 }, { id: 288, stage: 2 }, { id: 289, stage: 3 }] },
  { id: "normal-squad-4", title: "Bản Năng Hoang Dã IV", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 294, stage: 2 }, { id: 295, stage: 3 }, { id: 301, stage: 2 }, { id: 397, stage: 2 }, { id: 400, stage: 2 }] },
  { id: "normal-squad-5", title: "Bản Năng Hoang Dã V", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 424, stage: 2 }, { id: 428, stage: 2 }, { id: 432, stage: 2 }, { id: 463, stage: 2 }, { id: 474, stage: 3 }] },
  { id: "normal-squad-6", title: "Bản Năng Hoang Dã VI", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 505, stage: 2 }, { id: 507, stage: 2 }, { id: 508, stage: 3 }, { id: 520, stage: 2 }, { id: 521, stage: 3 }] },
  { id: "normal-squad-7", title: "Bản Năng Hoang Dã VII", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 573, stage: 2 }, { id: 586, stage: 2 }, { id: 628, stage: 2 }, { id: 660, stage: 2 }, { id: 732, stage: 2 }] },
  { id: "normal-squad-8", title: "Bản Năng Hoang Dã VIII", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 735, stage: 2 }, { id: 760, stage: 2 }, { id: 773, stage: 2 }, { id: 820, stage: 2 }, { id: 832, stage: 2 }] },
  { id: "normal-squad-9", title: "Bản Năng Hoang Dã IX", subtitle: "sức mạnh bản năng và khả năng thích nghi", accent: "#a8a29a", members: [{ id: 899, stage: 2 }, { id: 981, stage: 2 }, { id: 916, stage: 2 }, { id: 925, stage: 2 }, { id: 982, stage: 2 }] },
  { id: "poison-squad-1", title: "Mật Hội Độc Tố I", subtitle: "nanh vuốt và độc tố đầy hiểm họa", accent: "#9d63aa", members: [{ id: 24, stage: 2 }, { id: 30, stage: 2 }, { id: 31, stage: 3 }, { id: 33, stage: 2 }, { id: 42, stage: 2 }] },
  { id: "poison-squad-2", title: "Mật Hội Độc Tố II", subtitle: "nanh vuốt và độc tố đầy hiểm họa", accent: "#9d63aa", members: [{ id: 89, stage: 2 }, { id: 110, stage: 2 }, { id: 317, stage: 2 }, { id: 435, stage: 2 }, { id: 569, stage: 2 }] },
  { id: "poison-squad-3", title: "Mật Hội Độc Tố III", subtitle: "nanh vuốt và độc tố đầy hiểm họa", accent: "#9d63aa", members: [{ id: 691, stage: 2 }, { id: 804, stage: 2 }, { id: 748, stage: 2 }, { id: 758, stage: 2 }, { id: 945, stage: 2 }] },
  { id: "psychic-squad-1", title: "Hội Đồng Tâm Linh I", subtitle: "tâm trí bẻ cong mọi giới hạn", accent: "#d56c9b", members: [{ id: 64, stage: 2 }, { id: 97, stage: 2 }, { id: 122, stage: 2 }, { id: 178, stage: 2 }, { id: 202, stage: 2 }] },
  { id: "psychic-squad-2", title: "Hội Đồng Tâm Linh II", subtitle: "tâm trí bẻ cong mọi giới hạn", accent: "#d56c9b", members: [{ id: 281, stage: 2 }, { id: 326, stage: 2 }, { id: 358, stage: 2 }, { id: 518, stage: 2 }, { id: 575, stage: 2 }] },
  { id: "psychic-squad-3", title: "Hội Đồng Tâm Linh III", subtitle: "tâm trí bẻ cong mọi giới hạn", accent: "#d56c9b", members: [{ id: 576, stage: 3 }, { id: 578, stage: 2 }, { id: 579, stage: 3 }, { id: 606, stage: 2 }, { id: 678, stage: 2 }] },
  { id: "psychic-squad-4", title: "Hội Đồng Tâm Linh IV", subtitle: "tâm trí bẻ cong mọi giới hạn", accent: "#d56c9b", members: [{ id: 790, stage: 2 }, { id: 791, stage: 3 }, { id: 792, stage: 3 }, { id: 857, stage: 2 }, { id: 956, stage: 2 }] },
  { id: "rock-squad-1", title: "Vệ Binh Nham Thạch I", subtitle: "sức nặng nghiền nát mọi phòng tuyến", accent: "#a88b65", members: [{ id: 75, stage: 2 }, { id: 247, stage: 2 }, { id: 139, stage: 2 }, { id: 141, stage: 2 }, { id: 185, stage: 2 }] },
  { id: "rock-squad-2", title: "Vệ Binh Nham Thạch II", subtitle: "sức nặng nghiền nát mọi phòng tuyến", accent: "#a88b65", members: [{ id: 219, stage: 2 }, { id: 838, stage: 2 }, { id: 346, stage: 2 }, { id: 348, stage: 2 }, { id: 409, stage: 2 }] },
  { id: "rock-squad-3", title: "Vệ Binh Nham Thạch III", subtitle: "sức nặng nghiền nát mọi phòng tuyến", accent: "#a88b65", members: [{ id: 411, stage: 2 }, { id: 476, stage: 2 }, { id: 525, stage: 2 }, { id: 567, stage: 2 }, { id: 689, stage: 2 }] },
  { id: "rock-squad-4", title: "Vệ Binh Nham Thạch IV", subtitle: "sức nặng nghiền nát mọi phòng tuyến", accent: "#a88b65", members: [{ id: 697, stage: 2 }, { id: 699, stage: 2 }, { id: 745, stage: 2 }, { id: 933, stage: 2 }, { id: 970, stage: 2 }] },
  { id: "steel-squad-1", title: "Cận Vệ Thiết Giáp I", subtitle: "pháo đài sống với lớp giáp bất khuất", accent: "#8fa9b7", members: [{ id: 82, stage: 2 }, { id: 208, stage: 2 }, { id: 305, stage: 2 }, { id: 375, stage: 2 }, { id: 437, stage: 2 }] },
  { id: "steel-squad-2", title: "Cận Vệ Thiết Giáp II", subtitle: "pháo đài sống với lớp giáp bất khuất", accent: "#8fa9b7", members: [{ id: 600, stage: 2 }, { id: 601, stage: 3 }, { id: 625, stage: 2 }, { id: 680, stage: 2 }, { id: 809, stage: 2 }] },
  { id: "steel-squad-3", title: "Cận Vệ Thiết Giáp III", subtitle: "pháo đài sống với lớp giáp bất khuất", accent: "#8fa9b7", members: [{ id: 863, stage: 2 }, { id: 879, stage: 2 }, { id: 966, stage: 2 }, { id: 1000, stage: 2 }, { id: 1018, stage: 2 }] },
  { id: "water-squad-1", title: "Đội Hình Thủy Triều I", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 8, stage: 2 }, { id: 9, stage: 3 }, { id: 55, stage: 2 }, { id: 61, stage: 2 }, { id: 62, stage: 3 }] },
  { id: "water-squad-2", title: "Đội Hình Thủy Triều II", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 73, stage: 2 }, { id: 80, stage: 2 }, { id: 87, stage: 2 }, { id: 99, stage: 2 }, { id: 117, stage: 2 }] },
  { id: "water-squad-3", title: "Đội Hình Thủy Triều III", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 119, stage: 2 }, { id: 121, stage: 2 }, { id: 134, stage: 2 }, { id: 159, stage: 2 }, { id: 160, stage: 3 }] },
  { id: "water-squad-4", title: "Đội Hình Thủy Triều IV", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 171, stage: 2 }, { id: 183, stage: 2 }, { id: 184, stage: 3 }, { id: 186, stage: 3 }, { id: 195, stage: 2 }] },
  { id: "water-squad-5", title: "Đội Hình Thủy Triều V", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 199, stage: 2 }, { id: 224, stage: 2 }, { id: 226, stage: 2 }, { id: 259, stage: 2 }, { id: 271, stage: 2 }] },
  { id: "water-squad-6", title: "Đội Hình Thủy Triều VI", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 272, stage: 3 }, { id: 279, stage: 2 }, { id: 321, stage: 2 }, { id: 340, stage: 2 }, { id: 342, stage: 2 }] },
  { id: "water-squad-7", title: "Đội Hình Thủy Triều VII", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 365, stage: 3 }, { id: 367, stage: 2 }, { id: 368, stage: 2 }, { id: 394, stage: 2 }, { id: 419, stage: 2 }] },
  { id: "water-squad-8", title: "Đội Hình Thủy Triều VIII", subtitle: "sức mạnh cuộn trào của biển sâu, cộng hưởng cùng hệ Đất", accent: "#4f8fc8", members: [{ id: 423, stage: 2 }, { id: 536, stage: 2 }, { id: 537, stage: 3 }, { id: 457, stage: 2 }, { id: 502, stage: 2 }] },
  { id: "water-squad-9", title: "Đội Hình Thủy Triều IX", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 516, stage: 2 }, { id: 565, stage: 2 }, { id: 581, stage: 2 }, { id: 593, stage: 2 }, { id: 657, stage: 2 }] },
  { id: "water-squad-10", title: "Đội Hình Thủy Triều X", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 693, stage: 2 }, { id: 729, stage: 2 }, { id: 752, stage: 2 }, { id: 817, stage: 2 }, { id: 818, stage: 3 }] },
  { id: "water-squad-11", title: "Đội Hình Thủy Triều XI", subtitle: "sức mạnh cuộn trào của biển sâu", accent: "#4f8fc8", members: [{ id: 834, stage: 2 }, { id: 847, stage: 2 }, { id: 913, stage: 2 }, { id: 961, stage: 2 }, { id: 964, stage: 2 }] },
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
