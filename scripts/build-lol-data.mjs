import { mkdir, writeFile } from "node:fs/promises";

const CDN = "https://ddragon.leagueoflegends.com";
const versions = await fetch(`${CDN}/api/versions.json`).then((response) => response.json());
const version = versions[0];
const locale = "vi_VN";
const championList = await fetch(`${CDN}/cdn/${version}/data/${locale}/champion.json`)
  .then((response) => response.json());

const champions = await Promise.all(
  Object.keys(championList.data).map(async (championKey) => {
    const payload = await fetch(`${CDN}/cdn/${version}/data/${locale}/champion/${championKey}.json`)
      .then((response) => response.json());
    const champion = payload.data[championKey];

    return {
      id: champion.id,
      key: Number(champion.key),
      name: champion.name,
      title: champion.title,
      lore: champion.lore,
      tags: champion.tags,
      partype: champion.partype,
      stats: champion.stats,
      skins: champion.skins
        .filter((skin) => !skin.parentSkin)
        .map((skin) => ({
          id: String(skin.id),
          num: skin.num,
          name: skin.name === "default" ? champion.name : skin.name,
          chromas: skin.chromas,
        })),
    };
  }),
);

champions.sort((a, b) => a.name.localeCompare(b.name, "vi"));
const skins = champions.flatMap((champion) =>
  champion.skins.map((skin) => ({
    ...skin,
    championId: champion.id,
    championKey: champion.key,
    championName: champion.name,
    championTitle: champion.title,
    tags: champion.tags,
  })),
);

await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../public/data/lol-skins.json", import.meta.url),
  JSON.stringify({ version, locale, generatedAt: new Date().toISOString(), champions, skins }),
);

console.log(`Created ${skins.length} skin characters from ${champions.length} champions (Data Dragon ${version}).`);
