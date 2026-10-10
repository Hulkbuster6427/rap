const fs = require('fs');
const path = require('path');

async function testUrl(url, headers = {}) {
  try {
    const res = await fetch(url, { headers });
    return { ok: res.ok, status: res.status, len: res.headers.get('content-length'), type: res.headers.get('content-type') };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  // Let's test YT on Bandcamp / YouTube / Spotify
  console.log("Checking YT, Slayr, Sinn6r, T3, Preservation...");
  
  // Preservation
  const presUrls = [
    "https://f4.bcbits.com/img/a2862854341_10.jpg",
    "https://e.snmc.io/i/600/s/57163f92ba321b02dd1ffca235882cbb/8254427/preservation-eastern-medicine-western-illness-Cover-Art.jpg"
  ];
  for (const u of presUrls) {
    console.log("Pres:", u, await testUrl(u));
  }
}

main();
