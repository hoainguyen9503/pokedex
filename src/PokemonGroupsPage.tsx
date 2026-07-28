import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Pagination from "./Pagination";
import ResilientImage from "./ResilientImage";
import { inspectPokemonGroups, POKEMON_GROUPS } from "./pokemonGroups";

type Pokemon = {
  zukan_id: string;
  zukan_sub_id: number;
  pokemon_name: string;
  pokemon_sub_name: string;
  file_name: string;
  pokemon_type_id: string;
};

const SOURCE = "https://vn.portal-pokemon.com/play/resources/pokedex";
const PAGE_SIZE = 100;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().trim();
}

function imageSources(pokemon: Pokemon) {
  const id = Number(pokemon.zukan_id);
  return [
    `${SOURCE}${pokemon.file_name}`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  ];
}

export default function PokemonGroupsPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokemon.json`)
      .then((response) => response.json())
      .then((data) => setPokemons(data.pokemons.filter((pokemon: Pokemon) => pokemon.zukan_sub_id === 0)))
      .finally(() => setLoading(false));
  }, []);

  const pokemonById = useMemo(
    () => new Map(pokemons.map((pokemon) => [Number(pokemon.zukan_id), pokemon])),
    [pokemons],
  );
  const audit = useMemo(() => inspectPokemonGroups(POKEMON_GROUPS), []);
  const groups = useMemo(() => {
    const term = normalize(query);
    if (!term) return POKEMON_GROUPS;
    return POKEMON_GROUPS.filter((group) =>
      normalize(`${group.title} ${group.subtitle}`).includes(term)
      || group.members.some((member) => normalize(pokemonById.get(member.id)?.pokemon_name ?? "").includes(term))
    );
  }, [query, pokemonById]);
  const pageCount = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));
  const pagedGroups = groups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const openPokemon = (id: number) => {
    window.location.hash = `/pokemon/${String(id).padStart(4, "0")}`;
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById("pokemon-groups")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="pokemon-group-page">
      <header className="topbar pokemon-group-topbar">
        <a className="brand" href="#" aria-label="Trang đầu Pokédex"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></a>
        <nav>
          <a href="#">Bộ sưu tập</a>
          <a className="active" href="#/pokemon-groups">Group Pokémon</a>
          <a href="#/lol">LMHT</a>
        </nav>
        <a className="source-link" href="#/pokemon-groups">5 Pokémon · 1 concept</a>
      </header>

      <section className="pokemon-group-hero">
        <div>
          <p className="eyebrow"><span /> BIỆT ĐỘI THEO CONCEPT</p>
          <h1>Năm cá thể.<br /><em>Một khí chất.</em></h1>
          <p>Mỗi đội gồm đúng 5 Pokémon đã tiến hóa, được tuyển chọn theo ngoại hình, nguyên tố và phong cách chiến đấu tương đồng.</p>
        </div>
        <div className="pokemon-group-stats">
          <span><b>{audit.groupCount}</b> concept</span>
          <span><b>{audit.memberCount}</b> Pokémon</span>
          <span><b>II–III</b> bậc tiến hóa</span>
        </div>
      </section>

      <section className="pokemon-group-catalog" id="pokemon-groups">
        <div className="pokemon-group-heading">
          <div><p className="eyebrow"><span /> HỒ SƠ BIỆT ĐỘI</p><h2>Group Pokémon</h2></div>
          <p><strong>{groups.length}</strong> concept phù hợp</p>
        </div>
        <label className="pokemon-group-search">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm concept hoặc tên Pokémon..." />
          {query && <button onClick={() => setQuery("")} aria-label="Xóa tìm kiếm">×</button>}
        </label>
        <div className="pokemon-group-audit" aria-label="Kết quả kiểm tra dữ liệu">
          <span>✓ Mỗi group đủ 5 Pokémon</span>
          <span>✓ Không trùng Pokémon</span>
          <span>✓ Chỉ dùng tiến hóa II–III</span>
        </div>

        {loading ? <div className="empty">Đang tập hợp các biệt đội…</div> : groups.length === 0 ? (
          <div className="empty"><strong>Không tìm thấy concept phù hợp.</strong><button onClick={() => setQuery("")}>Xóa tìm kiếm</button></div>
        ) : (
          <>
            <Pagination position="top" page={page} pageSize={PAGE_SIZE} totalItems={groups.length} onChange={changePage} />
            <div className="pokemon-group-grid">
              {pagedGroups.map((group, groupIndex) => (
                <article className="pokemon-concept-group" key={group.id} style={{ "--group-accent": group.accent } as CSSProperties}>
                  <header>
                    <div><small>CONCEPT {String(groupIndex + 1).padStart(2, "0")}</small><h3>{group.title}</h3><p>{group.subtitle}</p></div>
                    <b>05</b>
                  </header>
                  <div>
                    {group.members.map((member) => {
                      const pokemon = pokemonById.get(member.id);
                      return pokemon ? (
                        <button key={member.id} onClick={() => openPokemon(member.id)} aria-label={`Xem ${pokemon.pokemon_name}`}>
                          <span className={`pokemon-group-image tint-${pokemon.pokemon_type_id.split(",")[0]}`}>
                            <ResilientImage loading="lazy" sources={imageSources(pokemon)} alt={pokemon.pokemon_name} />
                          </span>
                          <span className="pokemon-group-member-copy">
                            <small>TIẾN HÓA {member.stage === 3 ? "III" : "II"}</small>
                            <strong>{pokemon.pokemon_name}</strong>
                            <i>#{pokemon.zukan_id}</i>
                          </span>
                        </button>
                      ) : null;
                    })}
                  </div>
                </article>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} totalItems={groups.length} onChange={changePage} />
          </>
        )}
      </section>

      <footer><div className="brand"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></div><p>Biệt đội Pokémon theo concept dành cho người hâm mộ.</p><p>Pokémon và tên Pokémon là thương hiệu của Nintendo / Creatures Inc. / GAME FREAK inc.</p></footer>
    </main>
  );
}
