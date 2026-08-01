import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/data/giants.json");

// id | name | tradition/franchise | media | origin | kind | scale | height(m) | size label | confidence | Wikipedia title | Vietnamese summary
const raw = String.raw`
cronus|Cronus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan thế hệ đầu|Titanic||Quy mô thần linh, không có số đo|Văn bản thần thoại|Cronus|Vua của các Titan, lật đổ Uranus rồi bị Zeus đánh bại trong Titanomachy.
rhea|Rhea|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Nữ Titan|Titanic||Quy mô thần linh, không có số đo|Văn bản thần thoại|Rhea (mythology)|Mẹ của sáu vị thần Olympus và người cứu Zeus khỏi bị Cronus nuốt chửng.
oceanus|Oceanus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan đại dương|Planetary||Dòng sông bao quanh thế giới|Mô tả thần thoại|Oceanus|Titan hiện thân đại dương thế giới bao quanh toàn bộ cõi đất cổ đại.
tethys|Tethys|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Nữ Titan đại dương|Planetary||Nguồn nước nuôi dưỡng thế giới|Mô tả thần thoại|Tethys (mythology)|Nữ Titan của nguồn nước, mẹ của các thần sông và Oceanid.
hyperion|Hyperion|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan ánh sáng|Titanic||Quy mô thần linh|Văn bản thần thoại|Hyperion (Titan)|Titan của ánh sáng thiên giới, cha của Helios, Selene và Eos.
theia|Theia|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Nữ Titan thị giác|Titanic||Quy mô thần linh|Văn bản thần thoại|Theia|Nữ Titan của ánh sáng lấp lánh và thị giác, mẹ của Mặt Trời, Mặt Trăng và Bình Minh.
coeus|Coeus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan trí tuệ|Titanic||Quy mô thần linh|Văn bản thần thoại|Coeus|Titan gắn với trục trời, trí tuệ và lời tiên tri.
phoebe|Phoebe|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Nữ Titan tiên tri|Titanic||Quy mô thần linh|Văn bản thần thoại|Phoebe (Titaness)|Nữ Titan của trí tuệ sáng chói và lời sấm truyền.
crius|Crius|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan tinh tú|Titanic||Quy mô thần linh|Văn bản thần thoại|Crius|Một trong mười hai Titan đầu tiên, gắn với các chòm sao và trụ trời phía nam.
iapetus|Iapetus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan sự hữu hạn|Titanic||Quy mô thần linh|Văn bản thần thoại|Iapetus|Titan cha của Atlas, Prometheus, Epimetheus và Menoetius.
themis|Themis|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Nữ Titan luật lệ|Titanic||Quy mô thần linh|Văn bản thần thoại|Themis|Hiện thân của trật tự thiêng liêng, luật tự nhiên và phong tục cổ xưa.
mnemosyne|Mnemosyne|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Nữ Titan ký ức|Titanic||Quy mô thần linh|Văn bản thần thoại|Mnemosyne|Nữ Titan của ký ức và mẹ của chín Muse.
atlas-myth|Atlas|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan gánh trời|Planetary||Gánh vòm trời trên vai|Biểu tượng thần thoại|Atlas (mythology)|Titan bị kết án chống đỡ thiên giới sau thất bại của phe Titan.
prometheus|Prometheus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan lửa|Titanic||Quy mô thần linh|Văn bản thần thoại|Prometheus|Titan tạo dựng và bảo trợ loài người, đánh cắp lửa từ Olympus.
epimetheus|Epimetheus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan hậu kiến|Titanic||Quy mô thần linh|Văn bản thần thoại|Epimetheus|Anh em Prometheus, người phân phát đặc tính cho các loài vật.
menoetius|Menoetius|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Titan bạo lực|Titanic||Quy mô thần linh|Văn bản thần thoại|Menoetius|Titan của sức mạnh liều lĩnh bị Zeus đánh xuống Tartarus.
typhon|Typhon|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Quái thần bão tố|Supermassive||Đầu chạm các vì sao|Mô tả trong Theogony|Typhon|Quái thần rắn khổng lồ sinh từ Gaia, đối thủ đáng sợ nhất của Zeus.
echidna|Echidna|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Mẹ quái vật|Titanic||Nửa nữ thần, nửa đại xà|Văn bản thần thoại|Echidna (mythology)|Mẹ của nhiều quái vật Hy Lạp như Hydra, Chimera và Cerberus.
hydra-lernaean|Lernaean Hydra|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Rắn nhiều đầu|Colossal||Chín đầu, kích thước không xác định|Văn bản thần thoại|Lernaean Hydra|Đại xà đầm lầy mọc thêm hai đầu mỗi khi một đầu bị chặt.
ladon|Ladon|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Rồng trăm đầu|Colossal||Cuộn quanh cây táo Hesperides|Văn bản thần thoại|Ladon (mythology)|Rồng bất tử canh giữ những quả táo vàng của Hesperides.
briareus|Briareus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Hecatoncheir|Titanic||100 tay và 50 đầu|Văn bản thần thoại|Briareus|Người khổng lồ trăm tay giúp Zeus chiến thắng Titanomachy.
cottus|Cottus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Hecatoncheir|Titanic||100 tay và 50 đầu|Văn bản thần thoại|Hecatoncheires|Một trong ba Hecatoncheires có sức mạnh ném hàng trăm tảng đá cùng lúc.
gyges|Gyges|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Hecatoncheir|Titanic||100 tay và 50 đầu|Văn bản thần thoại|Hecatoncheires|Người khổng lồ trăm tay canh giữ các Titan trong Tartarus.
polyphemus|Polyphemus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Cyclops|Giant||Người khổng lồ một mắt|Sử thi Odyssey|Polyphemus|Cyclops ăn thịt người bị Odysseus làm mù trong Odyssey.
talos|Talos|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Người đồng khổng lồ|Giant||Khổng lồ bằng đồng|Văn bản thần thoại|Talos|Vệ binh bằng đồng đi vòng quanh đảo Crete để ngăn kẻ xâm nhập.
antaeus|Antaeus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Gigante|Giant||Sức mạnh tăng khi chạm đất|Văn bản thần thoại|Antaeus|Người khổng lồ bất khả chiến bại khi còn tiếp xúc với mẹ Gaia.
alcyoneus|Alcyoneus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Gigante bất tử|Titanic||Bất tử trên quê hương|Văn bản thần thoại|Alcyoneus|Chiến binh mạnh nhất trong Gigantomachy, chỉ có thể bị giết khi rời khỏi quê nhà.
porphyrion|Porphyrion|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Vua Gigantes|Titanic||Người khổng lồ thần chiến|Văn bản thần thoại|Porphyrion|Vua của Gigantes, tấn công Zeus và Hera trong Gigantomachy.
enceladus|Enceladus|Thần thoại Hy Lạp|Thần thoại,Cổ đại|Hy Lạp cổ đại|Gigante|Supermassive||Bị chôn dưới núi Etna|Biểu tượng địa chất|Enceladus (giant)|Hơi thở và chuyển động của Enceladus được dùng để giải thích núi lửa và động đất.

ymir|Ymir|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Thủy tổ Jötunn|Planetary||Cơ thể tạo thành thế giới|Mô tả trong Edda|Ymir|Người khổng lồ nguyên thủy; thịt, máu và xương trở thành Midgard.
audhumla|Auðhumla|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Bò nguyên thủy|Titanic||Bò vũ trụ khổng lồ|Mô tả trong Edda|Auðumbla|Bò nguyên thủy nuôi Ymir bằng bốn dòng sữa và liếm Búri khỏi băng.
bergelmir|Bergelmir|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Frost Jötunn|Titanic||Quy mô người khổng lồ|Văn bản Edda|Bergelmir|Jötunn sống sót sau trận đại hồng thủy từ máu Ymir và tiếp tục dòng giống băng giá.
thrym|Þrymr|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Vua Jötunn|Titanic||Quy mô người khổng lồ|Văn bản Edda|Þrymr|Vua người khổng lồ đánh cắp búa Mjölnir và đòi cưới Freyja.
hrungnir|Hrungnir|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Jötunn đá|Titanic||Trái tim và đầu bằng đá|Văn bản Edda|Hrungnir|Jötunn mạnh nhất, mang khiên đá và đấu tay đôi với Thor.
skrymir|Skrýmir|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Jötunn ảo thuật|Supermassive||Găng tay bị nhầm thành đại sảnh|Mô tả trong Edda|Útgarða-Loki|Hình dạng khổng lồ của Útgarða-Loki dùng ảo giác làm bẽ mặt Thor.
surtr-myth|Surtr|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Hỏa Jötunn|Supermassive||Kiếm lửa thiêu cháy thế giới|Mô tả Ragnarök|Surtr|Vua Muspelheim dẫn các con của lửa và thiêu rụi thế giới trong Ragnarök.
jormungandr-myth|Jörmungandr|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|World Serpent|Planetary||Quấn quanh toàn bộ Midgard|Mô tả trong Edda|Jörmungandr|Đại xà thế giới con của Loki, tử địch định mệnh của Thor.
fenrir|Fenrir|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Sói tận thế|Planetary||Hàm nuốt trời đất|Mô tả Ragnarök|Fenrir|Đại sói phá xiềng tại Ragnarök, nuốt Odin rồi bị Víðarr tiêu diệt.
nidhoggr|Níðhöggr|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Rồng địa ngục|Supermassive||Gặm rễ Yggdrasil|Văn bản Edda|Níðhöggr|Rồng độc gặm rễ cây thế giới và hành hạ linh hồn người chết.
hraesvelgr|Hræsvelgr|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Đại bàng Jötunn|Supermassive||Cánh tạo ra mọi cơn gió|Mô tả trong Edda|Hræsvelgr|Jötunn hình đại bàng ngồi ở tận cùng trời; cánh của hắn tạo ra gió.
garmr|Garmr|Thần thoại Bắc Âu|Thần thoại,Cổ đại|Norse cổ đại|Chó săn địa ngục|Colossal||Chó săn khổng lồ|Văn bản Edda|Garmr|Chó canh Hel phá xiềng trong Ragnarök và cùng Týr giết lẫn nhau.

tiamat-myth|Tiamat|Thần thoại Lưỡng Hà|Thần thoại,Cổ đại|Babylon cổ đại|Nữ thần biển hỗn mang|Planetary||Biển nguyên thủy; thân tạo trời đất|Enūma Eliš|Tiamat|Nữ thần biển mặn sinh ra thần linh và hóa thành quái long chống Marduk.
apsu|Apsu|Thần thoại Lưỡng Hà|Thần thoại,Cổ đại|Sumer–Akkad|Thủy thần nguyên thủy|Planetary||Đại dương nước ngọt nguyên thủy|Enūma Eliš|Abzu|Hiện thân vực nước ngọt dưới lòng đất và phối ngẫu của Tiamat.
kingu|Kingu|Thần thoại Lưỡng Hà|Thần thoại,Cổ đại|Babylon cổ đại|Quái thần|Titanic||Thủ lĩnh đội quân hỗn mang|Enūma Eliš|Kingu|Phối ngẫu của Tiamat mang Tablet of Destinies; máu được dùng tạo loài người.
anzu|Anzû|Thần thoại Lưỡng Hà|Thần thoại,Cổ đại|Sumer–Akkad|Chim sư tử bão tố|Colossal||Cánh che phủ bầu trời|Văn bản Akkad|Anzû|Quái điểu đầu sư tử đánh cắp Tablet of Destinies và quyền lực thần thánh.
humbaba|Humbaba|Thần thoại Lưỡng Hà|Thần thoại,Cổ đại|Sumer cổ đại|Vệ thần rừng tuyết tùng|Giant||Người khổng lồ có hào quang chết chóc|Sử thi Gilgamesh|Humbaba|Vệ thần do Enlil đặt tại rừng Cedar, bị Gilgamesh và Enkidu sát hại.
bull-of-heaven|Bull of Heaven|Thần thoại Lưỡng Hà|Thần thoại,Cổ đại|Sumer cổ đại|Thiên ngưu|Colossal||Bò thần gây hạn hán|Sử thi Gilgamesh|Bull of Heaven|Quái ngưu do Ishtar thả xuống Uruk sau khi Gilgamesh khước từ bà.

apep|Apep|Thần thoại Ai Cập|Thần thoại,Cổ đại|Ai Cập cổ đại|Đại xà hỗn mang|Planetary||Thân rắn dài vượt cõi Duat|Văn bản tang lễ|Apep|Hiện thân hỗn mang bóng tối, đêm đêm cố nuốt thuyền Mặt Trời của Ra.
mehen|Mehen|Thần thoại Ai Cập|Thần thoại,Cổ đại|Ai Cập cổ đại|Rắn hộ vệ|Planetary||Cuộn quanh thần Mặt Trời|Văn bản tang lễ|Mehen|Đại xà bảo vệ Ra trong hành trình đêm qua cõi Duat.
ammit|Ammit|Thần thoại Ai Cập|Thần thoại,Cổ đại|Ai Cập cổ đại|Kẻ nuốt linh hồn|Giant||Hợp thể cá sấu, sư tử và hà mã|Sách Người Chết|Ammit|Quái thú ăn trái tim của những linh hồn thất bại trong phán xét.
aker|Aker|Thần thoại Ai Cập|Thần thoại,Cổ đại|Ai Cập cổ đại|Sư tử chân trời|Supermassive||Hai sư tử nâng chân trời|Biểu tượng thần thoại|Aker (deity)|Thần đất dạng đôi sư tử canh cổng bình minh và hoàng hôn.

leviathan-myth|Leviathan|Truyền thống Hebrew|Thần thoại,Cổ đại,Văn học|Cận Đông cổ đại|Hải xà nguyên thủy|Planetary||Vua mọi sinh vật biển|Kinh văn cổ|Leviathan|Đại xà biển hỗn mang bất khả khuất phục xuất hiện trong Job, Psalms và Isaiah.
behemoth-myth|Behemoth|Truyền thống Hebrew|Thần thoại,Cổ đại,Văn học|Cận Đông cổ đại|Dã thú nguyên thủy|Supermassive||Vua mọi sinh vật trên cạn|Kinh văn cổ|Behemoth|Dã thú đất liền có xương như ống đồng và sức mạnh vượt khả năng con người.
ziz|Ziz|Truyền thống Do Thái|Thần thoại,Cổ đại,Văn học|Cận Đông cổ đại|Chim trời nguyên thủy|Planetary||Sải cánh che Mặt Trời|Văn học rabbi|Ziz|Đại điểu cai quản bầu trời, đối xứng với Leviathan của biển và Behemoth của đất.
lotan|Lôtān|Thần thoại Canaan|Thần thoại,Cổ đại|Ugarit cổ đại|Rắn biển bảy đầu|Planetary||Đại xà hỗn mang|Baal Cycle|Lotan|Rắn biển nhiều đầu bị thần bão Baal đánh bại, tiền thân gần của Leviathan.
bahamut-myth|Bahamut|Vũ trụ học Ả Rập–Ba Tư|Thần thoại,Cổ đại,Văn học|Trung Đông trung cổ|Cá vũ trụ|Planetary||Mang bò Kujata và thế giới|Văn học vũ trụ học|Bahamut|Cá khổng lồ nằm dưới cấu trúc thế giới trong truyền thống vũ trụ học Hồi giáo.
falak|Falak|Vũ trụ học Ả Rập|Thần thoại,Cổ đại,Văn học|Trung Đông trung cổ|Rắn vũ trụ|Cosmic||Nằm dưới Bahamut, đủ sức nuốt tạo vật|Văn học vũ trụ học|Falak (Arabian legend)|Đại xà bị kiềm chế chỉ bởi nỗi sợ Allah, cuộn dưới tầng sâu của thế giới.

vritra|Vritra|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Vệ Đà|Ahi đại xà|Planetary||Bao giữ mọi dòng nước|Rigveda|Vritra|Đại xà hạn hán khóa các dòng sông cho đến khi bị Indra đánh bại.
shesha|Shesha|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Ấn Độ giáo|Naga vũ trụ|Cosmic||Vô số đầu, nâng đỡ các thế giới|Kinh văn Hindu|Shesha|Rắn vô tận làm giường cho Vishnu và tồn tại qua các chu kỳ vũ trụ.
vasuki|Vasuki|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Ấn Độ giáo|Naga vương|Planetary||Dùng làm dây khuấy đại dương|Kinh văn Hindu|Vasuki|Vua Naga quấn quanh núi Mandara trong sự kiện khuấy Biển Sữa.
kumbhakarna|Kumbhakarna|Ramayana|Thần thoại,Cổ đại,Văn học|Ấn Độ cổ đại|Rakshasa khổng lồ|Titanic||Người khổng lồ ăn hàng núi thực phẩm|Sử thi Ramayana|Kumbhakarna|Em trai Ravana có kích thước và sức mạnh phi thường, ngủ sáu tháng mỗi lần.
hiranyakashipu|Hiranyakashipu|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Ấn Độ giáo|Asura vương|Titanic||Quy mô thần thoại|Purana|Hiranyakashipu|Asura gần như bất tử bị Narasimha tiêu diệt trong khe hở của mọi điều kiện bảo hộ.
hiranyaksha|Hiranyaksha|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Ấn Độ giáo|Asura khổng lồ|Planetary||Kéo Trái Đất xuống đại dương vũ trụ|Purana|Hiranyaksha|Asura nhấn chìm Bhudevi và bị hóa thân Varaha của Vishnu đánh bại.
rahu|Rahu|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Ấn Độ giáo|Asura thiên thể|Planetary||Đầu quỷ nuốt Mặt Trời và Mặt Trăng|Kinh văn Hindu|Rahu|Đầu bất tử của asura gây nhật thực và nguyệt thực bằng cách nuốt các thiên thể.
makara|Makara|Thần thoại Ấn Độ|Thần thoại,Cổ đại|Nam Á cổ đại|Thủy quái thần thánh|Colossal||Hợp thể cá sấu và sinh vật biển|Biểu tượng cổ|Makara|Linh vật nước và vật cưỡi của Varuna, xuất hiện trên cổng đền khắp Nam Á.

pangu|Pangu|Thần thoại Trung Hoa|Thần thoại,Cổ đại|Trung Hoa cổ đại|Người khổng lồ sáng thế|Planetary||Cao lên cùng trời đất; thân hóa thế giới|Truyền thuyết sáng thế|Pangu|Người khổng lồ tách trời khỏi đất; cơ thể trở thành núi, sông và thiên thể.
gonggong|Gonggong|Thần thoại Trung Hoa|Thần thoại,Cổ đại|Trung Hoa cổ đại|Thủy thần quái vật|Planetary||Húc gãy trụ trời Bất Chu|Văn bản cổ|Gonggong|Thủy thần có đầu người thân rắn làm nghiêng trời và gây đại hồng thủy.
xiangliu|Xiangliu|Thần thoại Trung Hoa|Thần thoại,Cổ đại|Trung Hoa cổ đại|Rắn chín đầu|Supermassive||Chín đầu ăn trên chín ngọn núi|Sơn Hải Kinh|Xiangliu|Quái xà độc phục vụ Gonggong; máu làm đất đai không thể sinh sống.
kun|Kun|Thần thoại Trung Hoa|Thần thoại,Cổ đại|Đạo giáo cổ đại|Cá khổng lồ|Supermassive||Dài hàng nghìn lý|Trang Tử|Peng (mythology)|Cá Kun trong Bắc Minh biến thành đại bàng Peng có cánh như mây trời.
peng|Peng|Thần thoại Trung Hoa|Thần thoại,Cổ đại|Đạo giáo cổ đại|Đại bàng vũ trụ|Planetary||Cánh phủ kín bầu trời|Trang Tử|Peng (mythology)|Hình thái chim của Kun, bay chín vạn lý trong một lần chuyển gió.
ao-myth|Ao|Thần thoại Trung Hoa|Thần thoại,Cổ đại|Trung Hoa cổ đại|Rùa biển vũ trụ|Planetary||Chân dùng làm bốn trụ trời|Liệt Tử và Hoài Nam Tử|Ao (turtle)|Rùa khổng lồ có chân được Nữ Oa dùng chống đỡ bốn góc bầu trời.
nian|Nian|Dân gian Trung Hoa|Thần thoại,Cổ đại|Trung Hoa|Niên thú|Giant||Quái thú lớn như núi nhỏ|Truyền thuyết dân gian|Nian|Quái thú đầu năm sợ màu đỏ, lửa và tiếng động lớn, nguồn gốc nhiều tục Tết.

yamata-orochi|Yamata no Orochi|Thần thoại Nhật Bản|Thần thoại,Cổ đại|Nhật Bản cổ đại|Rắn tám đầu|Supermassive||Thân trải qua tám thung lũng và tám ngọn đồi|Kojiki và Nihon Shoki|Yamata no Orochi|Đại xà bị Susanoo chuốc say và chém chết; kiếm Kusanagi nằm trong đuôi nó.
daidarabotchi|Daidarabotchi|Dân gian Nhật Bản|Thần thoại,Cổ đại|Nhật Bản|Người khổng lồ địa hình|Supermassive||Dấu chân tạo hồ và núi|Dân gian địa phương|Daidarabotchi|Người khổng lồ kiến tạo địa hình, nhấc núi và để lại những hồ nước bằng dấu chân.
gashadokuro|Gashadokuro|Dân gian Nhật Bản|Thần thoại,Cổ đại|Nhật Bản|Bộ xương khổng lồ|Giant||Cao gấp khoảng 15 lần người|Dân gian hiện đại|Gashadokuro|Bộ xương hợp từ oan hồn người chết đói, lang thang ban đêm và cắn đầu lữ khách.
umibozu|Umibōzu|Dân gian Nhật Bản|Thần thoại,Cổ đại|Nhật Bản|Hải yêu khổng lồ|Colossal||Trồi lên như núi đen giữa biển|Dân gian hàng hải|Umibōzu|Bóng người khổng lồ xuất hiện trên biển lặng, lật tàu của thủy thủ.
namazu|Namazu|Dân gian Nhật Bản|Thần thoại,Cổ đại|Nhật Bản|Cá trê động đất|Supermassive||Nằm dưới quần đảo Nhật Bản|Truyền thuyết địa chấn|Namazu (Japanese mythology)|Cá trê khổng lồ gây động đất khi Kashima không giữ được đá trấn áp.

bakunawa|Bakunawa|Thần thoại Philippines|Thần thoại,Cổ đại|Visayas cổ đại|Rồng biển thiên thể|Planetary||Nuốt các Mặt Trăng|Truyền thuyết dân gian|Bakunawa|Đại xà biển gây nguyệt thực bằng cách nuốt Mặt Trăng.
minokawa|Minokawa|Thần thoại Philippines|Thần thoại,Cổ đại|Bagobo|Chim rồng thiên thể|Planetary||Mỏ và cánh che kín bầu trời|Truyền thuyết dân gian|Minokawa|Chim rồng khổng lồ cố nuốt Mặt Trăng và cả Mặt Trời.
maya-makara|Makara Nusantara|Thần thoại Đông Nam Á|Thần thoại,Cổ đại|Indonesia–Đông Nam Á|Thủy quái|Colossal||Thủy thú hộ đền|Biểu tượng kiến trúc|Makara|Sinh vật lai biển bảo vệ lối vào đền và đại diện sức mạnh của nước.
thuan-thien-dragon|Rồng Lạc Long Quân|Thần thoại Việt Nam|Thần thoại,Cổ đại|Việt Nam|Long quân tổ tiên|Titanic||Thần rồng của biển cả|Truyền thuyết Việt Nam|Lạc Long Quân|Thủy tổ giống Rồng, diệt Ngư Tinh và Hồ Tinh rồi dẫn năm mươi người con xuống biển.
ngu-tinh|Ngư Tinh|Thần thoại Việt Nam|Thần thoại,Cổ đại|Việt Nam|Cá quỷ khổng lồ|Supermassive||Thân dài hơn năm mươi trượng|Lĩnh Nam chích quái|Lạc Long Quân|Hải quái hình cá sống trong hang đá, bị Lạc Long Quân tiêu diệt để bảo vệ dân chài.

quetzalcoatl-serpent|Quetzalcoatl Serpent Form|Thần thoại Aztec|Thần thoại,Cổ đại|Mesoamerica|Rắn lông vũ sáng thế|Planetary||Thần xà bao trùm trời đất|Codex và truyền thống Nahua|Quetzalcoatl|Thần rắn lông vũ gắn với gió, tri thức và việc sáng tạo nhân loại.
cipactli|Cipactli|Thần thoại Aztec|Thần thoại,Cổ đại|Mesoamerica|Hải quái nguyên thủy|Planetary||Cơ thể trở thành mặt đất|Codex Aztec|Cipactli|Quái vật cá sấu có miệng trên mọi khớp; thân xác bị dùng tạo nên thế giới.
tlatecuhtli|Tlaltecuhtli|Thần thoại Aztec|Thần thoại,Cổ đại|Mesoamerica|Địa quái|Planetary||Thân thể là mặt đất|Codex Aztec|Tlaltecuhtli|Thần quái đất bị xé đôi để tạo trời và đất nhưng vẫn đòi máu hiến tế.
camazotz-myth|Camazotz|Thần thoại Maya|Thần thoại,Cổ đại|Mesoamerica|Dơi tử thần|Giant||Dơi quỷ khổng lồ|Popol Vuh|Camazotz|Dơi tử thần sống trong Bat House của Xibalba và chặt đầu Hero Twin Hunahpu.
kanaloa|Kanaloa|Thần thoại Hawaii|Thần thoại,Cổ đại|Polynesia|Bạch tuộc thần biển|Supermassive||Quy mô đại dương|Truyền thống Hawaii|Kanaloa|Thần biển thường gắn với bạch tuộc hoặc mực, cai quản vực sâu đại dương.
te-wheke|Te Wheke-a-Muturangi|Thần thoại Māori|Thần thoại,Cổ đại|Polynesia|Bạch tuộc khổng lồ|Supermassive||Xúc tu bao phủ vùng biển|Truyền thuyết Māori|Te Wheke-a-Muturangi|Bạch tuộc khổng lồ bị Kupe truy đuổi xuyên Thái Bình Dương đến Aotearoa.
thunderbird|Thunderbird|Thần thoại Bắc Mỹ|Thần thoại,Cổ đại|Các dân tộc bản địa Bắc Mỹ|Linh điểu bão tố|Supermassive||Cánh tạo sấm và gió|Truyền thống bản địa|Thunderbird (mythology)|Linh điểu quyền năng tạo sấm bằng cánh và chớp bằng mắt.
mishepishu|Mishipeshu|Thần thoại Bắc Mỹ|Thần thoại,Cổ đại|Anishinaabe|Linh miêu nước|Colossal||Bá chủ hồ sâu|Truyền thống Anishinaabe|Mishipeshu|Linh thú dưới nước có sừng và vảy, đối nghịch với Thunderbird.

atlas-gow|Atlas|God of War|Game|God of War – Hy Lạp|Titan gánh thế giới|Supermassive|1600|Khoảng 1,6 km|Ước tính từ mô hình|Atlas (God of War)|Titan bốn tay bị buộc chống đỡ thế giới sau cuộc chiến với Olympus.
cronos-gow|Cronos|God of War|Game|God of War – Hy Lạp|Titan cổ đại|Supermassive|488|Khoảng 488 m|Ước tính từ mô hình|Cronos (God of War)|Titan khổng lồ mang Đền Pandora trên lưng và đối đầu Kratos.
gaia-gow|Gaia|God of War|Game|God of War – Hy Lạp|Nữ Titan đất|Supermassive|450|Hàng trăm mét|Ước tính từ mô hình|Gaia (God of War)|Người kể chuyện và thủ lĩnh Titan dẫn cuộc tấn công lên Olympus.
perses-gow|Perses|God of War|Game|God of War – Hy Lạp|Titan hủy diệt|Supermassive|300|Hàng trăm mét|Ước tính hình ảnh|Perses (Titan)|Titan dung nham tham chiến trong cuộc vây hãm Olympus.
surtr-gow|Surtr Ragnarök|God of War|Game|God of War – Bắc Âu|Hỏa Jötunn|Supermassive|1000|Khoảng 1 km|Ước tính hình ảnh|Surtr|Hỏa Jötunn hợp nhất thành Ragnarök và hủy diệt Asgard.
jormungandr-gow|Jörmungandr|God of War|Game|God of War – Bắc Âu|World Serpent|Planetary||Quấn quanh Midgard|Canon mô tả|Jörmungandr|Đại xà thế giới nói ngôn ngữ Jötunn và giao chiến với Thor.
thrym-gow|Thamur|God of War|Game|God of War – Bắc Âu|Jötunn xây dựng|Supermassive||Xác tạo thành cả vùng núi|Canon hình ảnh|God of War (2018 video game)|Thợ xây Jötunn khổng lồ có thi thể đóng băng trở thành địa hình Midgard.

fire-giant|Fire Giant|Elden Ring|Game|Lands Between|Người khổng lồ lửa|Giant|24|Khoảng 24 m|Ước tính mô hình|Fire Giant|Kẻ sống sót cuối cùng của giống khổng lồ, mang khuôn mặt của Fell God trên ngực.
elden-beast|Elden Beast|Elden Ring|Game|Lands Between|Thần thú vũ trụ|Colossal|60|Kích thước biến đổi|Ước tính mô hình|Elden Beast|Sứ giả từ Greater Will và hiện thân sống của trật tự Elden Ring.
greyoll|Elder Dragon Greyoll|Elden Ring|Game|Lands Between|Rồng mẹ cổ đại|Titanic|182|Dài khoảng 182 m|Ước tính mô hình|Elden Ring|Mẹ của loài rồng nằm bất động giữa đàn con ở Dragonbarrow.
dragonlord-placidusax|Dragonlord Placidusax|Elden Ring|Game|Lands Between|Elden Lord rồng|Colossal|50|Dài hàng chục mét|Ước tính mô hình|Dragonlord Placidusax|Rồng nhiều đầu cổ đại từng là Elden Lord trước thời Erdtree.
ancient-dragon-gransax|Gransax|Elden Ring|Game|Lands Between|Rồng cổ đại|Supermassive||Xác phủ qua tường Leyndell|Canon hình ảnh|Elden Ring|Rồng cổ đại khổng lồ từng phá vỡ tường thành Leyndell.

zorah-magdaros|Zorah Magdaros|Monster Hunter|Game|Monster Hunter|Elder Dragon núi lửa|Supermassive|257.6|Dài 257,6 m|Số liệu chính thức|Zorah Magdaros|Elder Dragon mang hệ sinh thái núi lửa trên lưng, di cư đến nơi kết thúc vòng đời.
dalamadur|Dalamadur|Monster Hunter|Game|Monster Hunter|Elder Dragon đại xà|Supermassive|440.4|Dài 440,4 m|Số liệu chính thức|Dalamadur|Đại xà quấn quanh núi, làm rung chuyển địa tầng và gọi thiên thạch.
raviente|Raviente|Monster Hunter Frontier|Game|Monster Hunter|Elder Dragon đại xà|Supermassive|450|Dài khoảng 450 m|Số liệu trò chơi|Monster Hunter Frontier G|Elder Dragon cần nhiều tổ đội săn phối hợp trên một hòn đảo.
ceadeus|Ceadeus|Monster Hunter|Game|Monster Hunter|Elder Dragon biển sâu|Titanic|58.8|Dài 58,8 m|Số liệu chính thức|Ceadeus|Cổ long biển có sừng khổng lồ gây động đất quanh làng Moga.
lao-shan-lung|Lao-Shan Lung|Monster Hunter|Game|Monster Hunter|Elder Dragon cổ đại|Colossal|69.6|Dài 69,6 m|Số liệu chính thức|Lao-Shan Lung|Cổ long di cư xuyên pháo đài và nghiền nát mọi vật trên đường.
jhen-mohran|Jhen Mohran|Monster Hunter|Game|Monster Hunter|Elder Dragon cá voi cát|Titanic|111.6|Dài 111,6 m|Số liệu chính thức|Jhen Mohran|Cổ long bơi qua Great Desert và bị săn bằng tàu cát.
gogmazios|Gogmazios|Monster Hunter|Game|Monster Hunter|Elder Dragon hắc ín|Colossal|49.2|Dài 49,2 m|Số liệu chính thức|Gogmazios|Cổ long phủ hắc ín ăn thuốc súng và mang Dragonator găm trên lưng.

bahamut-ff|Bahamut|Final Fantasy|Game|Final Fantasy Multiverse|Long thần hủy diệt|Supermassive||Kích thước thay đổi theo phiên bản|Canon đa phiên bản|Bahamut (Final Fantasy)|Triệu hồi rồng biểu tượng của series, thường dùng Mega Flare hoặc Teraflare.
leviathan-ff|Leviathan|Final Fantasy|Game|Final Fantasy Multiverse|Thủy long triệu hồi|Supermassive||Kích thước thay đổi theo phiên bản|Canon đa phiên bản|Leviathan (Final Fantasy)|Hải long thần thoại tạo sóng thần và đại hồng thủy.
alexander-ff|Alexander|Final Fantasy|Game|Final Fantasy Multiverse|Thành trì thần thánh|Supermassive||Pháo đài sống khổng lồ|Canon đa phiên bản|Alexander (Final Fantasy)|Thực thể triệu hồi dạng thành trì sử dụng thánh quang và pháo năng lượng.
sin-ffx|Sin|Final Fantasy X|Game|Spira|Thần thú thảm họa|Supermassive|1000|Dài khoảng 1 km|Ước tính hình ảnh|Sin (Final Fantasy X)|Vỏ giáp sống khổng lồ tái sinh liên tục để trừng phạt nền văn minh Spira.
adamantoise-ffxv|Adamantoise|Final Fantasy XV|Game|Eos|Rùa núi cổ đại|Titanic|100|Khoảng 100 m|Ước tính hình ảnh|Final Fantasy XV|Rùa khổng lồ bị nhầm với một ngọn núi và là superboss lâu dài.

sargeras|Sargeras|Warcraft|Game,Văn học|Warcraft Cosmos|Dark Titan|Planetary||Lớn hơn hành tinh|Canon hình ảnh|Sargeras|Titan sa ngã lãnh đạo Burning Legion và đâm thanh kiếm xuyên Azeroth.
aman-thul|Aman'Thul|Warcraft|Game,Văn học|Warcraft Cosmos|Highfather Titan|Planetary||Quy mô hành tinh|Canon hình ảnh|Aman'Thul|Thủ lĩnh Pantheon có thể nhổ Old God Y'Shaarj khỏi bề mặt Azeroth.
argus-unmaker|Argus the Unmaker|Warcraft|Game|Warcraft Cosmos|World-soul Titan|Planetary||Quy mô hành tinh|Canon hình ảnh|Argus the Unmaker|Linh hồn Titan của hành tinh Argus bị Legion tra tấn và biến thành vũ khí.
yogg-saron|Yogg-Saron|Warcraft|Game,Văn học|Azeroth|Old God|Supermassive||Cơ thể lan dưới Northrend|Canon mô tả|Yogg-Saron|Old God của cái chết gieo Curse of Flesh và ăn sâu dưới Ulduar.
nzoth|N'Zoth|Warcraft|Game,Văn học|Azeroth|Old God|Supermassive||Cơ thể thành phố sinh vật|Canon hình ảnh|N'Zoth|Old God thao túng giấc mơ, naga và Black Dragonflight.
galakrond|Galakrond|Warcraft|Game,Văn học|Azeroth|Proto-dragon nguyên thủy|Supermassive||Lớn hơn nhiều Dragon Aspect|Canon mô tả|Galakrond|Tổ tiên dị dạng của loài rồng, ăn thịt đồng loại và tạo xác sống.

valus|Valus|Shadow of the Colossus|Game|Forbidden Lands|Colossus đá|Giant|21|Khoảng 21 m|Ước tính mô hình|Shadow of the Colossus|Colossus đầu tiên, hình người bò phủ đá và lông.
quadratus|Quadratus|Shadow of the Colossus|Game|Forbidden Lands|Colossus bò|Giant|30|Khoảng 30 m|Ước tính mô hình|Shadow of the Colossus|Colossus bốn chân sống dưới cây cầu lớn.
gaius|Gaius|Shadow of the Colossus|Game|Forbidden Lands|Hiệp sĩ Colossus|Colossal|54|Khoảng 54 m|Ước tính mô hình|Shadow of the Colossus|Chiến binh đá khổng lồ sử dụng thanh kiếm như cột trụ.
avion|Avion|Shadow of the Colossus|Game|Forbidden Lands|Colossus bay|Colossal|30|Thân khoảng 30 m, sải cánh lớn|Ước tính mô hình|Shadow of the Colossus|Colossus chim chiến đấu trên hồ giữa tàn tích.
hydrus|Hydrus|Shadow of the Colossus|Game|Forbidden Lands|Colossus thủy sinh|Colossal|60|Dài khoảng 60 m|Ước tính mô hình|Shadow of the Colossus|Sinh vật dạng lươn điện sống dưới hồ sâu.
phaslanx|Phalanx|Shadow of the Colossus|Game|Forbidden Lands|Colossus sa mạc bay|Titanic|170|Dài khoảng 170 m|Ước tính mô hình|Shadow of the Colossus|Colossus dài nhất, bay bằng túi khí trên sa mạc.
malus|Malus|Shadow of the Colossus|Game|Forbidden Lands|Colossus cuối|Colossal|60|Khoảng 60 m|Ước tính mô hình|Shadow of the Colossus|Colossus cuối cùng đứng giữa bão và phóng năng lượng từ xa.

deathwing|Deathwing|Warcraft|Game,Văn học|Azeroth|Dragon Aspect sa ngã|Supermassive||Kích thước biến đổi|Canon không có số cố định|Deathwing|Rồng đất sa ngã làm vỡ Azeroth khi trỗi dậy từ Deepholm.
dinraal|Dinraal|The Legend of Zelda|Game|Hyrule|Hỏa long thần linh|Supermassive||Dài hàng trăm mét|Canon hình ảnh|The Legend of Zelda: Breath of the Wild|Rồng lửa cổ đại bay qua bầu trời Hyrule và ban vật liệu thần thánh.
light-dragon|Light Dragon|The Legend of Zelda|Game|Hyrule|Thánh long|Supermassive||Dài hàng trăm mét|Canon hình ảnh|The Legend of Zelda: Tears of the Kingdom|Rồng ánh sáng mang Master Sword và bay quanh Hyrule suốt thời gian dài.
dark-beast-ganon|Dark Beast Ganon|The Legend of Zelda|Game|Hyrule|Ma thú cổ đại|Colossal|40|Khoảng 40 m|Ước tính hình ảnh|Ganon|Hình thái ma thú của Calamity Ganon, hiện thân hận thù tích tụ qua thiên niên kỷ.
eternamax-eternatus|Eternamax Eternatus|Pokémon|Game,Anime|Galar|Pokémon nguồn gốc cổ đại|Titanic|100|100 m|Pokédex chính thức|Eternatus|Thực thể ngoài hành tinh gây Darkest Day và hiện tượng Dynamax.
regigigas|Regigigas|Pokémon|Game,Anime|Sinnoh|Pokémon đại địa|Giant|3.7|3,7 m; sức kéo lục địa|Pokédex chính thức|Regigigas|Titan huyền thoại được kể là đã kéo các lục địa bằng dây thừng.
groudon-primal|Primal Groudon|Pokémon|Game,Anime|Hoenn|Pokémon lục địa|Giant|5|5 m; quyền năng kiến tạo lục địa|Pokédex chính thức|Groudon|Thần thú nguyên thủy mở rộng đất liền bằng năng lượng mặt trời.
kyogre-primal|Primal Kyogre|Pokémon|Game,Anime|Hoenn|Pokémon đại dương|Giant|9.8|9,8 m; quyền năng đại dương|Pokédex chính thức|Kyogre|Thần thú nguyên thủy mở rộng biển cả bằng mưa bão toàn cầu.

colossal-titan|Colossal Titan|Attack on Titan|Anime,Manga|Paradis–Marley|Titan biến hình|Colossal|60|60 m|Canon chính thức|Colossal Titan|Titan biểu tượng tỏa nhiệt và tạo vụ nổ khổng lồ khi biến hình.
founding-titan-eren|Eren Founding Titan|Attack on Titan|Anime,Manga|Paradis–Marley|Titan Thủy Tổ|Supermassive|350|Dài hàng trăm mét|Ước tính từ hình ảnh|Eren Yeager|Hình thái xương khổng lồ điều khiển Rumbling và hàng triệu Wall Titan.
rod-reiss-titan|Rod Reiss Titan|Attack on Titan|Anime,Manga|Paradis|Titan bất thường|Titanic|120|Khoảng 120 m khi bò|Canon mô tả|Rod Reiss|Titan quá lớn để đứng, lê thân và bốc cháy vì nhiệt.
wall-titan|Wall Titan|Attack on Titan|Anime,Manga|Paradis|Titan cổ đại trong tường|Colossal|50|Khoảng 50 m|Canon chính thức|Wall Titans|Hàng triệu Titan được King Fritz phong ấn trong ba bức tường.
beast-titan|Beast Titan|Attack on Titan|Anime,Manga|Paradis–Marley|Titan thú|Giant|17|17 m|Canon chính thức|Zeke Yeager|Titan hình linh trưởng ném vật thể với sức hủy diệt khủng khiếp.
armored-titan|Armored Titan|Attack on Titan|Anime,Manga|Paradis–Marley|Titan bọc giáp|Giant|15|15 m|Canon chính thức|Reiner Braun|Titan được phủ giáp cứng, chuyên phá cổng và chiến tuyến.
war-hammer-titan|War Hammer Titan|Attack on Titan|Anime,Manga|Marley|Titan vũ khí|Giant|15|15 m|Canon chính thức|War Hammer Titan|Titan tạo vũ khí và công trình từ vật chất hóa cứng.

zunesha|Zunesha|One Piece|Anime,Manga|One Piece|Voi cổ đại|Supermassive|35000|Khoảng 35 km|Canon công bố|Zunesha|Voi nghìn năm mang cả quốc gia Zou trên lưng và bước dưới đáy biển.
oars|Oars|One Piece|Anime,Manga|One Piece|Ancient Giant|Colossal|67|Khoảng 67 m|Canon databook|Oars (One Piece)|Ancient Giant mang danh Continent-Puller được hồi sinh tại Thriller Bark.
little-oars-jr|Little Oars Jr.|One Piece|Anime,Manga|One Piece|Ancient Giant|Colossal|60|Khoảng 60 m|Canon databook|Little Oars Jr.|Hậu duệ của Oars và đồng minh trung thành của Ace.
sanjuan-wolf|Sanjuan Wolf|One Piece|Anime,Manga|One Piece|Người khổng lồ biến cỡ|Titanic|180|Ít nhất 180 m|Canon databook|Sanjuan Wolf|Thành viên băng Râu Đen phóng đại cơ thể bằng Trái Ác Quỷ.
emeth-iron-giant|Emeth|One Piece|Anime,Manga|One Piece|Robot cổ đại|Titanic||Cao hơn các Ancient Giant|Canon hình ảnh|One Piece|Iron Giant từ Void Century thức tỉnh theo nhịp Drums of Liberation.

ten-tails|Ten-Tails|Naruto|Anime,Manga|Naruto|Thần thú chakra nguyên thủy|Supermassive||Hàng trăm mét, biến đổi|Không có số canon|Ten-Tails|Nguồn gốc của chakra và chín Vĩ thú, có hình thái như thần mộc khổng lồ.
kurama|Kurama|Naruto|Anime,Manga|Naruto|Cửu Vĩ|Titanic|100|Khoảng 100 m|Ước tính hình ảnh|Kurama (Naruto)|Vĩ thú mạnh nhất từng tàn phá Konoha rồi trở thành đồng minh của Naruto.
gyuki|Gyūki|Naruto|Anime,Manga|Naruto|Bát Vĩ|Colossal||Kích thước biến đổi|Không có số canon|Gyūki|Vĩ thú lai bò–bạch tuộc hợp tác với Killer B.
gedo-statue|Demonic Statue|Naruto|Anime,Manga|Naruto|Vỏ Thập Vĩ cổ đại|Titanic|100|Khoảng 100 m|Ước tính hình ảnh|Demonic Statue of the Outer Path|Vỏ rỗng của Thập Vĩ được dùng để thu thập và phong ấn các Vĩ thú.

super-shenron|Super Shenron|Dragon Ball Super|Anime,Manga|Dragon Ball Multiverse|Thần long vũ trụ|Cosmic||Lớn hơn nhiều thiên hà|Canon hình ảnh|Super Dragon Ball|Thần long vàng được triệu hồi từ các Super Dragon Ball kích thước hành tinh.
hirudegarn|Hirudegarn|Dragon Ball|Anime,Phim|Dragon Ball|Ma thú cổ đại|Colossal|80|Khoảng 80 m|Ước tính hình ảnh|Dragon Ball Z: Wrath of the Dragon|Quái vật ma thuật bị chia đôi và phong ấn trong hai anh em người Konats.
cell-max|Cell Max|Dragon Ball Super|Anime,Manga,Phim|Dragon Ball|Sinh vật nhân tạo khổng lồ|Titanic|100|Khoảng 100 m|Không có số canon|Cell Max|Vũ khí sinh học chưa hoàn thiện được thiết kế như một thảm họa sống.
night-walker|Night-Walker|Princess Mononoke|Anime,Phim|Thần thoại Studio Ghibli|Thần rừng ban đêm|Titanic||Cao vượt tán rừng|Canon hình ảnh|Forest Spirit (Princess Mononoke)|Hình thái khổng lồ ban đêm của Thần Rừng, hiện thân sự sống và cái chết.
god-warrior|God Warrior|Nausicaä|Anime,Manga,Phim|Nausicaä|Thần binh cổ đại|Titanic||Cao hàng trăm mét|Canon hình ảnh|Giant God Warrior Appears in Tokyo|Vũ khí sinh học cổ đại từng thiêu rụi nền văn minh trong Seven Days of Fire.
sahaquiel|Sahaquiel|Neon Genesis Evangelion|Anime,Manga|Evangelion|Angel từ quỹ đạo|Supermassive||Đường kính hàng kilomet|Ước tính hình ảnh|Sahaquiel|Angel khổng lồ tự biến cơ thể thành bom động năng lao xuống Trái Đất.
adam-evangelion|Adam|Neon Genesis Evangelion|Anime,Manga,Phim|Evangelion|First Angel|Titanic||Kích thước biến đổi|Canon hình ảnh|Adam (Neon Genesis Evangelion)|Seed of Life cổ đại và tổ tiên của các Angel, nguyên nhân Second Impact.
gerard-valkyrie|Gerard Valkyrie Giant Form|Bleach|Anime,Manga|Soul Society|Quincy thần tích|Titanic||Liên tục tăng kích thước|Không có số canon|Gerard Valkyrie|The Miracle biến thương tổn thành sức mạnh và cơ thể ngày càng khổng lồ.

godzilla-monsterverse|Godzilla|MonsterVerse|Phim|MonsterVerse|Alpha Titan cổ đại|Titanic|120|Khoảng 120 m|Thông số điện ảnh|Godzilla (Monsterverse)|Alpha Titan hấp thụ bức xạ, thức tỉnh từ thời tiền sử và duy trì cân bằng tự nhiên.
kong-monsterverse|Kong|MonsterVerse|Phim|MonsterVerse|Titan linh trưởng|Titanic|102.7|Khoảng 102,7 m|Thông số điện ảnh|King Kong (Monsterverse)|Hậu duệ giống Titan bảo hộ Skull Island và Hollow Earth.
ghidorah-monsterverse|King Ghidorah|MonsterVerse|Phim|MonsterVerse|Titan ngoài hành tinh|Titanic|158.8|158,8 m|Thông số điện ảnh|King Ghidorah (Monsterverse)|Rồng ba đầu tạo bão toàn cầu và phát tín hiệu thống trị các Titan.
shimo|Shimo|MonsterVerse|Phim|MonsterVerse|Titan băng nguyên thủy|Titanic|114|Khoảng 114 m|Ước tính điện ảnh|Godzilla x Kong: The New Empire|Titan cổ xưa có hơi thở băng đủ sức khởi phát kỷ băng hà.
mothra-monsterverse|Mothra|MonsterVerse|Phim|MonsterVerse|Titan hộ thần|Colossal|52|Thân 15,8 m; sải cánh 244 m|Thông số điện ảnh|Mothra (Monsterverse)|Titan dạng bướm cộng sinh với Godzilla và được văn minh cổ tôn thờ.
rodan-monsterverse|Rodan|MonsterVerse|Phim|MonsterVerse|Titan núi lửa|Colossal|46.9|46,9 m; sải cánh 265 m|Thông số điện ảnh|Rodan (Monsterverse)|Titan bay ngủ trong núi lửa, tạo sóng xung kích bằng đôi cánh.
scylla|Scylla|MonsterVerse|Phim|MonsterVerse|Titan chân đốt|Titanic||Cao hàng chục mét|Canon hình ảnh|Scylla (Monsterverse)|Titan nhện–mực thức tỉnh tại Arizona và có khả năng hấp thụ bức xạ.
methuselah|Methuselah|MonsterVerse|Phim|MonsterVerse|Titan núi sống|Titanic||Cơ thể ngụy trang thành núi|Canon hình ảnh|Godzilla: King of the Monsters|Titan cổ đại mang đá và rừng trên lưng, thức tỉnh tại Đức.
behemoth-mv|Behemoth|MonsterVerse|Phim|MonsterVerse|Titan thú có ngà|Titanic||Cao gần trăm mét|Canon hình ảnh|Behemoth (Monsterverse)|Titan lông lá có ngà voi, được Monarch phát hiện tại Brazil.
tiamat-mv|Tiamat|MonsterVerse|Phim,Comics|MonsterVerse|Titan đại xà biển|Titanic||Dài hàng trăm mét|Canon hình ảnh|Godzilla x Kong: The New Empire|Titan biển nhiều vây chiếm hang ổ giàu năng lượng ở Bắc Cực.
muto-prime|MUTO Prime|MonsterVerse|Phim,Comics|MonsterVerse|Titan ký sinh cổ đại|Colossal|95|Khoảng 95 m|Ước tính hình ảnh|Godzilla: Aftershock|Cá thể MUTO đầu đàn chuyên săn và ký sinh lên loài Godzilla.

godzilla-earth|Godzilla Earth|Godzilla Anime Trilogy|Anime,Phim|Godzilla Anime|Kaiju tiến hóa cổ đại|Supermassive|300|300 m|Thông số chính thức|Godzilla: Planet of the Monsters|Godzilla tiến hóa hai mươi nghìn năm và biến Trái Đất thành hệ sinh thái của mình.
king-ghidorah-anime|Ghidorah Void Form|Godzilla Anime Trilogy|Anime,Phim|Godzilla Anime|Thực thể rồng liên chiều|Cosmic||Chiều dài biểu hiện vượt kilomet|Canon phi vật lý|Godzilla: The Planet Eater|Rồng vàng từ chiều không gian khác bẻ cong vật lý và ăn các nền văn minh.
godzilla-1954|Godzilla (1954)|Godzilla|Phim|Toho Showa|Kaiju nguyên tử|Colossal|50|50 m|Thông số chính thức|Godzilla (1954 film)|Kaiju nguyên thủy trỗi dậy từ biển sâu như biểu tượng của thảm họa hạt nhân.
king-ghidorah-showa|King Ghidorah|Godzilla|Phim|Toho Showa|Rồng vũ trụ ba đầu|Titanic|100|100 m|Thông số chính thức|King Ghidorah|Rồng vũ trụ hủy diệt các nền văn minh và đối thủ kinh điển của Godzilla.
mothra-imago|Mothra Imago|Godzilla|Phim|Toho|Thần thú đảo Infant|Colossal|52|52 m; sải cánh 244 m|Thông số chính thức|Mothra|Thần thú bảo hộ có vòng đời tái sinh và mối liên kết với hai Shobijin.
biollante|Biollante|Godzilla|Phim|Toho Heisei|Kaiju thực vật thần thoại|Titanic|120|120 m|Thông số chính thức|Godzilla vs. Biollante|Sinh vật lai giữa người, hoa hồng và tế bào Godzilla.

kraken-clash|Kraken|Clash of the Titans|Phim|Thần thoại điện ảnh|Hải quái Titan|Supermassive||Cao hàng trăm mét|Canon hình ảnh|Clash of the Titans (2010 film)|Quái thú do Hades thả ra để nhận vật hiến tế và hủy diệt Argos.
kronos-wrath|Kronos|Wrath of the Titans|Phim|Thần thoại điện ảnh|Titan dung nham|Supermassive||Cao như núi|Canon hình ảnh|Wrath of the Titans|Titan nguyên thủy thoát khỏi Tartarus và tiến về Olympus trong hình hài dung nham.
cloverfield-monster|Cloverfield Monster|Cloverfield|Phim|Cloverfield|Sinh vật cổ đại biển sâu|Colossal|73|Khoảng 73 m khi còn non|Ước tính điện ảnh|Cloverfield|Sinh vật non khổng lồ thức tỉnh từ đại dương và tàn phá Manhattan.
adult-clover|Adult Clover|The Cloverfield Paradox|Phim|Cloverfield|Sinh vật trưởng thành|Supermassive||Đầu vượt tầng mây|Canon hình ảnh|The Cloverfield Paradox|Cá thể trưởng thành khổng lồ xuất hiện sau khi các chiều không gian va chạm.
shai-hulud|Shai-Hulud|Dune|Phim,Văn học|Arrakis|Sâu cát thần thánh|Supermassive|400|Dài tới khoảng 400 m|Canon biến đổi|Sandworm (Dune)|Sâu cát cổ đại tạo spice, định hình hệ sinh thái và được Fremen thờ phụng.
smaug|Smaug|Middle-earth|Phim,Văn học|Middle-earth|Đại long cổ đại|Titanic|130|Dài khoảng 130 m trong phim|Ước tính điện ảnh|Smaug|Rồng lửa chiếm Erebor, hủy diệt Dale và Lake-town.
balrog|Durin's Bane|Middle-earth|Phim,Văn học|Middle-earth|Maiar hỏa quỷ cổ đại|Giant||Kích thước biến đổi theo chuyển thể|Canon không có số cố định|Balrog|Balrog sống sót từ First Age, ngủ dưới Moria rồi đối đầu Gandalf.
exogorth|Exogorth|Star Wars|Phim|Star Wars|Sên không gian cổ đại|Supermassive|900|Dài khoảng 900 m|Canon databank|Exogorth|Sên không gian sống trong tiểu hành tinh và có thể nuốt tàu Millennium Falcon.
krayt-dragon|Greater Krayt Dragon|Star Wars|Phim,Truyền hình|Star Wars|Rồng sa mạc cổ đại|Titanic|100|Dài trên 100 m|Ước tính hình ảnh|Krayt dragon|Kẻ săn mồi đỉnh cao bơi trong biển cát Tatooine.
slattern|Slattern|Pacific Rim|Phim|Pacific Rim|Kaiju Category V|Titanic|181.7|Khoảng 181,7 m|Thông số điện ảnh|Slattern|Kaiju mạnh nhất bảo vệ Breach dưới đáy Thái Bình Dương.
mega-kaiju|Mega-Kaiju|Pacific Rim|Phim|Pacific Rim|Kaiju hợp thể|Titanic|128|Khoảng 128 m|Ước tính điện ảnh|Pacific Rim Uprising|Ba Kaiju hợp nhất thành sinh vật duy nhất nhằm kích hoạt Ring of Fire.
otachi|Otachi|Pacific Rim|Phim|Pacific Rim|Kaiju Category IV|Colossal|63|Khoảng 63 m|Thông số điện ảnh|Otachi|Kaiju có cánh, đuôi kẹp và acid xanh tấn công Hong Kong.
leatherback|Leatherback|Pacific Rim|Phim|Pacific Rim|Kaiju Category IV|Colossal|81|Khoảng 81 m|Thông số điện ảnh|Leatherback|Kaiju dạng gorilla có cơ quan xung điện từ vô hiệu hóa Jaeger.
`.trim();

const OFFICIAL = {
  "God of War": "https://www.playstation.com/en-us/god-of-war/",
  "Elden Ring": "https://en.bandainamcoent.eu/elden-ring/elden-ring",
  "Monster Hunter": "https://www.monsterhunter.com/",
  "Monster Hunter Frontier": "https://www.monsterhunter.com/",
  "Final Fantasy": "https://www.square-enix-games.com/",
  "Final Fantasy X": "https://finalfantasyxhd.square-enix-games.com/",
  "Final Fantasy XV": "https://finalfantasyxv.square-enix-games.com/",
  Warcraft: "https://worldofwarcraft.blizzard.com/",
  "Shadow of the Colossus": "https://www.playstation.com/games/shadow-of-the-colossus/",
  "The Legend of Zelda": "https://www.nintendo.com/us/gaming-systems/switch-2/featured-games/the-legend-of-zelda-tears-of-the-kingdom/",
  Pokémon: "https://www.pokemon.com/us/pokedex",
  "Attack on Titan": "https://attackontitan.jp/",
  "One Piece": "https://one-piece.com/",
  Naruto: "https://naruto-official.com/",
  "Dragon Ball Super": "https://en.dragon-ball-official.com/",
  "Dragon Ball": "https://en.dragon-ball-official.com/",
  "Princess Mononoke": "https://www.ghibli.jp/works/mononoke/",
  Nausicaä: "https://www.ghibli.jp/works/nausicaa/",
  "Neon Genesis Evangelion": "https://www.evangelion.jp/",
  Bleach: "https://bleach-anime.com/",
  MonsterVerse: "https://www.legendary.com/film/godzilla-x-kong-the-new-empire/",
  "Godzilla Anime Trilogy": "https://godzilla.com/",
  Godzilla: "https://godzilla.com/blogs/monsterpedia/",
  "Clash of the Titans": "https://www.warnerbros.com/movies/clash-titans-2010",
  "Wrath of the Titans": "https://www.warnerbros.com/movies/wrath-titans",
  Cloverfield: "https://www.paramountpictures.com/movies/cloverfield",
  "The Cloverfield Paradox": "https://www.paramount.com/movies/the-cloverfield-paradox",
  Dune: "https://www.dunemovie.com/",
  "Middle-earth": "https://www.warnerbros.com/movies/hobbit-desolation-smaug",
  "Star Wars": "https://www.starwars.com/databank",
  "Pacific Rim": "https://www.legendary.com/film/pacific-rim/",
};

const records = raw.split("\n").filter(Boolean).map((line) => {
  const [id, name, franchise, media, universe, kind, scale, height, sizeLabel, measurement, wikiTitle, description] = line.split("|");
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replaceAll(" ", "_"))}`;
  return { id, name, franchise, media: media.split(","), universe, kind, scale, heightMeters: height ? Number(height) : null, sizeLabel, measurement, wikiTitle, sourceUrl: OFFICIAL[franchise] || wikipediaUrl, description };
});

async function wikipediaImages(titles) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({ action: "query", format: "json", origin: "*", redirects: "1", prop: "pageimages", piprop: "original|thumbnail", pithumbsize: "1000", titles: titles.join("|") });
  try {
    const response = await fetch(url, { headers: { "user-agent": "MythicTitanArchive/2.0 (hoainguyen9503/pokedex)" }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) return new Map();
    const data = await response.json();
    const aliases = new Map(titles.map((title) => [title.toLowerCase(), title.toLowerCase()]));
    for (const item of data.query?.normalized || []) aliases.set(item.from.toLowerCase(), item.to.toLowerCase());
    for (const item of data.query?.redirects || []) aliases.set(aliases.get(item.from.toLowerCase()) || item.from.toLowerCase(), item.to.toLowerCase());
    const pages = new Map(Object.values(data.query?.pages || {}).map((page) => [page.title.toLowerCase(), page.original?.source || page.thumbnail?.source || null]));
    return new Map(titles.map((title) => [title, pages.get(aliases.get(title.toLowerCase()) || title.toLowerCase()) || null]));
  } catch { return new Map(); }
}

const uniqueTitles = [...new Set(records.map((record) => record.wikiTitle))];
const imageByTitle = new Map();
for (let index = 0; index < uniqueTitles.length; index += 40) {
  const images = await wikipediaImages(uniqueTitles.slice(index, index + 40));
  images.forEach((image, title) => imageByTitle.set(title, image));
  await new Promise((resolve) => setTimeout(resolve, 800));
}

const giants = records.map(({ wikiTitle, ...record }) => ({
  ...record,
  images: [imageByTitle.get(wikiTitle)].filter(Boolean),
  wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replaceAll(" ", "_"))}`,
}));

const payload = {
  generatedAt: new Date().toISOString(),
  methodology: {
    threshold: "Titan, người khổng lồ, quái thú sáng thế, rồng hỗn mang hoặc sinh vật thảm họa có quy mô vượt con người.",
    measurements: "Thần thoại cổ thường không có số đo; dữ liệu phân biệt văn bản gốc, thông số chính thức và ước tính chuyển thể.",
    scope: "Danh mục liên văn hóa và liên phương tiện có thể mở rộng; không đồng nhất Titan Hy Lạp với mọi sinh vật khổng lồ.",
  },
  giants,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ output, records: giants.length, images: giants.filter((item) => item.images.length).length }));
