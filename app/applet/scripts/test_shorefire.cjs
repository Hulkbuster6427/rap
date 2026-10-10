const fs = require('fs');

async function testShorefire() {
  const url = "https://shorefire.com/releases/entry/acclaimed-producer-preservation-announces-new-album-eastern-medicine-western-illness";
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (res.ok) {
    const html = await res.text();
    const imgs = html.match(/https:\/\/[^"'\s>]+\.(jpg|jpeg|png|webp)/gi);
    console.log("Shorefire imgs:", imgs?.slice(0, 5));
  } else {
    console.log("Status:", res.status);
  }
}

testShorefire();
