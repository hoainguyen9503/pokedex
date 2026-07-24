import { useEffect, useMemo, useState } from "react";

type Pokemon = {
  zukan_id: string;
  zukan_sub_id: number;
  pokemon_name: string;
  pokemon_sub_name: string;
  weight: number;
  height: number;
  file_name: string;
  pokemon_type_id: string;
  pokemon_type_name: string;
};

type EvolutionNode = {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
};

const TYPE_LABELS: Record<string, string> = {
  all: "Tất cả", normal: "Thường", grass: "Cỏ", fire: "Lửa", water: "Nước",
  electric: "Điện", bug: "Côn trùng", flying: "Bay", rock: "Đá", poison: "Độc",
  ground: "Đất", ice: "Băng", fighting: "Giác đấu", psychic: "Siêu linh",
  ghost: "Ma", dragon: "Rồng", dark: "Bóng tối", steel: "Thép", fairy: "Tiên",
};

const TYPES = Object.keys(TYPE_LABELS);
const SOURCE = "https://vn.portal-pokemon.com/play/resources/pokedex";

function numberOf(p: Pokemon) {
  return Number(p.zukan_id);
}

function generationOf(id: number) {
  if (id <= 151) return "Kanto";
  if (id <= 251) return "Johto";
  if (id <= 386) return "Hoenn";
  if (id <= 493) return "Sinnoh";
  if (id <= 649) return "Unova";
  if (id <= 721) return "Kalos";
  if (id <= 809) return "Alola";
  if (id <= 905) return "Galar";
  return "Paldea";
}

function idFromUrl(url: string) {
  return Number(url.match(/\/(\d+)\/?$/)?.[1] ?? 0);
}

function readRoute() {
  const match = window.location.hash.match(/^#\/pokemon\/(\d{1,4})/);
  return match ? Number(match[1]) : null;
}

function pokemonImage(p: Pokemon) {
  return `${SOURCE}${p.file_name}`;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("asc");
  const [detailId, setDetailId] = useState<number | null>(readRoute);
  const [evolutionIds, setEvolutionIds] = useState<number[]>([]);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokemon.json`)
      .then((r) => r.json())
      .then((data) => setPokemons(data.pokemons))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      setDetailId(readRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const selected = useMemo(
    () => pokemons.find((p) => numberOf(p) === detailId && p.zukan_sub_id === 0)
      ?? pokemons.find((p) => numberOf(p) === detailId)
      ?? null,
    [pokemons, detailId],
  );

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setEvolutionLoading(true);
    setEvolutionIds([]);

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${numberOf(selected)}/`)
      .then((r) => {
        if (!r.ok) throw new Error("Không tải được loài Pokémon");
        return r.json();
      })
      .then((species) => fetch(species.evolution_chain.url))
      .then((r) => {
        if (!r.ok) throw new Error("Không tải được chuỗi tiến hóa");
        return r.json();
      })
      .then((data) => {
        const ids: number[] = [];
        const walk = (node: EvolutionNode) => {
          ids.push(idFromUrl(node.species.url));
          node.evolves_to.forEach(walk);
        };
        walk(data.chain);
        if (!cancelled) setEvolutionIds([...new Set(ids.filter(Boolean))]);
      })
      .catch(() => {
        if (!cancelled) setEvolutionIds([numberOf(selected)]);
      })
      .finally(() => {
        if (!cancelled) setEvolutionLoading(false);
      });

    return () => { cancelled = true; };
  }, [selected]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    const list = pokemons.filter((p) => {
      const matchesQuery =
        !normalized ||
        p.pokemon_name.toLocaleLowerCase().includes(normalized) ||
        p.pokemon_sub_name.toLocaleLowerCase().includes(normalized) ||
        String(numberOf(p)).includes(normalized);
      const matchesType = type === "all" || p.pokemon_type_id.split(",").includes(type);
      return matchesQuery && matchesType;
    });
    return list.sort((a, b) => {
      if (sort === "weight") return b.weight - a.weight;
      if (sort === "height") return b.height - a.height;
      return sort === "desc" ? numberOf(b) - numberOf(a) : numberOf(a) - numberOf(b);
    });
  }, [pokemons, query, type, sort]);

  const openPokemon = (p: Pokemon) => {
    window.location.hash = `/pokemon/${String(numberOf(p)).padStart(4, "0")}`;
  };

  const reset = () => {
    setQuery("");
    setType("all");
    setSort("asc");
  };

  const primaryPokemons = useMemo(
    () => pokemons.filter((p) => p.zukan_sub_id === 0),
    [pokemons],
  );

  const evolutionPokemons = evolutionIds
    .map((id) => primaryPokemons.find((p) => numberOf(p) === id))
    .filter((p): p is Pokemon => Boolean(p));

  const previous = selected
    ? primaryPokemons.find((p) => numberOf(p) === numberOf(selected) - 1)
    : null;
  const next = selected
    ? primaryPokemons.find((p) => numberOf(p) === numberOf(selected) + 1)
    : null;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Trang đầu Pokédex">
          <span className="brandball"><i /></span>
          <span>POKÉDEX<span className="branddot">.</span></span>
        </a>
        <nav>
          <a className="active" href="#collection">Bộ sưu tập</a>
          <a href="#about">Giới thiệu</a>
        </nav>
        <a className="source-link" href="https://vn.portal-pokemon.com/play/pokedex" target="_blank" rel="noreferrer">
          Nguồn chính thức ↗
        </a>
      </header>

      {detailId !== null ? (
        loading ? (
          <div className="empty detail-empty">Đang mở hồ sơ Pokémon…</div>
        ) : selected ? (
          <article className="detail-page">
            <div className="detail-nav">
              <a href="#collection">← Trở lại Pokédex</a>
              <div>
                {previous && <button onClick={() => openPokemon(previous)}>← #{previous.zukan_id} {previous.pokemon_name}</button>}
                {next && <button onClick={() => openPokemon(next)}>#{next.zukan_id} {next.pokemon_name} →</button>}
              </div>
            </div>

            <section className="detail-hero">
              <div className={`detail-art tint-${selected.pokemon_type_id.split(",")[0]}`}>
                <span>{String(numberOf(selected)).padStart(4, "0")}</span>
                <img src={pokemonImage(selected)} alt={selected.pokemon_name} />
              </div>
              <div className="detail-info">
                <p className="eyebrow"><span /> {generationOf(numberOf(selected))}</p>
                <p className="modal-no">POKÉDEX #{String(numberOf(selected)).padStart(4, "0")}</p>
                <h1>{selected.pokemon_name}</h1>
                {selected.pokemon_sub_name && <p className="subname">{selected.pokemon_sub_name}</p>}
                <div className="badges large">
                  {selected.pokemon_type_id.split(",").map((t) => <i className={t} key={t}>{TYPE_LABELS[t]}</i>)}
                </div>
                <div className="measurements">
                  <div><span>CHIỀU CAO</span><strong>{selected.height} m</strong></div>
                  <div><span>CÂN NẶNG</span><strong>{selected.weight} kg</strong></div>
                </div>
                <p className="detail-description">
                  Khám phá thông tin và chuỗi tiến hóa của {selected.pokemon_name}. Chọn một Pokémon
                  trong sơ đồ bên dưới để xem hồ sơ tương ứng.
                </p>
              </div>
            </section>

            <section className="evolution-section">
              <p className="eyebrow"><span /> QUÁ TRÌNH PHÁT TRIỂN</p>
              <h2>Dạng tiến hóa</h2>
              {evolutionLoading ? (
                <div className="evolution-loading">Đang tải chuỗi tiến hóa…</div>
              ) : (
                <div className={`evolution-chain ${evolutionPokemons.length > 4 ? "branched" : ""}`}>
                  {evolutionPokemons.map((p, index) => (
                    <div className="evolution-step" key={p.zukan_id}>
                      {index > 0 && <span className="evolution-arrow">→</span>}
                      <button
                        className={numberOf(p) === numberOf(selected) ? "current" : ""}
                        onClick={() => openPokemon(p)}
                        aria-label={`Xem ${p.pokemon_name}`}
                      >
                        <span className={`evolution-image tint-${p.pokemon_type_id.split(",")[0]}`}>
                          <img src={pokemonImage(p)} alt="" />
                        </span>
                        <small>#{p.zukan_id}</small>
                        <strong>{p.pokemon_name}</strong>
                        <span className="mini-types">
                          {p.pokemon_type_id.split(",").map((t) => <i className={t} key={t}>{TYPE_LABELS[t]}</i>)}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="evolution-note">Dữ liệu quan hệ tiến hóa được đối chiếu qua PokéAPI; tên và hình ảnh lấy từ Pokédex Việt Nam.</p>
            </section>
          </article>
        ) : (
          <div className="empty detail-empty">
            <strong>Không tìm thấy Pokémon.</strong>
            <a href="#collection">Trở lại Pokédex</a>
          </div>
        )
      ) : (
        <>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow"><span /> THẾ GIỚI POKÉMON</p>
              <h1>Khám phá mọi<br /><em>Pokémon.</em></h1>
              <p className="intro">Tra cứu toàn bộ Pokédex — từ những người bạn đầu tiên tại Kanto đến các Pokémon mới nhất ở Paldea.</p>
              <div className="stats">
                <div><strong>1.025</strong><span>Pokémon</span></div>
                <div><strong>18</strong><span>Hệ</span></div>
                <div><strong>9</strong><span>Vùng đất</span></div>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <span className="orbit orbit-one" /><span className="orbit orbit-two" />
              <span className="hero-number">025</span>
              <img src={`${SOURCE}/img/pm/2b3f6ff00db7a1efae21d85cfb8995eaff2da8d8.png`} alt="" />
              <span className="spark spark-one">✦</span><span className="spark spark-two">✦</span>
            </div>
          </section>

          <section className="catalog" id="collection">
            <div className="catalog-head">
              <div><p className="eyebrow"><span /> TỪ ĐIỂN QUỐC GIA</p><h2>Tất cả Pokémon</h2></div>
              <p className="result-count"><strong>{filtered.length}</strong> kết quả</p>
            </div>
            <div className="toolbar">
              <label className="search">
                <span>⌕</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên hoặc số..." aria-label="Tìm Pokémon" />
                <kbd>⌘ K</kbd>
              </label>
              <label className="sort">
                <span>Sắp xếp</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="asc">Số thấp → cao</option><option value="desc">Số cao → thấp</option>
                  <option value="weight">Nặng nhất</option><option value="height">Cao nhất</option>
                </select>
              </label>
            </div>
            <div className="types" aria-label="Lọc theo hệ">
              {TYPES.map((item) => (
                <button key={item} className={`${item} ${type === item ? "selected" : ""}`} onClick={() => setType(item)}>
                  {TYPE_LABELS[item]}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="empty">Đang mở Pokédex…</div>
            ) : filtered.length === 0 ? (
              <div className="empty"><strong>Không tìm thấy Pokémon.</strong><button onClick={reset}>Xóa bộ lọc</button></div>
            ) : (
              <div className="grid">
                {filtered.map((p, index) => {
                  const typeIds = p.pokemon_type_id.split(",");
                  const typeNames = p.pokemon_type_name.split(",").map((x) => x.replace(/^hệ\s*/i, ""));
                  return (
                    <button className="card" key={`${p.zukan_id}-${p.zukan_sub_id}-${index}`} onClick={() => openPokemon(p)} aria-label={`Xem ${p.pokemon_name}`}>
                      <span className="card-no">#{String(numberOf(p)).padStart(4, "0")}</span>
                      <span className={`image-wrap tint-${typeIds[0]}`}><img loading="lazy" src={pokemonImage(p)} alt={p.pokemon_name} /></span>
                      <span className="card-content">
                        <strong>{p.pokemon_name}</strong>
                        {p.pokemon_sub_name && <small>{p.pokemon_sub_name}</small>}
                        <span className="badges">{typeIds.map((t, i) => <i className={t} key={t}>{typeNames[i]}</i>)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
          <section className="about" id="about">
            <p className="eyebrow"><span /> DỮ LIỆU CHÍNH THỨC</p>
            <h2>Một thế giới<br />để khám phá.</h2>
            <p>Tên, chỉ số và hình ảnh Pokémon được đồng bộ từ Cổng Pokémon chính thức tại Việt Nam.</p>
          </section>
        </>
      )}

      <footer>
        <div className="brand"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></div>
        <p>Dự án tra cứu dành cho người hâm mộ.</p>
        <p>Pokémon và tên Pokémon là thương hiệu của Nintendo / Creatures Inc. / GAME FREAK inc.</p>
      </footer>
    </main>
  );
}
