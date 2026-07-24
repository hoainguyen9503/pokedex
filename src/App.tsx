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

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("asc");
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokemon.json`)
      .then((r) => r.json())
      .then((data) => setPokemons(data.pokemons))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    const list = pokemons.filter((p) => {
      const matchesQuery =
        !normalized ||
        p.pokemon_name.toLocaleLowerCase().includes(normalized) ||
        p.pokemon_sub_name.toLocaleLowerCase().includes(normalized) ||
        String(numberOf(p)).includes(normalized);
      const matchesType =
        type === "all" || p.pokemon_type_id.split(",").includes(type);
      return matchesQuery && matchesType;
    });
    return list.sort((a, b) => {
      if (sort === "weight") return b.weight - a.weight;
      if (sort === "height") return b.height - a.height;
      return sort === "desc" ? numberOf(b) - numberOf(a) : numberOf(a) - numberOf(b);
    });
  }, [pokemons, query, type, sort]);

  const reset = () => {
    setQuery("");
    setType("all");
    setSort("asc");
  };

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

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> THẾ GIỚI POKÉMON</p>
          <h1>Khám phá mọi<br /><em>Pokémon.</em></h1>
          <p className="intro">
            Tra cứu toàn bộ Pokédex — từ những người bạn đầu tiên tại Kanto
            đến các Pokémon mới nhất ở Paldea.
          </p>
          <div className="stats">
            <div><strong>1.025</strong><span>Pokémon</span></div>
            <div><strong>18</strong><span>Hệ</span></div>
            <div><strong>9</strong><span>Vùng đất</span></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="hero-number">025</span>
          <img src={`${SOURCE}/img/pm/2b3f6ff00db7a1efae21d85cfb8995eaff2da8d8.png`} alt="" />
          <span className="spark spark-one">✦</span>
          <span className="spark spark-two">✦</span>
        </div>
      </section>

      <section className="catalog" id="collection">
        <div className="catalog-head">
          <div>
            <p className="eyebrow"><span /> TỪ ĐIỂN QUỐC GIA</p>
            <h2>Tất cả Pokémon</h2>
          </div>
          <p className="result-count"><strong>{filtered.length}</strong> kết quả</p>
        </div>

        <div className="toolbar">
          <label className="search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc số..."
              aria-label="Tìm Pokémon"
            />
            <kbd>⌘ K</kbd>
          </label>
          <label className="sort">
            <span>Sắp xếp</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="asc">Số thấp → cao</option>
              <option value="desc">Số cao → thấp</option>
              <option value="weight">Nặng nhất</option>
              <option value="height">Cao nhất</option>
            </select>
          </label>
        </div>

        <div className="types" aria-label="Lọc theo hệ">
          {TYPES.map((item) => (
            <button
              key={item}
              className={`${item} ${type === item ? "selected" : ""}`}
              onClick={() => setType(item)}
            >
              {TYPE_LABELS[item]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty">Đang mở Pokédex…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <strong>Không tìm thấy Pokémon.</strong>
            <button onClick={reset}>Xóa bộ lọc</button>
          </div>
        ) : (
          <>
            <div className="grid">
              {filtered.map((p, index) => {
                const typeIds = p.pokemon_type_id.split(",");
                const typeNames = p.pokemon_type_name.split(",").map((x) => x.replace(/^hệ\s*/i, ""));
                return (
                  <button
                    className="card"
                    key={`${p.zukan_id}-${p.zukan_sub_id}-${index}`}
                    onClick={() => setSelected(p)}
                    aria-label={`Xem ${p.pokemon_name}`}
                  >
                    <span className="card-no">#{String(numberOf(p)).padStart(4, "0")}</span>
                    <span className={`image-wrap tint-${typeIds[0]}`}>
                      <img loading="lazy" src={`${SOURCE}${p.file_name}`} alt={p.pokemon_name} />
                    </span>
                    <span className="card-content">
                      <strong>{p.pokemon_name}</strong>
                      {p.pokemon_sub_name && <small>{p.pokemon_sub_name}</small>}
                      <span className="badges">
                        {typeIds.map((t, i) => <i className={t} key={t}>{typeNames[i]}</i>)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className="about" id="about">
        <p className="eyebrow"><span /> DỮ LIỆU CHÍNH THỨC</p>
        <h2>Một thế giới<br />để khám phá.</h2>
        <p>Tên, chỉ số và hình ảnh Pokémon được đồng bộ từ Cổng Pokémon chính thức tại Việt Nam.</p>
      </section>

      <footer>
        <div className="brand"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></div>
        <p>Dự án tra cứu dành cho người hâm mộ.</p>
        <p>Pokémon và tên Pokémon là thương hiệu của Nintendo / Creatures Inc. / GAME FREAK inc.</p>
      </footer>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)} role="presentation">
          <article className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={selected.pokemon_name}>
            <button className="close" onClick={() => setSelected(null)} aria-label="Đóng">×</button>
            <div className={`modal-art tint-${selected.pokemon_type_id.split(",")[0]}`}>
              <span>{String(numberOf(selected)).padStart(4, "0")}</span>
              <img src={`${SOURCE}${selected.file_name}`} alt={selected.pokemon_name} />
            </div>
            <div className="modal-info">
              <p className="eyebrow"><span /> {generationOf(numberOf(selected))}</p>
              <p className="modal-no">POKÉDEX #{String(numberOf(selected)).padStart(4, "0")}</p>
              <h2>{selected.pokemon_name}</h2>
              {selected.pokemon_sub_name && <p className="subname">{selected.pokemon_sub_name}</p>}
              <div className="badges large">
                {selected.pokemon_type_id.split(",").map((t) => <i className={t} key={t}>{TYPE_LABELS[t]}</i>)}
              </div>
              <div className="measurements">
                <div><span>CHIỀU CAO</span><strong>{selected.height} m</strong></div>
                <div><span>CÂN NẶNG</span><strong>{selected.weight} kg</strong></div>
              </div>
              <a href={`https://vn.portal-pokemon.com/play/pokedex/${numberOf(selected)}`} target="_blank" rel="noreferrer">
                Xem hồ sơ chính thức ↗
              </a>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
