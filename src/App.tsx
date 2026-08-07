import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import ResilientImage from "./ResilientImage";

type Pokemon = {
  zukan_id: string; zukan_sub_id: number; pokemon_name: string; pokemon_sub_name: string;
  weight: number; height: number; file_name: string; pokemon_type_id: string; pokemon_type_name: string;
};
type EvolutionNode = {
  species: { name: string; url: string };
  evolution_details: Array<Record<string, any>>;
  evolves_to: EvolutionNode[];
};
type EvolutionItem = { id: number; condition: string };
type ApiPokemon = {
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  types: Array<{ type: { name: string; url: string } }>;
};
type Filters = {
  query: string; type: string; sort: string; generation: string;
  favoritesOnly: boolean; evolutionOnly: boolean; dualOnly: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  all: "Tất cả", normal: "Thường", grass: "Cỏ", fire: "Lửa", water: "Nước",
  electric: "Điện", bug: "Côn trùng", flying: "Bay", rock: "Đá", poison: "Độc",
  ground: "Đất", ice: "Băng", fighting: "Giác đấu", psychic: "Siêu linh",
  ghost: "Ma", dragon: "Rồng", dark: "Bóng tối", steel: "Thép", fairy: "Tiên",
};
const STAT_LABELS: Record<string, string> = {
  hp: "HP", attack: "Tấn công", defense: "Phòng thủ",
  "special-attack": "Tấn công đặc biệt", "special-defense": "Phòng thủ đặc biệt", speed: "Tốc độ",
};
const GENERATIONS: Record<string, [number, number]> = {
  all: [1, 1025], Kanto: [1, 151], Johto: [152, 251], Hoenn: [252, 386],
  Sinnoh: [387, 493], Unova: [494, 649], Kalos: [650, 721],
  Alola: [722, 809], Galar: [810, 905], Paldea: [906, 1025],
};
const DEFAULT_FILTERS: Filters = {
  query: "", type: "all", sort: "asc", generation: "all",
  favoritesOnly: false, evolutionOnly: false, dualOnly: false,
};
const TYPES = Object.keys(TYPE_LABELS);
const SOURCE = "https://vn.portal-pokemon.com/play/resources/pokedex";
const LIST_SCROLL_KEY = "pokedex:list-scroll-position";
const FILTER_KEY = "pokedex:filters";
const FAVORITES_KEY = "pokedex:favorites";
const TEAM_KEY = "pokedex:team";
const PAGE_KEY = "pokedex:list-page";
const PAGE_SIZE = 100;

function readStored<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
}
function readInitialTeam() {
  const shared = new URLSearchParams(window.location.search).get("team");
  if (shared) return shared.split(",").map(Number).filter((id) => id >= 1 && id <= 1025).slice(0, 6);
  return readStored<number[]>(TEAM_KEY, []);
}
function numberOf(p: Pokemon) { return Number(p.zukan_id); }
function idFromUrl(url: string) { return Number(url.match(/\/(\d+)\/?$/)?.[1] ?? 0); }
function pokemonImage(p: Pokemon) { return `${SOURCE}${p.file_name}`; }
function pokemonImages(p: Pokemon) {
  const id = numberOf(p);
  const officialImage = pokemonImage(p);
  if (p.zukan_sub_id !== 0) return [officialImage];
  return [
    officialImage,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  ];
}
function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().trim();
}
function readRoute() {
  const match = window.location.hash.match(/^#\/pokemon\/(\d{1,4})(?:_(\d+))?/);
  return match ? { id: Number(match[1]), subId: Number(match[2] ?? 0) } : null;
}
function generationOf(id: number) {
  return Object.entries(GENERATIONS).find(([name, [from, to]]) => name !== "all" && id >= from && id <= to)?.[0] ?? "Paldea";
}
function conditionText(detail?: Record<string, any>) {
  if (!detail) return "Tiến hóa";
  const parts: string[] = [];
  if (detail.min_level) parts.push(`Cấp ${detail.min_level}`);
  if (detail.item?.name) parts.push(`Dùng ${detail.item.name.replaceAll("-", " ")}`);
  if (detail.held_item?.name) parts.push(`Giữ ${detail.held_item.name.replaceAll("-", " ")}`);
  if (detail.min_happiness) parts.push(`Thân thiết ≥ ${detail.min_happiness}`);
  if (detail.time_of_day) parts.push(detail.time_of_day === "day" ? "Ban ngày" : "Ban đêm");
  if (detail.known_move?.name) parts.push(`Biết ${detail.known_move.name.replaceAll("-", " ")}`);
  if (detail.location?.name) parts.push(`Tại ${detail.location.name.replaceAll("-", " ")}`);
  if (detail.trigger?.name === "trade") parts.push("Trao đổi");
  return parts.length ? parts.join(" · ") : "Điều kiện đặc biệt";
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filters, setFilters] = useState<Filters>(() => ({ ...DEFAULT_FILTERS, ...readStored(FILTER_KEY, {}) }));
  const [favorites, setFavorites] = useState<number[]>(() => readStored(FAVORITES_KEY, []));
  const [team, setTeam] = useState<number[]>(readInitialTeam);
  const [compare, setCompare] = useState<number[]>([]);
  const [detailRoute, setDetailRoute] = useState<{ id: number; subId: number } | null>(readRoute);
  const [evolutions, setEvolutions] = useState<EvolutionItem[]>([]);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [apiDetails, setApiDetails] = useState<Record<number, ApiPokemon>>({});
  const [weaknesses, setWeaknesses] = useState<Record<string, number>>({});
  const [panel, setPanel] = useState<"compare" | "team" | "quiz" | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [toast, setToast] = useState("");
  const [quizId, setQuizId] = useState(25);
  const [quizGuess, setQuizGuess] = useState("");
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [page, setPage] = useState(() => Math.max(1, Number(sessionStorage.getItem(PAGE_KEY)) || 1));

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokemon.json`).then((r) => r.json())
      .then((data) => setPokemons(data.pokemons)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { localStorage.setItem(FILTER_KEY, JSON.stringify(filters)); }, [filters]);
  useEffect(() => { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(TEAM_KEY, JSON.stringify(team)); }, [team]);
  useEffect(() => { sessionStorage.setItem(PAGE_KEY, String(page)); }, [page]);
  useEffect(() => {
    const onHash = () => {
      const route = readRoute(); setDetailRoute(route);
      if (route !== null) window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const onScroll = () => setShowTop(window.scrollY > 650);
    window.addEventListener("hashchange", onHash); window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => {
    if (detailRoute !== null || loading) return;
    const saved = sessionStorage.getItem(LIST_SCROLL_KEY);
    if (saved === null) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: Number(saved) || 0, behavior: "auto" });
      sessionStorage.removeItem(LIST_SCROLL_KEY);
    }));
  }, [detailRoute, loading]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const primaryPokemons = useMemo(() => pokemons.filter((p) => p.zukan_sub_id === 0), [pokemons]);
  const byId = (id: number) => primaryPokemons.find((p) => numberOf(p) === id);
  const selected = detailRoute
    ? pokemons.find((pokemon) => numberOf(pokemon) === detailRoute.id && pokemon.zukan_sub_id === detailRoute.subId) ?? null
    : null;

  const loadApiPokemon = async (id: number) => {
    if (apiDetails[id]) return apiDetails[id];
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then((r) => r.json());
    setApiDetails((old) => ({ ...old, [id]: data }));
    return data as ApiPokemon;
  };

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setEvolutionLoading(true); setEvolutions([]); setWeaknesses({});
    const id = numberOf(selected);
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).then((r) => r.json())
        .then((species) => fetch(species.evolution_chain.url)).then((r) => r.json()),
      loadApiPokemon(id),
    ]).then(async ([chainData, pokemonData]) => {
      const items: EvolutionItem[] = [];
      const walk = (node: EvolutionNode) => {
        items.push({ id: idFromUrl(node.species.url), condition: conditionText(node.evolution_details?.[0]) });
        node.evolves_to.forEach(walk);
      };
      walk(chainData.chain);
      const typeData = await Promise.all(pokemonData.types.map((entry) => fetch(entry.type.url).then((r) => r.json())));
      const multipliers: Record<string, number> = {};
      TYPES.filter((t) => t !== "all").forEach((t) => { multipliers[t] = 1; });
      typeData.forEach((data) => {
        data.damage_relations.double_damage_from.forEach((x: { name: string }) => { multipliers[x.name] *= 2; });
        data.damage_relations.half_damage_from.forEach((x: { name: string }) => { multipliers[x.name] *= .5; });
        data.damage_relations.no_damage_from.forEach((x: { name: string }) => { multipliers[x.name] = 0; });
      });
      if (!cancelled) { setEvolutions(items); setWeaknesses(multipliers); }
    }).catch(() => {
      if (!cancelled) setEvolutions([{ id, condition: "Pokémon hiện tại" }]);
    }).finally(() => { if (!cancelled) setEvolutionLoading(false); });
    return () => { cancelled = true; };
  }, [selected]);

  useEffect(() => {
    [...compare, ...team].forEach((id) => { if (!apiDetails[id]) loadApiPokemon(id).catch(() => undefined); });
  }, [compare, team]);

  const filtered = useMemo(() => {
    const q = normalize(filters.query);
    const [from, to] = GENERATIONS[filters.generation] ?? GENERATIONS.all;
    return pokemons.filter((p) => {
      const id = numberOf(p); const types = p.pokemon_type_id.split(",");
      return (!q || normalize(`${p.pokemon_name} ${p.pokemon_sub_name} ${id}`).includes(q))
        && (filters.type === "all" || types.includes(filters.type))
        && id >= from && id <= to
        && (!filters.favoritesOnly || favorites.includes(id))
        && (!filters.evolutionOnly || evolutionsKnown(id))
        && (!filters.dualOnly || types.length === 2);
    }).sort((a, b) => {
      if (filters.sort === "weight") return b.weight - a.weight;
      if (filters.sort === "height") return b.height - a.height;
      if (filters.sort === "name") return a.pokemon_name.localeCompare(b.pokemon_name);
      return filters.sort === "desc" ? numberOf(b) - numberOf(a) : numberOf(a) - numberOf(b);
    });
  }, [pokemons, filters, favorites]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedPokemons = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function evolutionsKnown(id: number) {
    const nonEvolving = new Set([83, 115, 127, 128, 131, 132, 142, 144, 145, 146, 150, 151, 201, 213, 214, 222, 225, 227, 235, 241, 243, 244, 245, 249, 250, 251, 302, 303, 324, 327, 335, 336, 337, 338, 351, 352, 357, 359, 369, 370, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386]);
    return !nonEvolving.has(id);
  }
  const toggle = (list: number[], setter: (ids: number[]) => void, id: number, max?: number) => {
    if (list.includes(id)) setter(list.filter((x) => x !== id));
    else if (!max || list.length < max) setter([...list, id]);
    else setToast(`Chỉ được chọn tối đa ${max} Pokémon`);
  };
  const openPokemon = (p: Pokemon) => { window.location.hash = `/pokemon/${String(numberOf(p)).padStart(4, "0")}${p.zukan_sub_id ? `_${p.zukan_sub_id}` : ""}`; };
  const openPokemonFromList = (p: Pokemon) => {
    sessionStorage.setItem(LIST_SCROLL_KEY, String(window.scrollY)); openPokemon(p);
  };
  const randomPokemon = () => {
    const p = primaryPokemons[Math.floor(Math.random() * primaryPokemons.length)];
    if (p) openPokemonFromList(p);
  };
  const sharePokemon = async () => {
    const data = { title: selected?.pokemon_name ?? "Pokédex Việt Nam", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); setToast("Đã sao chép đường dẫn"); }
    } catch { /* user cancelled */ }
  };
  const copyPokemonImage = async (pokemon: Pokemon) => {
    const sources = pokemonImages(pokemon);
    if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
      for (const source of sources) {
        try {
          const response = await fetch(source, { mode: "cors" });
          if (!response.ok) continue;
          const blob = await response.blob();
          if (blob.type !== "image/png") continue;
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setToast(`Đã sao chép ảnh ${pokemon.pokemon_name}`);
          return;
        } catch { /* try the next image source */ }
      }
    }
    try {
      await navigator.clipboard.writeText(sources[0]);
      setToast("Không thể sao chép file ảnh · Đã sao chép đường dẫn ảnh");
    } catch {
      setToast("Trình duyệt không cho phép truy cập clipboard");
    }
  };
  const shareTeam = async () => {
    const url = `${window.location.origin}${window.location.pathname}?team=${team.join(",")}#/`;
    try {
      if (navigator.share) await navigator.share({ title: "Đội hình Pokémon của tôi", url });
      else { await navigator.clipboard.writeText(url); setToast("Đã sao chép đường dẫn đội hình"); }
    } catch { /* user cancelled */ }
  };
  const nextQuiz = () => {
    const p = primaryPokemons[Math.floor(Math.random() * primaryPokemons.length)];
    if (p) { setQuizId(numberOf(p)); setQuizGuess(""); setQuizRevealed(false); }
  };
  const submitQuiz = () => {
    const answer = byId(quizId);
    if (!answer || quizRevealed) return;
    const correct = normalize(quizGuess) === normalize(answer.pokemon_name);
    setQuizRevealed(true);
    if (correct) { setQuizScore((s) => s + 1); setQuizStreak((s) => s + 1); }
    else setQuizStreak(0);
  };
  const updateFilters = (next: Filters) => { setFilters(next); setPage(1); };
  const resetFilters = () => updateFilters(DEFAULT_FILTERS);
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const evolutionPokemons = evolutions.map((e) => ({ ...e, pokemon: byId(e.id) })).filter((e) => e.pokemon) as Array<EvolutionItem & { pokemon: Pokemon }>;
  const previous = selected ? byId(numberOf(selected) - 1) : undefined;
  const next = selected ? byId(numberOf(selected) + 1) : undefined;
  const selectedApi = selected ? apiDetails[numberOf(selected)] : undefined;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Trang đầu Pokédex"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></a>
        <nav>
          <a className="active" href="#collection">Bộ sưu tập</a>
          <a href="#/pokemon-groups">Group Pokémon</a>
          <button onClick={() => setPanel("compare")}>So sánh <b>{compare.length || ""}</b></button>
          <button onClick={() => setPanel("team")}>Đội hình <b>{team.length || ""}</b></button>
          <button onClick={() => setPanel("quiz")}>Đoán Pokémon</button>
        </nav>
        <button className="source-link random-link" onClick={randomPokemon}>Khám phá ngẫu nhiên ✦</button>
      </header>

      {detailRoute !== null ? (
        loading ? <div className="empty detail-empty">Đang mở hồ sơ Pokémon…</div> : selected ? (
          <article className="detail-page">
            <div className="detail-nav">
              <a href="#collection">← Trở lại Pokédex</a>
              <div>
                <button className={favorites.includes(numberOf(selected)) ? "selected-action" : ""} onClick={() => toggle(favorites, setFavorites, numberOf(selected))}>♥ Yêu thích</button>
                <button onClick={() => toggle(compare, setCompare, numberOf(selected), 3)}>⇄ So sánh</button>
                <button onClick={() => toggle(team, setTeam, numberOf(selected), 6)}>＋ Đội hình</button>
                <button onClick={sharePokemon}>↗ Chia sẻ</button>
              </div>
            </div>
            <section className="detail-hero">
              <div className={`detail-art tint-${selected.pokemon_type_id.split(",")[0]}`}><span>{selected.zukan_id}</span><ResilientImage sources={pokemonImages(selected)} alt={selected.pokemon_name} /></div>
              <div className="detail-info">
                <p className="eyebrow"><span /> {generationOf(numberOf(selected))}</p>
                <p className="modal-no">POKÉDEX #{selected.zukan_id}</p><h1>{selected.pokemon_name}</h1>
                {selected.pokemon_sub_name && <p className="subname">{selected.pokemon_sub_name}</p>}
                <div className="badges large">{selected.pokemon_type_id.split(",").map((t) => <i className={t} key={t}>{TYPE_LABELS[t]}</i>)}</div>
                <div className="measurements"><div><span>CHIỀU CAO</span><strong>{selected.height} m</strong></div><div><span>CÂN NẶNG</span><strong>{selected.weight} kg</strong></div></div>
                <div className="detail-pager">{previous && <button onClick={() => openPokemon(previous)}>← {previous.pokemon_name}</button>}{next && <button onClick={() => openPokemon(next)}>{next.pokemon_name} →</button>}</div>
              </div>
            </section>

            <section className="battle-section">
              <div className="battle-block">
                <p className="eyebrow"><span /> CHỈ SỐ CƠ BẢN</p><h2>Năng lực</h2>
                {selectedApi ? <div className="stat-list">{selectedApi.stats.map((s) => <div className="stat-row" key={s.stat.name}><span>{STAT_LABELS[s.stat.name]}</span><div><i style={{ width: `${Math.min(s.base_stat / 1.8, 100)}%` }} /></div><strong>{s.base_stat}</strong></div>)}</div> : <p>Đang tải chỉ số…</p>}
              </div>
              <div className="battle-block">
                <p className="eyebrow"><span /> TƯƠNG QUAN HỆ</p><h2>Điểm yếu & kháng</h2>
                <div className="effectiveness">{Object.entries(weaknesses).filter(([, value]) => value !== 1).sort((a, b) => b[1] - a[1]).map(([t, value]) => <span className={t} key={t}>{TYPE_LABELS[t]} <b>×{value}</b></span>)}</div>
                <p className="section-note">×2/×4: yếu · ×0.5/×0.25: kháng · ×0: miễn nhiễm</p>
              </div>
            </section>

            <section className="evolution-section">
              <p className="eyebrow"><span /> QUÁ TRÌNH PHÁT TRIỂN</p><h2>Dạng tiến hóa</h2>
              {evolutionLoading ? <div className="evolution-loading">Đang tải chuỗi tiến hóa…</div> : (
                <div className={`evolution-chain ${evolutionPokemons.length > 4 ? "branched" : ""}`}>
                  {evolutionPokemons.map(({ pokemon: p, condition }, index) => <div className="evolution-step" key={p.zukan_id}>
                    {index > 0 && <span className="evolution-arrow"><b>→</b><small>{condition}</small></span>}
                    <button className={numberOf(p) === numberOf(selected) ? "current" : ""} onClick={() => openPokemon(p)}>
                      <span className={`evolution-image tint-${p.pokemon_type_id.split(",")[0]}`}><ResilientImage sources={pokemonImages(p)} alt={p.pokemon_name} /></span>
                      <small>#{p.zukan_id}</small><strong>{p.pokemon_name}</strong>
                      <span className="mini-types">{p.pokemon_type_id.split(",").map((t) => <i className={t} key={t}>{TYPE_LABELS[t]}</i>)}</span>
                    </button>
                  </div>)}
                </div>
              )}
            </section>
          </article>
        ) : <div className="empty detail-empty"><strong>Không tìm thấy Pokémon.</strong><a href="#collection">Trở lại Pokédex</a></div>
      ) : (
        <>
          <section className="hero">
            <div className="hero-copy"><p className="eyebrow"><span /> THẾ GIỚI POKÉMON</p><h1>Khám phá mọi<br /><em>Pokémon.</em></h1><p className="intro">Tra cứu, so sánh, xây dựng đội hình và khám phá toàn bộ thế giới Pokémon.</p>
              <div className="hero-actions"><button onClick={randomPokemon}>Pokémon ngẫu nhiên</button><button onClick={() => setPanel("quiz")}>Chơi đoán hình</button></div>
              <div className="stats"><div><strong>1.025</strong><span>Pokémon</span></div><div><strong>{favorites.length}</strong><span>Yêu thích</span></div><div><strong>{team.length}/6</strong><span>Đội hình</span></div></div>
            </div>
            <div className="hero-art" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="hero-number">025</span><img src={`${SOURCE}/img/pm/2b3f6ff00db7a1efae21d85cfb8995eaff2da8d8.png`} alt="" /><span className="spark spark-one">✦</span><span className="spark spark-two">✦</span></div>
          </section>
          <section className="catalog" id="collection">
            <div className="catalog-head"><div><p className="eyebrow"><span /> TỪ ĐIỂN QUỐC GIA</p><h2>Tất cả Pokémon</h2></div><p className="result-count"><strong>{filtered.length}</strong> kết quả</p></div>
            <div className="toolbar">
              <label className="search"><span>⌕</span><input value={filters.query} onChange={(e) => updateFilters({ ...filters, query: e.target.value })} placeholder="Tìm tên không dấu hoặc số..." /><kbd>⌘ K</kbd></label>
              <label className="sort"><span>Sắp xếp</span><select value={filters.sort} onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}><option value="asc">Số thấp → cao</option><option value="desc">Số cao → thấp</option><option value="name">Tên A → Z</option><option value="weight">Nặng nhất</option><option value="height">Cao nhất</option></select></label>
              <label className="sort"><span>Vùng</span><select value={filters.generation} onChange={(e) => updateFilters({ ...filters, generation: e.target.value })}>{Object.keys(GENERATIONS).map((g) => <option value={g} key={g}>{g === "all" ? "Tất cả vùng" : g}</option>)}</select></label>
            </div>
            <div className="quick-filters">
              <button className={filters.favoritesOnly ? "active" : ""} onClick={() => updateFilters({ ...filters, favoritesOnly: !filters.favoritesOnly })}>♥ Yêu thích</button>
              <button className={filters.evolutionOnly ? "active" : ""} onClick={() => updateFilters({ ...filters, evolutionOnly: !filters.evolutionOnly })}>Có tiến hóa</button>
              <button className={filters.dualOnly ? "active" : ""} onClick={() => updateFilters({ ...filters, dualOnly: !filters.dualOnly })}>Pokémon hai hệ</button>
              <button onClick={resetFilters}>Xóa bộ lọc</button>
            </div>
            <div className="types">{TYPES.map((item) => <button key={item} className={`${item} ${filters.type === item ? "selected" : ""}`} onClick={() => updateFilters({ ...filters, type: item })}>{TYPE_LABELS[item]}</button>)}</div>
            {loading ? <div className="empty">Đang mở Pokédex…</div> : filtered.length === 0 ? <div className="empty"><strong>Không tìm thấy Pokémon.</strong><button onClick={resetFilters}>Xóa bộ lọc</button></div> : (
              <><Pagination position="top" page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onChange={changePage} /><div className="grid">{pagedPokemons.map((p, index) => {
                const id = numberOf(p); const typeIds = p.pokemon_type_id.split(","); const typeNames = p.pokemon_type_name.split(",").map((x) => x.replace(/^hệ\s*/i, ""));
                return <article className="card" key={`${p.zukan_id}-${p.zukan_sub_id}-${index}`}>
                  <button className="card-main" onClick={() => openPokemonFromList(p)}><span className="card-no">#{String(id).padStart(4, "0")}</span><span className={`image-wrap tint-${typeIds[0]}`}><ResilientImage loading="lazy" sources={pokemonImages(p)} alt={p.pokemon_name} /></span><span className="card-content"><strong>{p.pokemon_name}</strong>{p.pokemon_sub_name && <small>{p.pokemon_sub_name}</small>}<span className="badges">{typeIds.map((t, i) => <i className={t} key={t}>{typeNames[i]}</i>)}</span></span></button>
                  <div className="card-actions"><button className="copy-image-action" onClick={() => copyPokemonImage(p)} title={`Sao chép ảnh ${p.pokemon_name}`} aria-label={`Sao chép ảnh ${p.pokemon_name}`}>⧉</button><button className={favorites.includes(id) ? "active" : ""} onClick={() => toggle(favorites, setFavorites, id)} title="Yêu thích">♥</button><button className={compare.includes(id) ? "active" : ""} onClick={() => toggle(compare, setCompare, id, 3)} title="So sánh">⇄</button><button className={team.includes(id) ? "active" : ""} onClick={() => toggle(team, setTeam, id, 6)} title="Thêm vào đội">＋</button></div>
                </article>;
              })}</div><Pagination page={page} pageSize={PAGE_SIZE} totalItems={filtered.length} onChange={changePage} /></>
            )}
          </section>
          <section className="about" id="about"><p className="eyebrow"><span /> CÔNG CỤ HUẤN LUYỆN VIÊN</p><h2>Hiểu rõ hơn.<br />Chọn tốt hơn.</h2><p>Lưu Pokémon yêu thích, so sánh chỉ số, phân tích điểm yếu và xây dựng đội hình sáu thành viên ngay trên trình duyệt.</p></section>
        </>
      )}

      {panel && <div className="tool-backdrop" onClick={() => setPanel(null)}><section className="tool-panel" onClick={(e) => e.stopPropagation()}><button className="tool-close" onClick={() => setPanel(null)}>×</button>
        {panel === "compare" && <><p className="eyebrow"><span /> PHÒNG PHÂN TÍCH</p><h2>So sánh Pokémon</h2><p>Chọn tối đa 3 Pokémon bằng nút ⇄ trên mỗi thẻ.</p><div className="compare-grid">{compare.map((id) => { const p = byId(id); const data = apiDetails[id]; return p && <article className="compare-card" key={id}><button onClick={() => setCompare(compare.filter((x) => x !== id))}>×</button><ResilientImage sources={pokemonImages(p)} alt={p.pokemon_name} /><h3>{p.pokemon_name}</h3><div className="compact-stats">{data?.stats.map((s) => <p key={s.stat.name}><span>{STAT_LABELS[s.stat.name]}</span><b>{s.base_stat}</b></p>) ?? <p>Đang tải…</p>}</div></article>; })}</div>{compare.length === 0 && <div className="empty">Chưa chọn Pokémon để so sánh.</div>}</>}
        {panel === "team" && <><p className="eyebrow"><span /> ĐỘI HÌNH CỦA BẠN</p><h2>{team.length}/6 thành viên</h2><div className="team-grid">{Array.from({ length: 6 }, (_, i) => { const p = byId(team[i]); return <article className="team-slot" key={i}>{p ? <><button onClick={() => setTeam(team.filter((id) => id !== numberOf(p)))}>×</button><ResilientImage sources={pokemonImages(p)} alt={p.pokemon_name} /><strong>{p.pokemon_name}</strong><span className="mini-types">{p.pokemon_type_id.split(",").map((t) => <i className={t} key={t}>{TYPE_LABELS[t]}</i>)}</span></> : <span>Vị trí {i + 1}<br /><small>Chưa chọn</small></span>}</article>; })}</div><TeamAnalysis team={team} byId={byId} /><div className="team-buttons"><button className="primary-button" onClick={shareTeam} disabled={!team.length}>↗ Chia sẻ đội hình</button><button className="clear-tool" onClick={() => setTeam([])}>Xóa đội hình</button></div></>}
        {panel === "quiz" && <Quiz pokemon={byId(quizId)} guess={quizGuess} setGuess={setQuizGuess} revealed={quizRevealed} submit={submitQuiz} next={nextQuiz} score={quizScore} streak={quizStreak} />}
      </section></div>}
      {showTop && <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}
      {toast && <div className="toast">{toast}</div>}
      <footer><div className="brand"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></div><p>Dự án tra cứu dành cho người hâm mộ.</p><p>Pokémon và tên Pokémon là thương hiệu của Nintendo / Creatures Inc. / GAME FREAK inc.</p></footer>
    </main>
  );
}

function TeamAnalysis({ team, byId }: { team: number[]; byId: (id: number) => Pokemon | undefined }) {
  const counts: Record<string, number> = {};
  team.forEach((id) => byId(id)?.pokemon_type_id.split(",").forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
  const duplicates = Object.entries(counts).filter(([, count]) => count > 1);
  return <div className="team-analysis"><strong>Phân tích nhanh</strong><p>{team.length < 6 ? `Còn ${6 - team.length} vị trí trống.` : "Đội hình đã đủ 6 thành viên."}</p><p>{duplicates.length ? `Hệ đang trùng: ${duplicates.map(([t, n]) => `${TYPE_LABELS[t]} (${n})`).join(", ")}.` : "Phân bố hệ đang đa dạng."}</p></div>;
}

function Quiz({ pokemon, guess, setGuess, revealed, submit, next, score, streak }: {
  pokemon?: Pokemon; guess: string; setGuess: (v: string) => void; revealed: boolean;
  submit: () => void; next: () => void; score: number; streak: number;
}) {
  if (!pokemon) return null;
  return <div className="quiz"><p className="eyebrow"><span /> MINI GAME</p><h2>Đây là Pokémon nào?</h2><div className="quiz-score"><span>Điểm <b>{score}</b></span><span>Chuỗi đúng <b>{streak}</b></span></div><div className={`quiz-image ${revealed ? "revealed" : ""}`}><ResilientImage sources={pokemonImages(pokemon)} alt={pokemon.pokemon_name} /></div>{revealed ? <><h3>{pokemon.pokemon_name}</h3><button className="primary-button" onClick={next}>Câu tiếp theo →</button></> : <form onSubmit={(e) => { e.preventDefault(); submit(); }}><input autoFocus value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Nhập tên Pokémon..." /><button className="primary-button">Trả lời</button></form>}</div>;
}
