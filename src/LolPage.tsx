import { useEffect, useMemo, useState } from "react";
import { buildSkinGroups, inspectSkinGroups } from "./lolGroups";
import Pagination from "./Pagination";
import ResilientImage from "./ResilientImage";

type ChampionStats = {
  hp: number; hpperlevel: number; mp: number; mpperlevel: number;
  movespeed: number; armor: number; armorperlevel: number;
  spellblock: number; spellblockperlevel: number; attackrange: number;
  hpregen: number; hpregenperlevel: number; mpregen: number; mpregenperlevel: number;
  crit: number; critperlevel: number; attackdamage: number;
  attackdamageperlevel: number; attackspeedperlevel: number; attackspeed: number;
};
type LolSkin = {
  id: string; num: number; name: string; chromas: boolean;
  championId: string; championKey: number; championName: string; championTitle: string; tags: string[];
};
type LolChampion = {
  id: string; key: number; name: string; title: string; lore: string;
  tags: string[]; partype: string; stats: ChampionStats; skins: LolSkin[];
};
type LolData = {
  version: string; locale: string; generatedAt: string;
  champions: LolChampion[]; skins: LolSkin[];
};

const ROLE_LABELS: Record<string, string> = {
  all: "Tất cả", Assassin: "Sát thủ", Fighter: "Đấu sĩ", Mage: "Pháp sư",
  Marksman: "Xạ thủ", Support: "Hỗ trợ", Tank: "Đỡ đòn",
};
const LOL_SCROLL_KEY = "lol:list-scroll-position";
const LOL_FAVORITES_KEY = "lol:favorite-skins";
const LOL_PAGE_KEY = "lol:list-page";
const LOL_VIEW_KEY = "lol:list-view";
const LOL_IMAGE_CDN = "https://ddragon.leagueoflegends.com/cdn/img/champion";
const PAGE_SIZE = 100;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().trim();
}
function readFavorites() {
  try { return JSON.parse(localStorage.getItem(LOL_FAVORITES_KEY) || "[]") as string[]; }
  catch { return []; }
}
function readSkinRoute() {
  return window.location.hash.match(/^#\/lol\/skin\/([^/]+)/)?.[1] ?? null;
}
function skinCentered(skin: Pick<LolSkin, "championId" | "num">) {
  return `${LOL_IMAGE_CDN}/centered/${skin.championId}_${skin.num}.jpg`;
}
function skinLoading(skin: Pick<LolSkin, "championId" | "num">) {
  return `${LOL_IMAGE_CDN}/loading/${skin.championId}_${skin.num}.jpg`;
}
function skinCommunity(skin: Pick<LolSkin, "championId" | "num">) {
  const champion = skin.championId.toLowerCase();
  const skinFolder = String(skin.num).padStart(2, "0");
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${champion}/skins/skin${skinFolder}/images/${champion}_splash_centered_${skin.num}.jpg`;
}
function championIcon(skin: Pick<LolSkin, "championId">, version: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${skin.championId}.png`;
}
function skinSources(skin: Pick<LolSkin, "championId" | "num">, version: string, portrait = false) {
  return portrait
    ? [skinLoading(skin), skinCentered(skin), skinCommunity(skin), championIcon(skin, version)]
    : [skinCentered(skin), skinLoading(skin), skinCommunity(skin), championIcon(skin, version)];
}

export default function LolPage() {
  const [data, setData] = useState<LolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [skinId, setSkinId] = useState<string | null>(readSkinRoute);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [champion, setChampion] = useState("all");
  const [sort, setSort] = useState("champion");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [showTop, setShowTop] = useState(false);
  const [view, setView] = useState<"skins" | "groups">(
    () => sessionStorage.getItem(LOL_VIEW_KEY) === "groups" ? "groups" : "skins",
  );
  const [page, setPage] = useState(() => Math.max(1, Number(sessionStorage.getItem(LOL_PAGE_KEY)) || 1));

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/lol-skins.json`)
      .then((response) => response.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { localStorage.setItem(LOL_FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { sessionStorage.setItem(LOL_PAGE_KEY, String(page)); }, [page]);
  useEffect(() => { sessionStorage.setItem(LOL_VIEW_KEY, view); }, [view]);
  useEffect(() => {
    const onHash = () => {
      const next = readSkinRoute();
      setSkinId(next);
      if (next) window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const onScroll = () => setShowTop(window.scrollY > 650);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    if (skinId || loading) return;
    const saved = sessionStorage.getItem(LOL_SCROLL_KEY);
    if (saved === null) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: Number(saved) || 0, behavior: "auto" });
      sessionStorage.removeItem(LOL_SCROLL_KEY);
    }));
  }, [skinId, loading]);

  const selected = data?.skins.find((skin) => skin.id === skinId) ?? null;
  const selectedChampion = selected
    ? data?.champions.find((item) => item.id === selected.championId) ?? null
    : null;

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = normalize(query);
    return data.skins.filter((skin) =>
      (!term || normalize(`${skin.name} ${skin.championName} ${skin.championTitle}`).includes(term))
      && (role === "all" || skin.tags.includes(role))
      && (champion === "all" || skin.championId === champion)
      && (!favoritesOnly || favorites.includes(skin.id))
    ).sort((a, b) => {
      if (sort === "skin") return a.name.localeCompare(b.name, "vi");
      if (sort === "newest") return Number(b.id) - Number(a.id);
      return a.championName.localeCompare(b.championName, "vi") || a.num - b.num;
    });
  }, [data, query, role, champion, sort, favoritesOnly, favorites]);
  const skinGroups = useMemo(() => data ? buildSkinGroups(data.skins) : [], [data]);
  const groupAudit = useMemo(() => data ? inspectSkinGroups(skinGroups, data.skins.length) : null, [data, skinGroups]);
  const dataVersion = data?.version ?? "16.14.1";
  const activeCount = view === "skins" ? filtered.length : skinGroups.length;
  const pageCount = Math.max(1, Math.ceil(activeCount / PAGE_SIZE));
  const pagedSkins = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );
  const pagedGroups = useMemo(
    () => skinGroups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [skinGroups, page],
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const openSkin = (skin: LolSkin) => {
    sessionStorage.setItem(LOL_SCROLL_KEY, String(window.scrollY));
    window.location.hash = `/lol/skin/${skin.id}`;
  };
  const randomSkin = () => {
    if (!data?.skins.length) return;
    openSkin(data.skins[Math.floor(Math.random() * data.skins.length)]);
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector(".lol-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const changeView = (nextView: "skins" | "groups") => {
    setView(nextView);
    setPage(1);
  };
  const resetSkinFilters = () => {
    setQuery("");
    setChampion("all");
    setRole("all");
    setFavoritesOnly(false);
    setPage(1);
  };

  return (
    <main className="lol-page">
      <header className="lol-topbar">
        <a className="lol-brand" href="#/lol"><span className="lol-mark">L</span><span>RIFT ARCHIVE</span></a>
        <nav><a href="#">Pokédex</a><a className="active" href="#/lol">Trang phục LMHT</a></nav>
        <button onClick={randomSkin}>Trang phục ngẫu nhiên ✦</button>
      </header>

      {skinId ? (
        loading ? <div className="lol-empty">Đang mở hồ sơ trang phục…</div> : selected && selectedChampion ? (
          <article className="lol-detail">
            <div className="lol-detail-nav">
              <a href="#/lol">← Trở lại danh sách</a>
              <button className={favorites.includes(selected.id) ? "active" : ""} onClick={() => toggleFavorite(selected.id)}>♥ Yêu thích</button>
            </div>
            <section className="lol-splash">
              <ResilientImage sources={skinSources(selected, dataVersion)} alt={selected.name} />
              <div className="lol-splash-shade" />
              <div className="lol-splash-copy">
                <p>{selected.championName} · {selected.championTitle}</p>
                <h1>{selected.name}</h1>
                <div>{selected.tags.map((tag) => <span key={tag}>{ROLE_LABELS[tag]}</span>)}{selected.chromas && <span>Có đa sắc</span>}</div>
              </div>
            </section>
            <section className="lol-profile">
              <div>
                <p className="lol-kicker">TIỂU SỬ TƯỚNG</p>
                <h2>{selectedChampion.name}</h2>
                <p>{selectedChampion.lore}</p>
              </div>
              <div>
                <p className="lol-kicker">CHỈ SỐ CƠ BẢN</p>
                <h2>Năng lực</h2>
                <div className="lol-stats">
                  <Stat label="Máu" value={selectedChampion.stats.hp} max={700} />
                  <Stat label="Sát thương" value={selectedChampion.stats.attackdamage} max={75} />
                  <Stat label="Giáp" value={selectedChampion.stats.armor} max={55} />
                  <Stat label="Kháng phép" value={selectedChampion.stats.spellblock} max={40} />
                  <Stat label="Tốc độ chạy" value={selectedChampion.stats.movespeed} max={355} />
                  <Stat label="Tầm đánh" value={selectedChampion.stats.attackrange} max={650} />
                </div>
              </div>
            </section>
            <section className="lol-related">
              <p className="lol-kicker">BỘ SƯU TẬP</p>
              <h2>Trang phục khác của {selected.championName}</h2>
              <div>
                {selectedChampion.skins.filter((skin) => skin.id !== selected.id).map((skin) => (
                  <button key={skin.id} onClick={() => { window.location.hash = `/lol/skin/${skin.id}`; }}>
                    <ResilientImage loading="lazy" sources={skinSources({ ...skin, championId: selectedChampion.id }, dataVersion)} alt={skin.name} /><strong>{skin.name}</strong>
                  </button>
                ))}
              </div>
            </section>
          </article>
        ) : <div className="lol-empty"><strong>Không tìm thấy trang phục.</strong><a href="#/lol">Trở lại danh sách</a></div>
      ) : (
        <>
          <section className="lol-hero">
            <div>
              <p className="lol-kicker">LEAGUE OF LEGENDS · DATA DRAGON {data?.version ?? ""}</p>
              <h1>Mỗi trang phục.<br /><em>Một nhân vật.</em></h1>
              <p>Khám phá toàn bộ tướng và trang phục Liên Minh Huyền Thoại trong một thư viện hình ảnh duy nhất.</p>
              <div className="lol-hero-stats"><span><b>{data?.champions.length ?? "—"}</b>Tướng</span><span><b>{data?.skins.length ?? "—"}</b>Nhân vật</span><span><b>{favorites.length}</b>Yêu thích</span></div>
            </div>
            <div className="lol-hero-art"><ResilientImage sources={[
              "https://ddragon.leagueoflegends.com/cdn/img/champion/centered/Ahri_27.jpg",
              "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ahri_27.jpg",
              `https://ddragon.leagueoflegends.com/cdn/${data?.version ?? "16.14.1"}/img/champion/Ahri.png`,
            ]} alt="Ahri" /></div>
          </section>
          <section className="lol-catalog">
            <div className="lol-catalog-head"><div><p className="lol-kicker">THƯ VIỆN TRANG PHỤC</p><h2>{view === "skins" ? "Tất cả nhân vật" : "Biệt đội cùng concept"}</h2></div><p><b>{view === "skins" ? filtered.length : skinGroups.length}</b> {view === "skins" ? "kết quả" : "nhóm"}</p></div>
            <div className="lol-view-switch">
              <button className={view === "skins" ? "active" : ""} onClick={() => changeView("skins")}>▦ Danh sách skin</button>
              <button className={view === "groups" ? "active" : ""} onClick={() => changeView("groups")}>⬡ Nhóm 5 tướng</button>
            </div>
            {view === "skins" && <><div className="lol-toolbar">
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm skin hoặc tên tướng..." />
              <select value={champion} onChange={(event) => { setChampion(event.target.value); setPage(1); }}>
                <option value="all">Tất cả tướng</option>
                {data?.champions.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
              <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
                <option value="champion">Theo tên tướng</option><option value="skin">Theo tên skin</option><option value="newest">Skin ID mới nhất</option>
              </select>
            </div>
            <div className="lol-roles">
              {Object.entries(ROLE_LABELS).map(([key, label]) => <button className={role === key ? "active" : ""} onClick={() => { setRole(key); setPage(1); }} key={key}>{label}</button>)}
              <button className={favoritesOnly ? "active favorite" : ""} onClick={() => { setFavoritesOnly(!favoritesOnly); setPage(1); }}>♥ Yêu thích</button>
            </div>
            </>}
            {loading ? <div className="lol-empty">Đang tải thư viện…</div> : view === "groups" ? (
              <>
                <div className={`group-audit ${groupAudit?.complete && groupAudit.groupsWithDuplicateChampion === 0 ? "valid" : ""}`}>
                  <span>✓ {groupAudit?.uniqueSkinCount.toLocaleString("vi-VN")} skin duy nhất</span>
                  <span>✓ Không nhóm nào trùng tướng</span>
                  <span>✓ Đã gom {groupAudit?.skinCount.toLocaleString("vi-VN")}/{data?.skins.length.toLocaleString("vi-VN")} skin</span>
                </div>
                <Pagination position="top" page={page} pageSize={PAGE_SIZE} totalItems={skinGroups.length} onChange={changePage} />
                <div className="lol-group-grid">{pagedGroups.map((group, groupIndex) => (
                  <article className="lol-group" key={group.id}>
                    <header><div><small>BIỆT ĐỘI {String((page - 1) * PAGE_SIZE + groupIndex + 1).padStart(3, "0")}</small><h3>{group.concept}</h3></div><b>{group.skins.length}/5</b></header>
                    <div>{group.skins.map((skin) => (
                      <button key={skin.id} onClick={() => openSkin(skin)} title={`${skin.name} — ${skin.championName}`}>
                        <ResilientImage loading="lazy" sources={skinSources(skin, dataVersion, true)} alt={skin.name} />
                        <span><small>{skin.championName}</small><strong>{skin.name}</strong></span>
                      </button>
                    ))}
                    {group.skins.length < 5 && Array.from({ length: 5 - group.skins.length }, (_, index) => <i className="lol-group-empty" key={index}>Ô trống</i>)}
                    </div>
                  </article>
                ))}</div>
                <Pagination page={page} pageSize={PAGE_SIZE} totalItems={skinGroups.length} onChange={changePage} />
              </>
            ) : filtered.length ? (
              <><Pagination position="top" page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onChange={changePage} /><div className="lol-grid">{pagedSkins.map((skin) => (
                <article className="lol-card" key={skin.id}>
                  <button className="lol-card-main" onClick={() => openSkin(skin)}>
                    <ResilientImage loading="lazy" sources={skinSources(skin, dataVersion)} alt={skin.name} />
                    <span className="lol-card-shade" />
                    <span className="lol-card-copy"><small>{skin.championName}</small><strong>{skin.name}</strong><i>{skin.tags.map((tag) => ROLE_LABELS[tag]).join(" · ")}</i></span>
                  </button>
                  <button className={`lol-heart ${favorites.includes(skin.id) ? "active" : ""}`} onClick={() => toggleFavorite(skin.id)}>♥</button>
                </article>
              ))}</div><Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onChange={changePage} /></>
            ) : <div className="lol-empty"><strong>Không tìm thấy nhân vật.</strong><button onClick={resetSkinFilters}>Xóa bộ lọc</button></div>}
          </section>
        </>
      )}
      {showTop && <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}
      <footer className="lol-footer"><div className="lol-brand"><span className="lol-mark">L</span><span>RIFT ARCHIVE</span></div><p>Dữ liệu và hình ảnh từ Riot Games Data Dragon.</p><p>Riot Games không bảo trợ hoặc xác nhận dự án này.</p></footer>
    </main>
  );
}

function Stat({ label, value, max }: { label: string; value: number; max: number }) {
  return <div><span>{label}</span><i><b style={{ width: `${Math.min(value / max * 100, 100)}%` }} /></i><strong>{value}</strong></div>;
}
