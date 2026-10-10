const fs = require('fs');

async function testMixmag() {
  const url = "https://mixmag.asia/feature/preservation-eastern-medicine-western-illness-hong-kong";
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (res.ok) {
    const html = await res.text();
    const imgs = [...html.matchAll(/https:\/\/[^"'\s>]+\.(jpg|jpeg|png|webp)/gi)].map(m => m[0]);
    console.log("Mixmag imgs:", imgs.slice(0, 5));
  } else {
    console.log("Status:", res.status);
  }
}

testMixmag();
