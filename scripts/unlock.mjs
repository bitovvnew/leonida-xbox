import { readFileSync, writeFileSync } from 'node:fs';
import { createDecipheriv } from 'node:crypto';

const key = Buffer.from(process.env.LEONIDA_KEY || '', 'hex');
if (key.length !== 32) { console.error('LEONIDA_KEY missing'); process.exit(1); }

const vault = JSON.parse(readFileSync('vault.json', 'utf8'));
const posts = JSON.parse(readFileSync('posts.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const have = new Set(posts.map(p => p.date));
let added = 0;

for (const e of vault) {
  if (e.d > today || have.has(e.d)) continue;
  const d = createDecipheriv('aes-256-gcm', key, Buffer.from(e.iv, 'base64'));
  d.setAuthTag(Buffer.from(e.tag, 'base64'));
  const pt = Buffer.concat([d.update(Buffer.from(e.ct, 'base64')), d.final()]).toString('utf8').trimEnd();
  posts.push(JSON.parse(pt));
  added++;
}

posts.sort((a, b) => (a.date < b.date ? -1 : 1));
writeFileSync('posts.json', JSON.stringify(posts, null, 1));
console.log(`unlocked ${added}, total ${posts.length}`);
