import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/data/giants.json");

// id | name | franchise | media | universe | kind | scale | height(m) | size label | status | Wikipedia page | reference | description
const raw = String.raw`
godzilla-1954|Godzilla (1954)|Godzilla|Phim|Toho Showa|Kaiju|Colossal|50|50 m|Chính thức|Godzilla (1954 film)|https://godzilla.com/blogs/monsterpedia/godzilla|Bản Godzilla nguyên thủy trỗi dậy từ nỗi ám ảnh hạt nhân của Nhật Bản.
godzilla-heisei|Godzilla Heisei|Godzilla|Phim|Toho Heisei|Kaiju|Colossal|100|100 m|Chính thức|Godzilla vs. Destoroyah|https://godzilla.com/blogs/monsterpedia/godzilla|Hình thái Godzilla thời Heisei đạt mốc một trăm mét ở giai đoạn cuối.
godzilla-final-wars|Godzilla Final Wars|Godzilla|Phim|Toho Millennium|Kaiju|Colossal|100|100 m|Chính thức|Godzilla: Final Wars|https://godzilla.com/blogs/monsterpedia/godzilla|Godzilla chiến đấu liên tục với dàn kaiju trên toàn cầu.
godzilla-monsterverse|Godzilla MonsterVerse|MonsterVerse|Phim|MonsterVerse|Titan|Titanic|120|120 m|Chính thức|Godzilla (Monsterverse)|https://www.legendary.com/film/godzilla-vs-kong/|Alpha Titan hấp thụ bức xạ và duy trì trật tự của các Titan cổ đại.
godzilla-evolved|Godzilla Evolved|MonsterVerse|Phim|MonsterVerse|Titan|Titanic|120|Khoảng 120 m|Ước tính|Godzilla x Kong: The New Empire|https://www.legendary.com/film/godzilla-x-kong-the-new-empire/|Hình thái tiến hóa giàu năng lượng với gai lưng màu hồng đặc trưng.
shin-godzilla|Shin Godzilla Form IV|Godzilla|Phim|Shin Godzilla|Kaiju|Titanic|118.5|118,5 m|Chính thức|Shin Godzilla|https://godzilla.com/blogs/monsterpedia/godzilla|Sinh vật đột biến thích nghi liên tục với môi trường và vũ khí hiện đại.
godzilla-earth|Godzilla Earth|Godzilla|Anime,Phim|Godzilla Anime Trilogy|Kaiju|Supermassive|300|300 m|Chính thức|Godzilla: Planet of the Monsters|https://godzilla.com/blogs/monsterpedia/godzilla-earth|Godzilla tiến hóa suốt hai mươi nghìn năm và thống trị Trái Đất.
king-ghidorah-showa|King Ghidorah Showa|Godzilla|Phim|Toho Showa|Rồng ngoài hành tinh|Titanic|100|100 m|Chính thức|King Ghidorah|https://godzilla.com/blogs/monsterpedia/king-ghidorah|Rồng ba đầu ngoài hành tinh và đối thủ kinh điển của Godzilla.
king-ghidorah-monsterverse|King Ghidorah MonsterVerse|MonsterVerse|Phim|MonsterVerse|Titan ngoài hành tinh|Titanic|158.8|158,8 m|Chính thức|King Ghidorah (Monsterverse)|https://www.legendary.com/film/godzilla-king-of-the-monsters/|Titan ba đầu có thể tạo bão toàn cầu và điều khiển các Titan khác.
mechagodzilla-monsterverse|Mechagodzilla MonsterVerse|MonsterVerse|Phim|MonsterVerse|Mecha|Titanic|122|Khoảng 122 m|Ước tính|Mechagodzilla|https://www.legendary.com/film/godzilla-vs-kong/|Vũ khí chống Titan cơ giới được vận hành bởi mạng thần kinh của Ghidorah.
spacegodzilla|SpaceGodzilla|Godzilla|Phim|Toho Heisei|Kaiju vũ trụ|Titanic|120|120 m|Chính thức|Godzilla vs. SpaceGodzilla|https://godzilla.com/blogs/monsterpedia/spacegodzilla|Bản thể vũ trụ điều khiển tinh thể và năng lượng hấp dẫn.
destoroyah|Destoroyah Perfect Form|Godzilla|Phim|Toho Heisei|Kaiju|Titanic|120|120 m|Chính thức|Godzilla vs. Destoroyah|https://godzilla.com/blogs/monsterpedia/destoroyah|Sinh vật hợp thể tiến hóa từ vi sinh vật bị Oxygen Destroyer biến đổi.
biollante|Biollante|Godzilla|Phim|Toho Heisei|Kaiju thực vật|Titanic|120|120 m|Chính thức|Godzilla vs. Biollante|https://godzilla.com/blogs/monsterpedia/biollante|Hỗn hợp tế bào người, hoa hồng và Godzilla tạo thành thực vật khổng lồ.
gigan-final-wars|Gigan Final Wars|Godzilla|Phim|Toho Millennium|Cyborg kaiju|Titanic|120|120 m|Chính thức|Gigan|https://godzilla.com/blogs/monsterpedia/gigan|Cyborg ngoài hành tinh được trang bị lưỡi cưa và móc chiến đấu.
mothra-imago|Mothra Imago|Godzilla|Phim|Toho|Thần thú|Colossal|52|52 m · sải cánh 244 m|Chính thức|Mothra|https://godzilla.com/blogs/monsterpedia/mothra|Thần thú bảo hộ với sải cánh lớn và khả năng tái sinh theo vòng đời.
rodan-monsterverse|Rodan MonsterVerse|MonsterVerse|Phim|MonsterVerse|Titan bay|Colossal|46.9|46,9 m · sải cánh 265 m|Chính thức|Rodan (Monsterverse)|https://www.legendary.com/film/godzilla-king-of-the-monsters/|Titan núi lửa bay ở tốc độ siêu thanh và tạo sóng xung kích.
kong-monsterverse|Kong MonsterVerse|MonsterVerse|Phim|MonsterVerse|Titan linh trưởng|Titanic|102.7|102,7 m|Chính thức|King Kong (Monsterverse)|https://www.legendary.com/film/godzilla-vs-kong/|Người bảo hộ Skull Island và chiến binh Titan sử dụng vũ khí.
shimo|Shimo|MonsterVerse|Phim|MonsterVerse|Titan băng|Titanic|114|Khoảng 114 m|Ước tính|Godzilla x Kong: The New Empire|https://www.legendary.com/film/godzilla-x-kong-the-new-empire/|Titan nguyên thủy có hơi thở băng giá đủ sức tác động khí hậu toàn cầu.
skar-king|Skar King|MonsterVerse|Phim|MonsterVerse|Titan linh trưởng|Titanic|97|Khoảng 97 m|Ước tính|Godzilla x Kong: The New Empire|https://www.legendary.com/film/godzilla-x-kong-the-new-empire/|Bạo chúa linh trưởng cai trị bộ tộc Titan trong Hollow Earth.
female-muto|Female MUTO|MonsterVerse|Phim|MonsterVerse|Titan ký sinh|Colossal|91.4|91,4 m|Chính thức|Godzilla (2014 film)|https://www.legendary.com/film/godzilla/|Titan ký sinh có xung điện từ mạnh và thân hình đồ sộ.
muto-prime|MUTO Prime|MonsterVerse|Comics|MonsterVerse|Titan ký sinh|Colossal|95|Khoảng 95 m|Ước tính|Godzilla: Aftershock|https://www.legendary.com/comics/godzilla-aftershock/|Cá thể đầu đàn săn Godzilla và sinh sản trong vật chủ Titan.
gamera-heisei|Gamera Heisei|Gamera|Phim|Gamera Heisei|Kaiju hộ vệ|Colossal|80|80 m|Chính thức|Gamera: Guardian of the Universe|https://en.wikipedia.org/wiki/Gamera:_Guardian_of_the_Universe|Rùa kaiju do nền văn minh cổ tạo ra để bảo vệ Trái Đất.
iris-gamera|Iris|Gamera|Phim|Gamera Heisei|Kaiju tiến hóa|Colossal|99|99 m|Chính thức|Gamera 3: Revenge of Iris|https://en.wikipedia.org/wiki/Gamera_3:_Revenge_of_Iris|Sinh vật cộng sinh có khả năng hấp thụ năng lượng và ký ức.
cloverfield-monster|Cloverfield Monster|Cloverfield|Phim|Cloverfield|Sinh vật ngoài hành tinh|Colossal|73|Khoảng 73 m|Ước tính|Cloverfield|https://www.paramountpictures.com/movies/cloverfield|Sinh vật non gây thảm họa tại Manhattan trong góc nhìn found footage.
dune-sandworm|Shai-Hulud|Dune|Phim,Tiểu thuyết|Dune|Sinh vật sa mạc|Supermassive|400|Dài khoảng 400 m|Canon biến đổi|Sandworm (Dune)|https://www.dunemovie.com/|Sâu cát khổng lồ của Arrakis, trung tâm sinh thái và tín ngưỡng Fremen.
exogorth|Exogorth|Star Wars|Phim|Star Wars|Sinh vật không gian|Supermassive|900|Dài khoảng 900 m|Canon biến đổi|Exogorth|https://www.starwars.com/databank/exogorth|Sên không gian cư trú trong tiểu hành tinh và nuốt cả tàu vũ trụ.
krayt-dragon|Greater Krayt Dragon|Star Wars|Phim,Truyền hình|Star Wars|Rồng sa mạc|Titanic|100|Dài trên 100 m|Ước tính|Krayt dragon|https://www.starwars.com/databank/krayt-dragon|Kẻ săn mồi đỉnh cao dưới biển cát Tatooine.
smaug|Smaug|Middle-earth|Phim,Tiểu thuyết|Middle-earth|Rồng|Titanic|130|Dài khoảng 130 m|Ước tính điện ảnh|Smaug|https://www.warnerbros.com/movies/hobbit-desolation-smaug|Rồng lửa chiếm giữ kho báu Erebor và hủy diệt Lake-town.
stay-puft|Stay Puft Marshmallow Man|Ghostbusters|Phim|Ghostbusters|Thực thể siêu nhiên|Colossal|34.3|Khoảng 34 m|Ước tính|Stay Puft Marshmallow Man|https://www.sonypictures.com/movies/ghostbusters|Hình dạng hủy diệt được Gozer chọn từ ký ức vô hại của con người.
gipsy-danger|Gipsy Danger|Pacific Rim|Phim|Pacific Rim|Jaeger|Colossal|79.25|79,25 m|Chính thức|Gipsy Danger|https://www.legendary.com/film/pacific-rim/|Jaeger Mark-3 vận hành bởi hai phi công kết nối thần kinh.
striker-eureka|Striker Eureka|Pacific Rim|Phim|Pacific Rim|Jaeger|Colossal|76.2|76,2 m|Chính thức|Striker Eureka|https://www.legendary.com/film/pacific-rim/|Jaeger Mark-5 nhanh và mạnh, được trang bị tên lửa Sting-Blade.
chernobyl-alpha|Cherno Alpha|Pacific Rim|Phim|Pacific Rim|Jaeger|Colossal|85.3|85,3 m|Chính thức|Cherno Alpha|https://www.legendary.com/film/pacific-rim/|Jaeger Nga hạng nặng với thiết kế lò phản ứng kiên cố.
crimson-typhoon|Crimson Typhoon|Pacific Rim|Phim|Pacific Rim|Jaeger|Colossal|76.2|76,2 m|Chính thức|Crimson Typhoon|https://www.legendary.com/film/pacific-rim/|Jaeger ba tay được điều khiển bởi ba anh em nhà Wei.
slattern|Slattern|Pacific Rim|Phim|Pacific Rim|Kaiju|Titanic|181.7|181,7 m|Ước tính chính thức|Slattern|https://www.legendary.com/film/pacific-rim/|Kaiju Category V đầu tiên, bảo vệ Breach dưới đáy Thái Bình Dương.
mega-kaiju|Mega-Kaiju|Pacific Rim|Phim|Pacific Rim|Kaiju hợp thể|Titanic|128|Khoảng 128 m|Ước tính|Pacific Rim Uprising|https://www.legendary.com/film/pacific-rim-uprising/|Ba kaiju hợp nhất bằng công nghệ Ripper để tấn công Núi Phú Sĩ.
knifehead|Knifehead|Pacific Rim|Phim|Pacific Rim|Kaiju|Colossal|96|Khoảng 96 m|Ước tính|Pacific Rim (film)|https://www.legendary.com/film/pacific-rim/|Kaiju Category III với phần đầu như lưỡi dao khổng lồ.

colossal-titan|Colossal Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Colossal|60|60 m|Chính thức|Colossal Titan|https://attackontitan.jp/|Titan có thể biến đổi như vụ nổ và giải phóng hơi nóng.
founding-titan-eren|Eren Founding Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan thủy tổ|Supermassive|350|Dài hàng trăm mét|Ước tính từ hình ảnh|Eren Yeager|https://attackontitan.jp/|Hình thái Thủy Tổ kéo dài như một bộ xương khổng lồ dẫn đầu Rumbling.
rod-reiss-titan|Rod Reiss Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan bất thường|Titanic|120|120 m khi bò|Chính thức|List of Attack on Titan characters|https://attackontitan.jp/|Titan bất thường quá lớn để đứng thẳng và tỏa nhiệt dữ dội.
wall-titan|Wall Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Colossal|50|Khoảng 50 m|Chính thức|List of Attack on Titan characters|https://attackontitan.jp/|Hàng nghìn Titan được phong ấn trong các bức tường và giải phóng khi Rumbling bắt đầu.
beast-titan|Beast Titan Zeke|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Giant|17|17 m|Chính thức|Zeke Yeager|https://attackontitan.jp/|Titan hình linh trưởng với khả năng ném vật thể ở độ chính xác hủy diệt.
attack-titan|Attack Titan Eren|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Giant|15|15 m|Chính thức|Eren Yeager|https://attackontitan.jp/|Titan chiến đấu cơ động mang ý chí truy cầu tự do qua các thế hệ.
armored-titan|Armored Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Giant|15|15 m|Chính thức|Reiner Braun|https://attackontitan.jp/|Titan được bao phủ bởi lớp giáp cứng dùng để phá vỡ phòng tuyến.
female-titan|Female Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Giant|14|14 m|Chính thức|Annie Leonhart|https://attackontitan.jp/|Titan linh hoạt có khả năng hóa cứng và thu hút Pure Titan bằng tiếng hét.
war-hammer-titan|War Hammer Titan|Attack on Titan|Anime,Manga|Attack on Titan|Titan|Giant|15|15 m|Chính thức|War Hammer Titan|https://attackontitan.jp/|Titan tạo vũ khí và công trình từ vật chất hóa cứng.
zunesha|Zunesha|One Piece|Anime,Manga|One Piece|Voi cổ đại|Supermassive|35000|Khoảng 35 km|Canon được công bố|Zunesha|https://one-piece.com/|Voi cổ đại mang cả quốc gia Zou trên lưng và bước đi dưới đáy biển.
sanjuan-wolf|Sanjuan Wolf|One Piece|Anime,Manga|One Piece|Người khổng lồ|Titanic|180|Ít nhất 180 m|Canon|Sanjuan Wolf|https://one-piece.com/|Thành viên khổng lồ của băng Râu Đen có thể tăng kích thước nhờ Trái Ác Quỷ.
oars|Oars|One Piece|Anime,Manga|One Piece|Ancient Giant|Colossal|67|Khoảng 67 m|Canon|Oars (One Piece)|https://one-piece.com/|Ancient Giant được Gecko Moria hồi sinh để làm vũ khí tại Thriller Bark.
little-oars-jr|Little Oars Jr.|One Piece|Anime,Manga|One Piece|Ancient Giant|Colossal|60|Khoảng 60 m|Canon|Little Oars Jr.|https://one-piece.com/|Hậu duệ của Oars và đồng minh trung thành của Ace.
wadatsumi|Wadatsumi|One Piece|Anime,Manga|One Piece|Người cá khổng lồ|Colossal|80|Khoảng 80 m|Canon|Wadatsumi|https://one-piece.com/|Người cá cá nóc khổng lồ có thể phồng cơ thể lớn hơn nữa.
pica-stone|Pica Stone Assimilation|One Piece|Anime,Manga|One Piece|Người đá|Supermassive|1000|Cao hàng trăm mét|Ước tính|Pica (One Piece)|https://one-piece.com/|Pica đồng hóa với khối đá Dressrosa để tạo cơ thể khổng lồ.
kurama|Kurama|Naruto|Anime,Manga|Naruto|Vĩ thú|Titanic|100|Khoảng 100 m|Ước tính hình ảnh|Kurama (Naruto)|https://naruto-official.com/|Cửu Vĩ sở hữu lượng chakra khổng lồ và liên kết với Naruto.
ten-tails|Ten-Tails|Naruto|Anime,Manga|Naruto|Thần thú|Supermassive||Kích thước biến đổi, hàng trăm mét|Không có số canon|Ten-Tails|https://naruto-official.com/|Thể nguyên thủy của chakra và nguồn gốc của chín Vĩ thú.
gedo-statue|Demonic Statue of the Outer Path|Naruto|Anime,Manga|Naruto|Tượng thần|Titanic|100|Khoảng 100 m|Ước tính hình ảnh|Demonic Statue of the Outer Path|https://naruto-official.com/|Vỏ rỗng của Thập Vĩ được dùng để phong ấn các Vĩ thú.
perfect-susanoo|Perfect Susanoo|Naruto|Anime,Manga|Naruto|Avatar chakra|Titanic|100|Khoảng 100 m|Không có số canon|Susanoo (Naruto)|https://naruto-official.com/|Chiến thần chakra hoàn chỉnh có thể chém núi và bao bọc người sử dụng.
gamabunta|Gamabunta|Naruto|Anime,Manga|Naruto|Linh thú triệu hồi|Giant|17|Khoảng 17 m|Ước tính|Gamabunta|https://naruto-official.com/|Thủ lĩnh cóc Núi Myōboku chiến đấu bằng kiếm và nhẫn thuật dầu.
great-ape-vegeta|Great Ape Vegeta|Dragon Ball|Anime,Manga|Dragon Ball|Saiyan khổng lồ|Giant|20|Khoảng 20 m|Canon biến đổi|Great Ape|https://en.dragon-ball-official.com/|Hình thái Ōzaru nhân sức mạnh Saiyan lên gấp mười lần.
cell-max|Cell Max|Dragon Ball Super|Anime,Phim,Manga|Dragon Ball|Sinh vật nhân tạo|Titanic|100|Khoảng 100 m|Không có số canon|Cell Max|https://en.dragon-ball-official.com/|Vũ khí sinh học khổng lồ chưa hoàn thiện của Red Ribbon Army.
hirudegarn|Hirudegarn|Dragon Ball|Anime,Phim|Dragon Ball|Quái vật|Colossal|80|Khoảng 80 m|Ước tính|Dragon Ball Z: Wrath of the Dragon|https://en.dragon-ball-official.com/|Quái vật ma quỷ có thể tách thân và chuyển sang trạng thái vô hình.
anilaza|Anilaza|Dragon Ball Super|Anime,Manga|Dragon Ball|Chiến binh hợp thể|Colossal|80|Kích thước biến đổi|Không có số canon|Tournament of Power|https://en.dragon-ball-official.com/|Hợp thể khổng lồ của bốn chiến binh Vũ trụ 3 trong Tournament of Power.
super-shenron|Super Shenron|Dragon Ball Super|Anime,Manga|Dragon Ball Multiverse|Thần long|Cosmic||Lớn hơn thiên hà|Mô tả canon|Super Dragon Ball|https://en.dragon-ball-official.com/|Thần long vàng bao trùm các thiên hà khi được triệu hồi bằng Super Dragon Balls.
eva-unit-01|Evangelion Unit-01|Neon Genesis Evangelion|Anime,Manga,Phim|Evangelion|Bio-mecha|Colossal|80|Khoảng 40–200 m tùy cảnh|Quy mô không nhất quán|Evangelion Unit-01|https://www.evangelion.jp/|Đơn vị thử nghiệm chứa linh hồn và có khả năng thức tỉnh vượt giới hạn.
eva-unit-02|Evangelion Unit-02|Neon Genesis Evangelion|Anime,Manga,Phim|Evangelion|Bio-mecha|Colossal|80|Khoảng 40–200 m tùy cảnh|Quy mô không nhất quán|Evangelion Unit-02|https://www.evangelion.jp/|Evangelion sản xuất hoàn chỉnh đầu tiên với màu đỏ đặc trưng.
ramiel|Ramiel|Neon Genesis Evangelion|Anime,Manga,Phim|Evangelion|Angel|Colossal|80|Kích thước biến đổi|Không có số cố định|Ramiel|https://www.evangelion.jp/|Angel hình bát diện sử dụng pháo năng lượng và tái cấu trúc hình học.
sahaquiel|Sahaquiel|Neon Genesis Evangelion|Anime,Manga|Evangelion|Angel|Supermassive||Đường kính hàng kilomet|Ước tính hình ảnh|Sahaquiel|https://www.evangelion.jp/|Angel tấn công từ quỹ đạo bằng chính khối lượng cơ thể.
gurren-lagann-tt|Tengen Toppa Gurren Lagann|Gurren Lagann|Anime,Manga|Gurren Lagann Multiverse|Mecha ý chí|Cosmic||Quy mô thiên hà|Biểu tượng siêu không gian|Tengen Toppa Gurren Lagann|https://www.gurren-lagann.net/|Mecha sinh từ Spiral Power chiến đấu trên thang đo thiên hà.
super-ttgl|Super Tengen Toppa Gurren Lagann|Gurren Lagann|Anime,Phim|Gurren Lagann Multiverse|Mecha ý chí|Cosmic||Vượt quy mô vũ trụ quan sát được|Biểu tượng siêu không gian|Gurren Lagann the Movie: The Lights in the Sky are Stars|https://www.gurren-lagann.net/|Hình thái tối thượng được cấu thành hoàn toàn từ Spiral Power.
gigantomachia|Gigantomachia|My Hero Academia|Anime,Manga|My Hero Academia|Người khổng lồ|Giant|25|Khoảng 25 m|Canon biến đổi|Gigantomachia|https://heroaca.com/|Cận vệ khổng lồ của All For One có sức bền và nhiều Quirk.
mt-lady|Mt. Lady|My Hero Academia|Anime,Manga|My Hero Academia|Anh hùng biến hình|Giant|20.62|20,62 m|Chính thức|Mt. Lady|https://heroaca.com/|Pro Hero có Quirk Gigantification cho phép đạt kích thước cố định.
gerard-valkyrie|Gerard Valkyrie Giant Form|Bleach|Anime,Manga|Bleach|Quincy thần thánh|Titanic||Kích thước tăng liên tục|Không có số canon|Gerard Valkyrie|https://bleach-anime.com/|The Miracle biến thương tổn thành sức mạnh và kích thước ngày càng lớn.
kokujo-tengen|Kokujō Tengen Myō'ō|Bleach|Anime,Manga|Bleach|Bankai khổng lồ|Colossal|100|Khoảng 100 m|Ước tính|Sajin Komamura|https://bleach-anime.com/|Chiến binh giáp khổng lồ phản chiếu chuyển động của Komamura.
eternamax-eternatus|Eternamax Eternatus|Pokémon|Anime,Game|Pokémon|Pokémon ngoài hành tinh|Titanic|100|100 m|Chính thức|Eternatus|https://www.pokemon.com/us/pokedex/eternatus|Hình thái Eternamax hấp thụ năng lượng Galar và gây ra Darkest Day.
night-walker|Night-Walker|Princess Mononoke|Anime,Phim|Studio Ghibli|Thần rừng|Titanic||Cao vượt tán rừng|Không có số canon|Forest Spirit (Princess Mononoke)|https://www.ghibli.jp/works/mononoke/|Hình thái ban đêm khổng lồ của Thần Rừng kết nối sự sống và cái chết.
god-warrior|God Warrior|Nausicaä|Anime,Manga,Phim|Nausicaä|Vũ khí sinh học|Titanic||Cao hàng trăm mét|Không có số canon|Giant God Warrior Appears in Tokyo|https://www.ghibli.jp/works/nausicaa/|Vũ khí sinh học cổ đại từng thiêu rụi nền văn minh trong Seven Days of Fire.

iron-giant|The Iron Giant|The Iron Giant|Hoạt hình,Phim|Warner Animation|Robot ngoài hành tinh|Giant|15.24|15,24 m|Chính thức|The Iron Giant (character)|https://www.warnerbros.com/movies/iron-giant|Robot chiến tranh ngoài hành tinh lựa chọn trở thành người hùng thay vì vũ khí.
way-big|Way Big|Ben 10|Hoạt hình|Ben 10|To'kustar|Giant|30|Gần 30 m|Chính thức theo bible|Way Big|https://www.cartoonnetwork.com/|Biến hình To'kustar sở hữu sức mạnh và tia cosmic ray.
ultimate-way-big|Ultimate Way Big|Ben 10|Hoạt hình|Ben 10|To'kustar tiến hóa|Colossal|90|Khoảng 90 m|Ước tính hình ảnh|Way Big|https://www.cartoonnetwork.com/|Phiên bản tiến hóa có kích thước lớn hơn và giáp năng lượng.
white-diamond|White Diamond|Steven Universe|Hoạt hình|Steven Universe|Gem Diamond|Colossal|82|Khoảng 82 m|Ước tính từ model sheet|White Diamond|https://www.cartoonnetwork.com/|Diamond tối cao với khả năng điều khiển tâm trí các Gem khác.
yellow-diamond|Yellow Diamond|Steven Universe|Hoạt hình|Steven Universe|Gem Diamond|Giant|25|Khoảng 25 m|Ước tính|Yellow Diamond|https://www.cartoonnetwork.com/|Diamond chỉ huy quân sự sử dụng năng lượng làm mất ổn định hình thể Gem.
blue-diamond|Blue Diamond|Steven Universe|Hoạt hình|Steven Universe|Gem Diamond|Giant|25|Khoảng 25 m|Ước tính|Blue Diamond|https://www.cartoonnetwork.com/|Diamond có trường cảm xúc khiến sinh vật xung quanh chìm trong đau buồn.
obsidian|Obsidian|Steven Universe|Hoạt hình|Steven Universe|Gem Fusion|Giant|16|Khoảng 16 m|Ước tính|Obsidian (Steven Universe)|https://www.cartoonnetwork.com/|Fusion khổng lồ của Crystal Gems với thanh kiếm dung nham.
cluster|The Cluster|Steven Universe|Hoạt hình|Steven Universe|Gem Fusion|Planetary||Lõi hành tinh|Canon|The Cluster (Steven Universe)|https://www.cartoonnetwork.com/|Hàng triệu mảnh Gem cưỡng ép hợp thể bên trong Trái Đất.
golb|GOLB|Adventure Time|Hoạt hình|Adventure Time|Thực thể hỗn mang|Cosmic||Kích thước biến đổi|Không gian ngoài vũ trụ|GOLB|https://www.cartoonnetwork.com/|Hiện thân của hỗn loạn có thể làm biến dạng vật chất và sinh vật.
orgalorg|Orgalorg|Adventure Time|Hoạt hình|Adventure Time|Quái vật vũ trụ|Planetary||Kích thước hành tinh|Canon hình thái gốc|Orgalorg|https://www.cartoonnetwork.com/|Hình thái thật của Gunter, kẻ thống trị hệ Mặt Trời cổ xưa.
bill-cipher-giant|Bill Cipher Giant Form|Gravity Falls|Hoạt hình|Gravity Falls Multiverse|Dream demon|Titanic||Kích thước biến đổi|Không có số cố định|Bill Cipher|https://www.disneyplus.com/series/gravity-falls/HZxayxzMJqed|Ác quỷ giấc mơ thay đổi kích thước và vật lý trong Weirdmageddon.
time-baby|Time Baby|Gravity Falls|Hoạt hình|Gravity Falls Multiverse|Thực thể thời gian|Titanic||Kích thước biến đổi|Không có số cố định|Time Baby|https://www.disneyplus.com/series/gravity-falls/HZxayxzMJqed|Thực thể tương lai cai quản thời gian và đối đầu Bill Cipher.
cromulon|Cromulon|Rick and Morty|Hoạt hình|Rick and Morty Multiverse|Đầu khổng lồ ngoài hành tinh|Planetary||Cỡ hành tinh|Mô tả trong phim|Get Schwifty|https://www.adultswim.com/videos/rick-and-morty|Những chiếc đầu ngoài hành tinh tổ chức cuộc thi âm nhạc liên hành tinh.
aku-giant|Aku Giant Form|Samurai Jack|Hoạt hình|Samurai Jack|Ác quỷ biến hình|Titanic||Kích thước biến đổi|Không có số cố định|Aku|https://www.adultswim.com/videos/samurai-jack|Ác quỷ bóng tối nguyên thủy có thể biến thành vô số hình dạng khổng lồ.
chernabog|Chernabog|Fantasia|Hoạt hình,Phim|Disney|Ác thần|Titanic||Lớn như ngọn núi|Mô tả hình ảnh|Chernabog|https://www.disneyplus.com/movies/fantasia/3S4TSrQyOr1V|Ác thần trên Bald Mountain triệu hồi linh hồn trong đêm Walpurgis.
te-ka|Te Kā|Moana|Hoạt hình,Phim|Disney|Nữ thần dung nham|Colossal|90|Khoảng 90 m|Ước tính|Te Fiti|https://www.disneyplus.com/movies/moana/70GoJHflgHH9|Hình thái giận dữ bằng dung nham của Te Fiti khi mất trái tim.
lava-titan|Lava Titan|Hercules|Hoạt hình,Phim|Disney|Titan nguyên tố|Titanic||Cao hàng trăm mét|Không có số canon|Hercules (1997 film)|https://www.disneyplus.com/movies/hercules/2e02rZ2TfE0f|Một trong bốn Titan nguyên tố được Hades giải phóng khỏi Tartarus.
unicron|Unicron|Transformers|Hoạt hình,Phim,Comics|Transformers Multiverse|Transformer hành tinh|Planetary||Kích thước hành tinh|Canon biến đổi|Unicron|https://transformers.hasbro.com/|Thần hỗn mang biến đổi thành hành tinh và nuốt các thế giới.
primus|Primus|Transformers|Hoạt hình,Comics|Transformers Multiverse|Transformer hành tinh|Planetary||Kích thước hành tinh|Canon biến đổi|Primus (Transformers)|https://transformers.hasbro.com/|Thần sáng tạo của Cybertron và đối cực của Unicron.
metroplex|Metroplex|Transformers|Hoạt hình,Game,Comics|Transformers|Titan Transformer|Supermassive|240|Khoảng 240 m|Tùy continuity|Metroplex (Transformers)|https://transformers.hasbro.com/|Autobot City có thể chuyển đổi thành chiến binh Titan.
trypticon|Trypticon|Transformers|Hoạt hình,Game,Comics|Transformers|Titan Transformer|Supermassive|200|Khoảng 200 m|Tùy continuity|Trypticon|https://transformers.hasbro.com/|Pháo đài Decepticon biến thành khủng long cơ giới khổng lồ.
omega-supreme|Omega Supreme|Transformers|Hoạt hình,Game,Comics|Transformers|Transformer|Colossal|90|Kích thước biến đổi|Tùy continuity|Omega Supreme|https://transformers.hasbro.com/|Autobot Guardian biến thành căn cứ tên lửa và đường ray.
devastator|Devastator|Transformers|Hoạt hình,Phim,Comics|Transformers|Combiner|Colossal|46|Khoảng 30–46 m|Tùy continuity|Devastator (Transformers)|https://transformers.hasbro.com/|Sáu Constructicon hợp thể thành chiến binh phá hủy.

valus|Valus|Shadow of the Colossus|Game|Forbidden Lands|Colossus|Giant|21|Khoảng 21 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus hình người đầu tiên, mang chùy đá và lông để Wander leo bám.
quadratus|Quadratus|Shadow of the Colossus|Game|Forbidden Lands|Colossus|Giant|30|Khoảng 30 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus bò bốn chân sống trong thung lũng dưới cây cầu lớn.
gaius|Gaius|Shadow of the Colossus|Game|Forbidden Lands|Colossus|Colossal|54|Khoảng 54 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Hiệp sĩ đá khổng lồ sử dụng thanh kiếm như cột trụ.
phaedra|Phaedra|Shadow of the Colossus|Game|Forbidden Lands|Colossus|Giant|26|Khoảng 26 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus bốn chân có cấu trúc như ngựa và sống trong nghĩa địa.
avion|Avion|Shadow of the Colossus|Game|Forbidden Lands|Colossus bay|Colossal|30|Thân 30 m · sải cánh lớn|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Chim Colossus chiến đấu trên mặt hồ giữa các tàn tích.
hydrus|Hydrus|Shadow of the Colossus|Game|Forbidden Lands|Colossus thủy sinh|Colossal|60|Dài khoảng 60 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus dạng lươn điện sống dưới hồ sâu.
dirge|Dirge|Shadow of the Colossus|Game|Forbidden Lands|Colossus sa mạc|Colossal|45|Dài khoảng 45 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus rắn cát truy đuổi Wander dưới sa mạc.
phaslanx|Phalanx|Shadow of the Colossus|Game|Forbidden Lands|Colossus bay|Supermassive|170|Dài khoảng 170 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus dài nhất bay lượn bằng các túi khí trên sa mạc.
malus|Malus|Shadow of the Colossus|Game|Forbidden Lands|Colossus|Colossal|60|Khoảng 60 m|Ước tính|Shadow of the Colossus|https://www.playstation.com/games/shadow-of-the-colossus/|Colossus cuối cùng đứng giữa cơn bão và phóng năng lượng từ xa.
zorah-magdaros|Zorah Magdaros|Monster Hunter|Game|Monster Hunter|Elder Dragon|Supermassive|257.6|Dài 257,6 m|Chính thức|Zorah Magdaros|https://www.monsterhunter.com/world/|Elder Dragon núi lửa di cư đến New World để kết thúc vòng đời.
dalamadur|Dalamadur|Monster Hunter|Game|Monster Hunter|Elder Dragon|Supermassive|440.4|Dài 440,4 m|Chính thức|Dalamadur|https://www.monsterhunter.com/|Rắn Elder Dragon quấn quanh núi và gọi thiên thạch.
raviente|Raviente|Monster Hunter Frontier|Game|Monster Hunter|Elder Dragon|Supermassive|450|Dài khoảng 450 m|Chính thức|Monster Hunter Frontier G|https://www.monsterhunter.com/|Rắn Elder Dragon siêu lớn cần nhiều tổ đội thợ săn phối hợp.
lao-shan-lung|Lao-Shan Lung|Monster Hunter|Game|Monster Hunter|Elder Dragon|Colossal|69.6|Dài 69,6 m|Chính thức|Lao-Shan Lung|https://www.monsterhunter.com/|Elder Dragon cổ đại đi xuyên pháo đài trong hành trình di cư.
jhen-mohran|Jhen Mohran|Monster Hunter|Game|Monster Hunter|Elder Dragon|Titanic|111.6|Dài 111,6 m|Chính thức|Jhen Mohran|https://www.monsterhunter.com/|Cá voi cát khổng lồ bơi qua Great Desert.
safi-jiiva|Safi'jiiva|Monster Hunter|Game|Monster Hunter|Elder Dragon|Colossal|47.9|Dài 47,9 m|Chính thức|Safi'jiiva|https://www.monsterhunter.com/world-iceborne/|Red Dragon hấp thụ sinh năng của môi trường để tái tạo cơ thể.
fire-giant|Fire Giant|Elden Ring|Game|Lands Between|Người khổng lồ|Giant|24|Khoảng 24 m|Ước tính|Fire Giant|https://en.bandainamcoent.eu/elden-ring/elden-ring|Người khổng lồ cuối cùng canh giữ Flame of Ruin trên Mountaintops.
greyoll|Elder Dragon Greyoll|Elden Ring|Game|Lands Between|Rồng cổ đại|Titanic|182|Dài khoảng 182 m|Ước tính mô hình|Elden Ring|https://en.bandainamcoent.eu/elden-ring/elden-ring|Mẹ của loài rồng, nằm bất động giữa đàn con ở Dragonbarrow.
elden-beast|Elden Beast|Elden Ring|Game|Lands Between|Thực thể thần thánh|Colossal|60|Kích thước biến đổi|Ước tính mô hình|Elden Beast|https://en.bandainamcoent.eu/elden-ring/elden-ring|Sứ giả vũ trụ và hiện thân sống của Elden Ring.
astel|Astel Naturalborn of the Void|Elden Ring|Game|Lands Between|Sinh vật vũ trụ|Colossal|40|Dài hàng chục mét|Ước tính mô hình|Elden Ring|https://en.bandainamcoent.eu/elden-ring/elden-ring|Sinh vật dị dạng sinh ra trong Void điều khiển trọng lực và thiên thạch.
dragon-god|Dragon God|Demon's Souls|Game|Boletaria|Rồng quỷ|Colossal|70|Khoảng 70 m|Ước tính|Demon's Souls|https://www.playstation.com/games/demons-souls/|Archdemon bị giam trong đền cổ và bị hạ bằng ballista khổng lồ.
yhorm|Yhorm the Giant|Dark Souls III|Game|Lothric|Người khổng lồ|Giant|14|Khoảng 14 m|Ước tính mô hình|Yhorm the Giant|https://en.bandainamcoent.eu/dark-souls/dark-souls-iii|Lord of Cinder khổng lồ sử dụng đại đao để bảo vệ dân tộc.
high-lord-wolnir|High Lord Wolnir|Dark Souls III|Game|Lothric|Bộ xương khổng lồ|Colossal|30|Khoảng 30 m|Ước tính mô hình|High Lord Wolnir|https://en.bandainamcoent.eu/dark-souls/dark-souls-iii|Chúa tể xương bị Abyss nuốt chửng, bám vào các vòng tay thánh.
cronos-gow|Cronos|God of War|Game|God of War Greek|Titan|Supermassive|488|Khoảng 488 m|Ước tính mô hình|Cronos (God of War)|https://www.playstation.com/games/god-of-war-iii/|Titan bị Zeus trừng phạt, mang cả Đền Pandora trên lưng.
atlas-gow|Atlas|God of War|Game|God of War Greek|Titan|Supermassive|1600|Khoảng 1,6 km|Ước tính mô hình|Atlas (God of War)|https://www.playstation.com/games/god-of-war-ii/|Titan bốn tay bị buộc phải nâng thế giới trên vai.
jormungandr|Jörmungandr|God of War|Game|God of War Norse|World serpent|Planetary||Bao quanh Midgard|Mô tả canon|Jörmungandr|https://www.playstation.com/games/god-of-war-ragnarok/|World Serpent lớn đến mức cơ thể quấn quanh Midgard.
surtr-gow|Surtr Ragnarök Form|God of War|Game|God of War Norse|Fire giant|Supermassive|1000|Cao khoảng 1 km|Ước tính hình ảnh|Surtr|https://www.playstation.com/games/god-of-war-ragnarok/|Surtr hợp nhất với Sinmara để trở thành Ragnarök hủy diệt Asgard.
sin-ffx|Sin|Final Fantasy X|Game|Spira|Sinh vật thảm họa|Supermassive|1000|Dài khoảng 1 km|Ước tính|Sin (Final Fantasy X)|https://finalfantasyxhd.square-enix-games.com/|Vỏ giáp khổng lồ của Final Aeon liên tục tàn phá nền văn minh Spira.
adamantoise-ffxv|Adamantoise|Final Fantasy XV|Game|Eos|Quái thú núi|Titanic|100|Khoảng 100 m|Ước tính|Final Fantasy XV|https://finalfantasyxv.square-enix-games.com/|Rùa khổng lồ ngụy trang như một ngọn núi và là superboss lâu dài.
alexander-ff|Alexander|Final Fantasy|Game|Final Fantasy Multiverse|Pháo đài triệu hồi|Supermassive||Kích thước pháo đài|Tùy phiên bản|Alexander (Final Fantasy)|https://www.square-enix-games.com/|Summon dạng thành trì cơ giới sử dụng thánh quang và pháo năng lượng.
leviathan-ffxv|Leviathan|Final Fantasy XV|Game|Eos|Astral thủy long|Supermassive|500|Dài hàng trăm mét|Ước tính|Final Fantasy XV|https://finalfantasyxv.square-enix-games.com/|Astral thủy long tạo sóng thần khi thức tỉnh tại Altissia.
sovereign|Sovereign|Mass Effect|Game|Mass Effect|Reaper|Supermassive|2000|Dài khoảng 2 km|Canon|Sovereign (Mass Effect)|https://www.ea.com/games/mass-effect|Reaper tiên phong thao túng Saren để mở Citadel Relay.
harbinger|Harbinger|Mass Effect|Game|Mass Effect|Reaper|Supermassive|2000|Dài khoảng 2 km|Canon|Harbinger (Mass Effect)|https://www.ea.com/games/mass-effect|Reaper đầu tiên và lãnh đạo chu kỳ thu hoạch thiên hà.
deathwing|Deathwing|Warcraft|Game,Tiểu thuyết|Warcraft|Dragon Aspect|Supermassive||Kích thước biến đổi|Không có số cố định|Deathwing|https://worldofwarcraft.blizzard.com/|Dragon Aspect sa ngã làm vỡ Azeroth khi trỗi dậy từ Deepholm.
galakrond|Galakrond|Warcraft|Game,Tiểu thuyết|Warcraft|Proto-dragon|Supermassive||Lớn hơn nhiều lần Dragon Aspect|Không có số cố định|Galakrond|https://worldofwarcraft.blizzard.com/|Tổ tiên quái dị của loài rồng, xác trải dài tại Dragonblight.
sargeras|Sargeras|Warcraft|Game,Tiểu thuyết|Warcraft Cosmos|Titan|Planetary||Lớn hơn hành tinh|Mô tả canon|Sargeras|https://worldofwarcraft.blizzard.com/|Dark Titan lãnh đạo Burning Legion và có thể đâm kiếm xuyên Azeroth.
oryx-raid|Oryx Raid Form|Destiny|Game|Destiny|Hive god|Colossal|50|Khoảng 50 m|Ước tính mô hình|Oryx, the Taken King|https://www.bungie.net/7/en/Destiny|Taken King xuất hiện ở kích thước khổng lồ trong King's Fall.
riven|Riven of a Thousand Voices|Destiny|Game|Destiny|Ahamkara|Titanic||Kích thước biến đổi|Không có số cố định|Riven|https://www.bungie.net/7/en/Destiny|Ahamkara bị Taken hóa, thao túng điều ước trong Dreaming City.
fury-bowser|Fury Bowser|Super Mario|Game|Mushroom Kingdom|Koopa khổng lồ|Titanic|100|Khoảng 100 m|Ước tính|Bowser's Fury|https://www.nintendo.com/us/store/products/super-mario-3d-world-plus-bowsers-fury-switch/|Bowser bị black paint biến thành hình thái kaiju phun lửa.
dark-beast-ganon|Dark Beast Ganon|The Legend of Zelda|Game|Hyrule|Ma thú|Colossal|40|Khoảng 40 m|Ước tính|Ganon|https://www.nintendo.com/us/store/products/the-legend-of-zelda-breath-of-the-wild-switch/|Hình thái ma thú cuối cùng của Calamity Ganon trên cánh đồng Hyrule.
colgera|Colgera|The Legend of Zelda|Game|Hyrule|Quái vật băng|Colossal|60|Dài khoảng 60 m|Ước tính|The Legend of Zelda: Tears of the Kingdom|https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/|Quái vật băng bay trong bão tuyết phía trên Wind Temple.
perfect-chaos|Perfect Chaos|Sonic the Hedgehog|Game|Sonic|Thủy quái|Colossal|50|Khoảng 50 m|Ước tính|Chaos (Sonic the Hedgehog)|https://www.sonicthehedgehog.com/|Chaos hấp thụ bảy Chaos Emerald và biến Station Square thành đại dương.
void-termina|Void Termina|Kirby|Game|Kirby|Thần hủy diệt|Titanic||Kích thước biến đổi|Không có số cố định|Kirby Star Allies|https://www.nintendo.com/us/store/products/kirby-star-allies-switch/|Destroyer of Worlds được triệu hồi từ Jamba Heart.

galactus|Galactus|Marvel|Comics,Phim|Marvel Multiverse|Thực thể vũ trụ|Cosmic||Kích thước biến đổi|Canon biến đổi|Galactus|https://www.marvel.com/characters/galactus|Kẻ ăn hành tinh, tàn dư của vũ trụ trước và lực cân bằng vũ trụ.
arishem|Arishem the Judge|Marvel|Comics,Phim|Marvel Multiverse|Celestial|Supermassive|610|Khoảng 610 m trong MCU|Ước tính điện ảnh|Arishem the Judge|https://www.marvel.com/characters/arishem|Celestial xét xử các nền văn minh và giám sát quá trình Emergence.
tiamut|Tiamut the Communicator|Marvel|Comics,Phim|Marvel Multiverse|Celestial|Supermassive||Kích thước hàng trăm kilomet khi Emergence|Không có số cố định|Tiamut|https://www.marvel.com/|Celestial ngủ trong lõi Trái Đất và trỗi dậy trong Eternals.
ego|Ego the Living Planet|Marvel|Comics,Phim|Marvel Multiverse|Hành tinh sống|Planetary||Kích thước hành tinh|Canon|Ego the Living Planet|https://www.marvel.com/characters/ego|Hành tinh có ý thức, điều khiển toàn bộ vật chất trên bề mặt cơ thể.
eternity-marvel|Eternity|Marvel|Comics,Phim|Marvel Multiverse|Hiện thân vũ trụ|Cosmic||Bao hàm vũ trụ|Biểu tượng siêu hình|Eternity (Marvel Comics)|https://www.marvel.com/characters/eternity|Hiện thân nhân cách hóa của thời gian và toàn bộ vũ trụ.
living-tribunal|Living Tribunal|Marvel|Comics|Marvel Multiverse|Thẩm phán đa vũ trụ|Cosmic||Quy mô đa vũ trụ|Biểu tượng siêu hình|Living Tribunal|https://www.marvel.com/characters/living-tribunal|Thực thể ba mặt giám sát cân bằng giữa các thực tại Marvel.
dormammu|Dormammu|Marvel|Comics,Phim|Dark Dimension|Chúa tể chiều không gian|Cosmic||Kích thước biến đổi|Canon biến đổi|Dormammu|https://www.marvel.com/characters/dormammu|Thực thể năng lượng thống trị Dark Dimension và vượt ngoài thời gian thông thường.
fin-fang-foom|Fin Fang Foom|Marvel|Comics|Marvel Universe|Rồng ngoài hành tinh|Colossal|80|Kích thước biến đổi|Canon biến đổi|Fin Fang Foom|https://www.marvel.com/characters/fin-fang-foom|Makluan dạng rồng có sức mạnh và khả năng biến đổi kích thước.
giant-man|Giant-Man|Marvel|Comics,Phim|Marvel Universe|Anh hùng biến hình|Giant|30|Tối đa thường thấy khoảng 30 m|Canon biến đổi|Giant-Man|https://www.marvel.com/characters/giant-man|Pym Particles cho phép cơ thể tăng kích thước và sức mạnh.
anti-monitor|Anti-Monitor|DC|Comics,Hoạt hình|DC Multiverse|Thực thể phản vật chất|Cosmic||Kích thước biến đổi|Canon biến đổi|Anti-Monitor|https://www.dc.com/characters/anti-monitor|Kẻ hủy diệt vũ trụ gây ra Crisis on Infinite Earths.
perpetua|Perpetua|DC|Comics|DC Multiverse|Super Celestial|Cosmic||Quy mô đa vũ trụ|Biểu tượng siêu hình|Perpetua (character)|https://www.dc.com/|Mẹ của Monitor, Anti-Monitor và World Forger, kiến tạo Multiverse đầu tiên.
trigon|Trigon|DC|Comics,Hoạt hình|DC Multiverse|Ác thần liên chiều|Cosmic||Kích thước biến đổi|Canon biến đổi|Trigon (comics)|https://www.dc.com/characters/trigon|Ác thần cha của Raven chinh phục nhiều chiều không gian.
spectre|The Spectre|DC|Comics|DC Multiverse|Hiện thân thần phạt|Cosmic||Kích thước vũ trụ|Canon biến đổi|Spectre (DC Comics character)|https://www.dc.com/characters/spectre|Cơn thịnh nộ của Thượng Đế có thể mở rộng đến quy mô hành tinh và vũ trụ.
mogo|Mogo|DC|Comics,Hoạt hình|DC Universe|Green Lantern hành tinh|Planetary||Kích thước hành tinh|Canon|Mogo|https://www.dc.com/characters/mogo|Hành tinh sống là thành viên Green Lantern Corps và nơi dẫn đường cho nhẫn.
starro|Starro the Conqueror|DC|Comics,Phim,Hoạt hình|DC Universe|Sinh vật ngoài hành tinh|Colossal|50|Kích thước biến đổi|Canon biến đổi|Starro|https://www.dc.com/characters/starro|Sao biển ngoài hành tinh tạo các bản sao ký sinh để điều khiển tâm trí.
giganta|Giganta|DC|Comics,Hoạt hình|DC Universe|Nữ khổng lồ|Colossal|30|Kích thước biến đổi|Canon biến đổi|Giganta|https://www.dc.com/characters/giganta|Kẻ thù của Wonder Woman có thể tăng kích thước lên nhiều tầng nhà.
darkseid-true-form|Darkseid True Form|DC|Comics|DC Multiverse|New God|Cosmic||Vượt không-thời gian vật lý|Khái niệm siêu hình|Darkseid|https://www.dc.com/characters/darkseid|Bản thể thật tồn tại ngoài Multiverse và chỉ chiếu avatar vào các thực tại.
`.trim();

const records = raw.split("\n").filter(Boolean).map((line) => {
  const [id, name, franchise, media, universe, kind, scale, height, sizeLabel, measurement, wikiTitle, sourceUrl, description] = line.split("|");
  return {
    id, name, franchise, media: media.split(","), universe, kind, scale,
    heightMeters: height ? Number(height) : null,
    sizeLabel, measurement, wikiTitle, sourceUrl, description,
  };
});

async function wikipediaImages(titles) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query", format: "json", origin: "*", redirects: "1",
    prop: "pageimages", piprop: "original|thumbnail", pithumbsize: "1000",
    titles: titles.join("|"),
  });
  try {
    const response = await fetch(url, { headers: { "user-agent": "GiantCharacterArchive/1.0 (hoainguyen9503/pokedex)" } });
    if (!response.ok) return new Map();
    const data = await response.json();
    const aliases = new Map(titles.map((title) => [title.toLowerCase(), title.toLowerCase()]));
    for (const item of data.query?.normalized || []) aliases.set(item.from.toLowerCase(), item.to.toLowerCase());
    for (const item of data.query?.redirects || []) {
      const source = aliases.get(item.from.toLowerCase()) || item.from.toLowerCase();
      aliases.set(source, item.to.toLowerCase());
    }
    const pages = new Map(Object.values(data.query?.pages || {}).map((page) => [
      page.title.toLowerCase(), page.original?.source || page.thumbnail?.source || null,
    ]));
    return new Map(titles.map((title) => {
      const canonical = aliases.get(title.toLowerCase()) || title.toLowerCase();
      return [title, pages.get(canonical) || pages.get(title.toLowerCase()) || null];
    }));
  } catch {
    return new Map();
  }
}

const uniqueTitles = [...new Set(records.map((record) => record.wikiTitle))];
const imageByTitle = new Map();
for (let index = 0; index < uniqueTitles.length; index += 40) {
  const batch = uniqueTitles.slice(index, index + 40);
  const images = await wikipediaImages(batch);
  images.forEach((image, title) => imageByTitle.set(title, image));
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

async function openGraphImage(pageUrl) {
  try {
    const response = await fetch(pageUrl, {
      headers: { "user-agent": "Mozilla/5.0 GiantCharacterArchive/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const html = await response.text();
    const tag = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]*>/i)?.[0]
      || html.match(/<meta[^>]+content=["'][^"']+["'][^>]+(?:property|name)=["']og:image["'][^>]*>/i)?.[0];
    const content = tag?.match(/content=["']([^"']+)["']/i)?.[1];
    return content ? content.replaceAll("&amp;", "&") : null;
  } catch {
    return null;
  }
}

const uniqueSources = [...new Set(records.map((record) => record.sourceUrl))];
const imageBySource = new Map();
for (let index = 0; index < uniqueSources.length; index += 6) {
  const batch = uniqueSources.slice(index, index + 6);
  const images = await Promise.all(batch.map(openGraphImage));
  batch.forEach((source, imageIndex) => imageBySource.set(source, images[imageIndex]));
}

const franchiseImage = new Map();
for (const record of records) {
  const image = imageByTitle.get(record.wikiTitle) || imageBySource.get(record.sourceUrl);
  if (image && !franchiseImage.has(record.franchise)) franchiseImage.set(record.franchise, image);
}
const giants = records.map((record) => ({
  ...record,
  images: [imageByTitle.get(record.wikiTitle), imageBySource.get(record.sourceUrl), franchiseImage.get(record.franchise)].filter(Boolean),
  wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(record.wikiTitle.replaceAll(" ", "_"))}`,
}));

const payload = {
  generatedAt: new Date().toISOString(),
  methodology: {
    threshold: "Hình dạng chính thức khoảng 10 mét trở lên, hoặc thực thể hành tinh/vũ trụ có kích thước biến đổi.",
    measurements: "Chính thức/canon được ưu tiên; ước tính và kích thước không cố định được ghi nhãn riêng.",
    scope: "Danh mục nghiên cứu tuyển chọn, không tuyên bố bao phủ mọi tác phẩm từng được xuất bản.",
  },
  giants,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ output, records: giants.length, images: giants.filter((item) => item.images.length > 0).length }));
