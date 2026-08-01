import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import ResilientImage from "./ResilientImage";

type Giant = {
  id: string;
  name: string;
  franchise: string;
  media: string[];
  universe: string;
  kind: string;
  scale: string;
  heightMeters: number | null;
  sizeLabel: string;
  measurement: string;
  description: string;
  images: string[];
  sourceUrl: string;
  wikipediaUrl: string;
};

type GiantData = {
  generatedAt: string;
  methodology: { threshold: string; measurements: string; scope: string };
  giants: Giant[];
};

const PAGE_SIZE = 100;
const FAVORITES_KEY = "mythic-titan-archive:favorites";
const PAGE_KEY = "mythic-titan-archive:page";
const SCROLL_KEY = "mythic-titan-archive:scroll";

const MEDIA = ["Tất cả", "Thần thoại", "Cổ đại", "Game", "Anime", "Manga", "Phim", "Văn học", "Comics", "Truyền hình"];
const SCALES = ["Tất cả", "Giant", "Colossal", "Titanic", "Supermassive", "Planetary", "Cosmic"];
const SCALE_LABELS: Record<string, string> = {
  Giant: "Khổng lồ · 10–49 m",
  Colossal: "Colossal · 50–99 m",
  Titanic: "Titanic · 100–199 m",
  Supermassive: "Siêu đại · ≥ 200 m",
  Planetary: "Cấp hành tinh",
  Cosmic: "Cấp vũ trụ",
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().trim();
}

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function readRoute() {
  return window.location.hash.match(/^#\/(?:giant|giants|lol)\/character\/([^/]+)/)?.[1] ?? null;
}

function formatHeight(value: number | null) {
  if (value === null) return "Không có số đo cố định";
  if (value >= 1000) return `${(value / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} km`;
  return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} m`;
}

function GiantVisual({ giant, className = "", loading }: { giant: Giant; className?: string; loading?: "lazy" | "eager" }) {
  if (!giant.images.length) {
    return <span className={`giant-visual-fallback scale-${giant.scale.toLowerCase()} ${className}`} aria-label={`Chưa có ảnh ${giant.name}`}><b>{giant.name.slice(0, 2)}</b><i>{giant.scale}</i></span>;
  }
  return <ResilientImage className={className} loading={loading} sources={giant.images} alt={giant.name} />;
}

export default function GiantsPage() {
  const [data, setData] = useState<GiantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(readRoute);
  const [query, setQuery] = useState("");
  const [medium, setMedium] = useState("Tất cả");
  const [scale, setScale] = useState("Tất cả");
  const [franchise, setFranchise] = useState("Tất cả");
  const [sort, setSort] = useState("name");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [page, setPage] = useState(() => Math.max(1, Number(sessionStorage.getItem(PAGE_KEY)) || 1));
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/giants.json`)
      .then((response) => response.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { sessionStorage.setItem(PAGE_KEY, String(page)); }, [page]);
  useEffect(() => {
    const onHash = () => {
      const id = readRoute();
      setSelectedId(id);
      if (id) window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (selectedId || loading) return;
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved === null) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: Number(saved) || 0, behavior: "auto" });
      sessionStorage.removeItem(SCROLL_KEY);
    }));
  }, [selectedId, loading]);
  useEffect(() => {
    document.title = selectedId ? "Hồ sơ Titan thần thoại" : "Mythic Titan Archive";
  }, [selectedId]);

  const giants = data?.giants ?? [];
  const franchises = useMemo(
    () => [...new Set(giants.map((item) => item.franchise))].sort((a, b) => a.localeCompare(b)),
    [giants],
  );
  const selected = giants.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const term = normalize(query);
    return giants.filter((item) =>
      (!term || normalize(`${item.name} ${item.franchise} ${item.universe} ${item.kind} ${item.description}`).includes(term))
      && (medium === "Tất cả" || item.media.includes(medium))
      && (scale === "Tất cả" || item.scale === scale)
      && (franchise === "Tất cả" || item.franchise === franchise)
      && (!favoritesOnly || favorites.includes(item.id))
    ).sort((a, b) => {
      if (sort === "largest") {
        if (a.heightMeters === null) return b.heightMeters === null ? 0 : 1;
        if (b.heightMeters === null) return -1;
        return b.heightMeters - a.heightMeters;
      }
      if (sort === "smallest") return (a.heightMeters ?? Number.MAX_SAFE_INTEGER) - (b.heightMeters ?? Number.MAX_SAFE_INTEGER);
      if (sort === "franchise") return a.franchise.localeCompare(b.franchise, "vi") || a.name.localeCompare(b.name, "vi");
      return a.name.localeCompare(b.name, "vi");
    });
  }, [giants, query, medium, scale, franchise, sort, favoritesOnly, favorites]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hero = giants.find((item) => item.id === "typhon") ?? giants[0];
  const cosmicCount = giants.filter((item) => item.scale === "Cosmic" || item.scale === "Planetary").length;
  const universeCount = new Set(giants.map((item) => item.universe)).size;

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const reset = () => {
    setQuery(""); setMedium("Tất cả"); setScale("Tất cả"); setFranchise("Tất cả");
    setFavoritesOnly(false); setPage(1);
  };
  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const openGiant = (giant: Giant) => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    window.location.hash = `/giants/character/${giant.id}`;
  };
  const randomGiant = () => {
    if (giants.length) openGiant(giants[Math.floor(Math.random() * giants.length)]);
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector(".giant-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="giant-page">
      <header className="giant-topbar">
        <a className="giant-brand" href="#/giants"><span className="giant-mark">T</span><span>MYTHIC TITAN ARCHIVE</span></a>
        <nav><a href="#">Pokédex</a><a href="#/pokemon-groups">Group Pokémon</a><a className="active" href="#/giants">Titan thần thoại</a></nav>
        <button onClick={randomGiant}>Titan ngẫu nhiên ✦</button>
      </header>

      {selectedId ? (
        loading ? <div className="giant-empty">Đang mở hồ sơ thực thể…</div> : selected ? (
          <article className="giant-detail">
            <div className="giant-detail-nav">
              <a href="#/giants">← Trở lại thư viện</a>
              <button className={favorites.includes(selected.id) ? "active" : ""} onClick={() => toggleFavorite(selected.id)}>♥ Yêu thích</button>
            </div>
            <section className="giant-splash">
              <GiantVisual giant={selected} loading="eager" />
              <div className="giant-splash-shade" />
              <div className="giant-splash-copy">
                <p>{selected.franchise} · {selected.universe}</p>
                <h1>{selected.name}</h1>
                <div>{selected.media.map((item) => <span key={item}>{item}</span>)}<span>{selected.kind}</span></div>
              </div>
            </section>
            <section className="giant-profile">
              <div>
                <p className="giant-kicker">HỒ SƠ TITAN / THẦN THÚ</p>
                <h2>{selected.name}</h2>
                <p>{selected.description}</p>
              </div>
              <div className="giant-facts">
                <p className="giant-kicker">QUY MÔ TRONG NGUỒN GỐC</p>
                <h2>{selected.sizeLabel}</h2>
                <dl>
                  <div><dt>Cấp kích thước</dt><dd>{SCALE_LABELS[selected.scale]}</dd></div>
                  <div><dt>Số quy đổi</dt><dd>{formatHeight(selected.heightMeters)}</dd></div>
                  <div><dt>Độ tin cậy</dt><dd>{selected.measurement}</dd></div>
                  <div><dt>Nguồn gốc</dt><dd>{selected.universe}</dd></div>
                </dl>
                <div className="giant-source-links"><a href={selected.sourceUrl} target="_blank" rel="noreferrer">Nguồn gốc / nhà phát hành ↗</a><a href={selected.wikipediaUrl} target="_blank" rel="noreferrer">Bách khoa tham khảo ↗</a></div>
              </div>
            </section>
            <section className="giant-related">
              <p className="giant-kicker">CÙNG TRUYỀN THỐNG / VŨ TRỤ</p>
              <h2>Titan liên quan</h2>
              <div>{giants.filter((item) => item.id !== selected.id && item.franchise === selected.franchise).slice(0, 8).map((item) => (
                <button key={item.id} onClick={() => { window.location.hash = `/giants/character/${item.id}`; }}><GiantVisual giant={item} loading="lazy" /><strong>{item.name}</strong></button>
              ))}</div>
            </section>
          </article>
        ) : <div className="giant-empty"><strong>Không tìm thấy Titan.</strong><a href="#/giants">Trở lại thư viện</a></div>
      ) : (
        <>
          <section className="giant-hero">
            <div>
              <p className="giant-kicker">THẦN THOẠI · CỔ ĐẠI · GAME · ANIME · MANGA · PHIM</p>
              <h1>Before gods.<br /><em>Beyond worlds.</em></h1>
              <p>Bách khoa liên văn hóa về Titan, Jötunn, đại xà thế giới, quái thú sáng thế và sinh vật thảm họa — từ thần thoại cổ đại đến những huyền thoại tái sinh trong game, anime và điện ảnh.</p>
              <div className="giant-hero-stats"><span><b>{giants.length || "—"}</b>Hồ sơ Titan</span><span><b>{universeCount || "—"}</b>Nguồn gốc</span><span><b>{cosmicCount || "—"}</b>Hành tinh / vũ trụ</span><span><b>{favorites.length}</b>Yêu thích</span></div>
            </div>
            {hero && <div className="giant-hero-art"><GiantVisual giant={hero} loading="eager" /><span>PRIMORDIAL</span></div>}
          </section>

          <section className="giant-catalog">
            <div className="giant-catalog-head"><div><p className="giant-kicker">ANCIENT & CROSS-UNIVERSE BESTIARY</p><h2>Mythic Titan Archive</h2></div><p><b>{filtered.length}</b> kết quả</p></div>
            <div className="giant-method"><span>Titan · Jötunn · thần thú · quái vật sáng thế</span><span>Nguồn cổ và canon được ghi nhãn riêng</span><span>Không biến fan-scaling thành số chính thức</span></div>
            <div className="giant-toolbar">
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm Titan, thần thoại, vũ trụ, chủng loại..." />
              <select value={franchise} onChange={(event) => { setFranchise(event.target.value); setPage(1); }}><option>Tất cả</option>{franchises.map((item) => <option key={item}>{item}</option>)}</select>
              <select value={scale} onChange={(event) => { setScale(event.target.value); setPage(1); }}>{SCALES.map((item) => <option key={item} value={item}>{item === "Tất cả" ? "Mọi kích thước" : SCALE_LABELS[item]}</option>)}</select>
              <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="name">Tên A → Z</option><option value="franchise">Theo truyền thống / vũ trụ</option><option value="largest">Lớn nhất trước</option><option value="smallest">Nhỏ nhất trước</option></select>
            </div>
            <div className="giant-media-filters">
              {MEDIA.map((item) => <button className={medium === item ? "active" : ""} onClick={() => { setMedium(item); setPage(1); }} key={item}>{item}</button>)}
              <button className={favoritesOnly ? "active favorite" : ""} onClick={() => { setFavoritesOnly(!favoritesOnly); setPage(1); }}>♥ Yêu thích</button>
              <button onClick={reset}>Xóa bộ lọc</button>
            </div>

            {loading ? <div className="giant-empty">Đang mở phong ấn kho lưu trữ Titan…</div> : filtered.length ? (
              <><Pagination position="top" page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onChange={changePage} />
              <div className="giant-grid">{paged.map((item) => (
                <article className={`giant-card scale-${item.scale.toLowerCase()}`} key={item.id}>
                  <button className="giant-card-main" onClick={() => openGiant(item)}>
                    <GiantVisual giant={item} loading="lazy" />
                    <span className="giant-card-shade" />
                    <span className="giant-scale-badge">{item.scale}</span>
                    <span className="giant-card-copy"><small>{item.franchise}</small><strong>{item.name}</strong><i>{item.sizeLabel}</i><em>{item.media.join(" · ")} · {item.kind}</em></span>
                  </button>
                  <button className={`giant-heart ${favorites.includes(item.id) ? "active" : ""}`} onClick={() => toggleFavorite(item.id)} aria-label={`Yêu thích ${item.name}`}>♥</button>
                </article>
              ))}</div><Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onChange={changePage} /></>
            ) : <div className="giant-empty"><strong>Không tìm thấy thực thể phù hợp.</strong><button onClick={reset}>Xóa bộ lọc</button></div>}
          </section>
        </>
      )}

      {showTop && <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}
      <footer className="giant-footer"><div className="giant-brand"><span className="giant-mark">T</span><span>MYTHIC TITAN ARCHIVE</span></div><p>Dữ liệu tổng hợp từ văn bản thần thoại, nguồn bách khoa và nhà phát hành chính thức.</p><p>Không đồng nhất Titan Hy Lạp với mọi sinh vật khổng lồ; quy mô không có số đo được ghi rõ.</p></footer>
    </main>
  );
}
