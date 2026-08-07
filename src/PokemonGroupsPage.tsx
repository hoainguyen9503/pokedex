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
const USED_GROUPS_KEY = "pokedex:used-pokemon-groups";

function readUsedGroups() {
  try {
    const value = JSON.parse(localStorage.getItem(USED_GROUPS_KEY) || "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().trim();
}

function imageSources(pokemon: Pokemon) {
  const id = Number(pokemon.zukan_id);
  const officialImage = `${SOURCE}${pokemon.file_name}`;
  if (pokemon.zukan_sub_id !== 0) return [officialImage];
  return [
    officialImage,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  ];
}

export default function PokemonGroupsPage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [usedGroupIds, setUsedGroupIds] = useState<string[]>(readUsedGroups);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/pokemon.json`)
      .then((response) => response.json())
      .then((data) => setPokemons(data.pokemons))
      .finally(() => setLoading(false));
  }, []);

  const pokemonByKey = useMemo(
    () => new Map(pokemons.map((pokemon) => [`${Number(pokemon.zukan_id)}-${pokemon.zukan_sub_id}`, pokemon])),
    [pokemons],
  );
  const audit = useMemo(() => inspectPokemonGroups(POKEMON_GROUPS), []);
  const groups = useMemo(() => {
    const term = normalize(query);
    if (!term) return POKEMON_GROUPS;
    return POKEMON_GROUPS.filter((group) =>
      normalize(`${group.title} ${group.subtitle}`).includes(term)
      || group.members.some((member) => {
        const pokemon = pokemonByKey.get(`${member.id}-${member.subId ?? 0}`);
        return normalize(`${pokemon?.pokemon_name ?? ""} ${pokemon?.pokemon_sub_name ?? ""}`).includes(term);
      })
    );
  }, [query, pokemonByKey]);
  const pageCount = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));
  const pagedGroups = groups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    localStorage.setItem(USED_GROUPS_KEY, JSON.stringify(usedGroupIds));
  }, [usedGroupIds]);

  const openPokemon = (id: number, subId = 0) => {
    window.location.hash = `/pokemon/${String(id).padStart(4, "0")}${subId ? `_${subId}` : ""}`;
  };
  const copyPokemonImage = async (pokemon: Pokemon) => {
    const sources = imageSources(pokemon);
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
        } catch { /* try the next source */ }
      }
    }
    try {
      await navigator.clipboard.writeText(sources[0]);
      setToast(`Đã sao chép đường dẫn ảnh ${pokemon.pokemon_name}`);
    } catch {
      setToast("Trình duyệt không cho phép truy cập clipboard");
    }
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.getElementById("pokemon-groups")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toggleGroupUsed = (groupId: string, title: string) => {
    const isUsed = usedGroupIds.includes(groupId);
    setUsedGroupIds((current) =>
      isUsed ? current.filter((id) => id !== groupId) : [...current, groupId]
    );
    setToast(isUsed ? `Đã bỏ đánh dấu ${title}` : `Đã đánh dấu đã sử dụng ${title}`);
  };

  return (
    <main className="pokemon-group-page">
      <header className="topbar pokemon-group-topbar">
        <a className="brand" href="#" aria-label="Trang đầu Pokédex"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></a>
        <nav>
          <a href="#">Bộ sưu tập</a>
          <a className="active" href="#/pokemon-groups">Group Pokémon</a>
        </nav>
        <a className="source-link" href="#/pokemon-groups">5 Pokémon · 1 concept</a>
      </header>

      <section className="pokemon-group-hero">
        <div>
          <p className="eyebrow"><span /> BIỆT ĐỘI THEO CONCEPT</p>
          <h1>Năm cá thể.<br /><em>Một khí chất.</em></h1>
          <p>Toàn bộ Pokémon đã tiến hóa cùng các dạng Mega, Gigamax, vùng miền và hình thái đặc biệt được chia thành đội 5 thành viên. Pokémon đa hệ có thể góp mặt trong nhiều concept phù hợp.</p>
        </div>
        <div className="pokemon-group-stats">
          <span><b>{audit.groupCount}</b> concept</span>
          <span><b>{audit.uniqueMemberCount}</b> Pokémon/form</span>
          <span><b>{audit.memberCount}</b> lượt xếp nhóm</span>
          <span><b>{audit.specialFormCount}</b> form đặc biệt</span>
        </div>
      </section>

      <section className="pokemon-group-catalog" id="pokemon-groups">
        <div className="pokemon-group-heading">
          <div><p className="eyebrow"><span /> HỒ SƠ BIỆT ĐỘI</p><h2>Group Pokémon</h2></div>
          <p><strong>{groups.length}</strong> concept phù hợp · <b>{usedGroupIds.length}</b> đã sử dụng</p>
        </div>
        <label className="pokemon-group-search">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm concept hoặc tên Pokémon..." />
          {query && <button onClick={() => setQuery("")} aria-label="Xóa tìm kiếm">×</button>}
        </label>
        <div className="pokemon-group-audit" aria-label="Kết quả kiểm tra dữ liệu">
          <span>✓ Mỗi group đủ 5 Pokémon</span>
          <span>✓ Pokémon đa hệ xuất hiện ở nhiều concept phù hợp</span>
          <span>✓ Bao phủ đủ {audit.uniqueMemberCount} Pokémon/form đạt tiêu chí</span>
          <span>✓ Bao gồm đủ {audit.specialFormCount} form đặc biệt</span>
        </div>

        {loading ? <div className="empty">Đang tập hợp các biệt đội…</div> : groups.length === 0 ? (
          <div className="empty"><strong>Không tìm thấy concept phù hợp.</strong><button onClick={() => setQuery("")}>Xóa tìm kiếm</button></div>
        ) : (
          <>
            <Pagination position="top" page={page} pageSize={PAGE_SIZE} totalItems={groups.length} onChange={changePage} />
            <div className="pokemon-group-grid">
              {pagedGroups.map((group, groupIndex) => {
                const isUsed = usedGroupIds.includes(group.id);
                return (
                <article className={`pokemon-concept-group ${isUsed ? "is-used" : ""}`} key={group.id} style={{ "--group-accent": group.accent } as CSSProperties}>
                  <header>
                    <div><small>CONCEPT {String((page - 1) * PAGE_SIZE + groupIndex + 1).padStart(3, "0")}</small><h3>{group.title}</h3><p>{group.subtitle}</p></div>
                    <div className="pokemon-group-header-actions">
                      <b>05</b>
                      <button
                        className="pokemon-group-used-toggle"
                        type="button"
                        aria-pressed={isUsed}
                        aria-label={`${isUsed ? "Bỏ đánh dấu" : "Đánh dấu"} đã sử dụng group ${group.title}`}
                        onClick={() => toggleGroupUsed(group.id, group.title)}
                      >
                        <span>{isUsed ? "✓" : "○"}</span>
                        {isUsed ? "ĐÃ SỬ DỤNG" : "ĐÁNH DẤU ĐÃ DÙNG"}
                      </button>
                    </div>
                  </header>
                  <div>
                    {group.members.map((member) => {
                      const pokemon = pokemonByKey.get(`${member.id}-${member.subId ?? 0}`);
                      return pokemon ? (
                        <article className="pokemon-group-member" key={`${member.id}-${member.subId ?? 0}`}>
                          <button className="pokemon-group-member-main" onClick={() => openPokemon(member.id, member.subId)} aria-label={`Xem ${pokemon.pokemon_name}`}>
                            <span className={`pokemon-group-image tint-${pokemon.pokemon_type_id.split(",")[0]}`}>
                              <ResilientImage loading="lazy" sources={imageSources(pokemon)} alt={pokemon.pokemon_name} />
                            </span>
                            <span className="pokemon-group-member-copy">
                              <small>{member.subId ? "FORM ĐẶC BIỆT" : `TIẾN HÓA ${member.stage === 3 ? "III" : "II"}`}</small>
                              <strong>{pokemon.pokemon_name}</strong>
                              <i>#{pokemon.zukan_id}{pokemon.pokemon_sub_name ? ` · ${pokemon.pokemon_sub_name}` : ""}</i>
                            </span>
                          </button>
                          <button className="pokemon-group-copy" onClick={() => copyPokemonImage(pokemon)} title={`Sao chép ảnh ${pokemon.pokemon_name}`} aria-label={`Sao chép ảnh ${pokemon.pokemon_name}`}>⧉</button>
                        </article>
                      ) : null;
                    })}
                  </div>
                </article>
                );
              })}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} totalItems={groups.length} onChange={changePage} />
          </>
        )}
      </section>

      <footer><div className="brand"><span className="brandball"><i /></span><span>POKÉDEX<span className="branddot">.</span></span></div><p>Biệt đội Pokémon theo concept dành cho người hâm mộ.</p><p>Pokémon và tên Pokémon là thương hiệu của Nintendo / Creatures Inc. / GAME FREAK inc.</p></footer>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
