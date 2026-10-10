const fs = require('fs');

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|size&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SubcultureDispatch/1.0 (contact@subculture.dispatch)' } });
    const data = await res.json();
    if (!data.query?.pages) return [];
    return Object.values(data.query.pages).map(p => ({
      title: p.title,
      url: p.imageinfo?.[0]?.url,
      width: p.imageinfo?.[0]?.width,
      height: p.imageinfo?.[0]?.height
    }));
  } catch (e) {
    return [];
  }
}

async function searchWiki(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=pageimages|info&pithumbsize=1000&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'SubcultureDispatch/1.0 (contact@subculture.dispatch)' } });
    const data = await res.json();
    if (!data.query?.pages) return [];
    return Object.values(data.query.pages).map(p => ({
      title: p.title,
      thumbnail: p.thumbnail?.source
    }));
  } catch (e) {
    return [];
  }
}

async function main() {
  const queries = [
    "Lil Keed",
    "Nemzzz",
    "Jim Legxacy",
    "Tha God Fahim",
    "Preservation producer",
    "SahBabii T3",
    "Lancey Foux Conglomerate"
  ];

  for (const q of queries) {
    console.log(`\n=== QUERY: ${q} ===`);
    const wiki = await searchWiki(q);
    console.log("Wiki:", JSON.stringify(wiki, null, 2));
    const commons = await searchCommons(q);
    console.log("Commons:", JSON.stringify(commons, null, 2));
  }
}

main();
