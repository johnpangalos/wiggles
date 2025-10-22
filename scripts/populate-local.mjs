#!/usr/bin/env zx
import 'zx/globals';
import { faker } from '@faker-js/faker';
import os from 'node:os';
import path from 'node:path';

$.verbose = true;

// Config (override via env if desired)
const ACCOUNTS = parseInt(process.env.ACCOUNTS ?? '5', 10);
const POSTS = parseInt(process.env.POSTS ?? '20', 10);
const BUCKET_NAME = process.env.R2_BUCKET ?? 'wiggles-images';
const DB_NAME = process.env.D1_NAME ?? 'wiggles';
const LOCAL_FLAG = process.env.LOCAL_FLAG ?? '--local';
const IMAGE_DIR = path.join(process.cwd(), '.tmp', 'populate', 'images');

await fs.mkdir(IMAGE_DIR, { recursive: true });

// Ensure migrations are applied locally (creates the DB locally if missing)
await $`corepack pnpm wrangler d1 migrations apply ${DB_NAME} ${LOCAL_FLAG}`;

// Generate accounts
const accounts = Array.from({ length: ACCOUNTS }, () => ({
  id: crypto.randomUUID(),
  display_name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  photo_url: faker.image.avatarGitHub(),
}));

// Helper to escape single quotes for SQL literals
const esc = (s) => String(s).replaceAll("'", "''");

// Generate posts and images
const posts = [];
const imageRecords = [];

for (let i = 0; i < POSTS; i++) {
  const acc = faker.helpers.arrayElement(accounts);
  const id = crypto.randomUUID();
  const w = faker.number.int({ min: 640, max: 1280 });
  const h = faker.number.int({ min: 480, max: 960 });
  const fmt = faker.helpers.arrayElement(['png', 'jpg']);
  const url = `https://placehold.co/${w}x${h}.${fmt}?text=${encodeURIComponent('Post ' + (i + 1))}`;
  const fileName = `${id}.${fmt}`;
  const filePath = path.join(IMAGE_DIR, fileName);
  const contentType = fmt === 'png' ? 'image/png' : 'image/jpeg';
  const imageId = `images/${fileName}`;

  // Download image
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buf);

  // Upload to R2 via wrangler CLI (CLI uses bucket name, not binding)
  // Docs syntax: `wrangler r2 object put <bucket>/<key> --file <path> [--content-type ...] [--local]`
  const bucketAndKey = `${BUCKET_NAME}/${imageId}`;
  await $`corepack pnpm wrangler r2 object put ${bucketAndKey} --file ${filePath} --content-type ${contentType} ${LOCAL_FLAG}`;

  // Create post record
  posts.push({
    id,
    content_type: contentType,
    timestamp: new Date(Date.now() - i * 60_000).toISOString(),
    account_id: acc.id,
    image_id: imageId,
  });

  imageRecords.push({ imageId, filePath, contentType });
}

// Build SQL
let sql = 'BEGIN TRANSACTION;\n';
if (accounts.length) {
  sql += `INSERT INTO accounts (id, display_name, email, photo_url) VALUES\n`;
  sql += accounts
    .map(
      (a) => `('${esc(a.id)}','${esc(a.display_name)}','${esc(a.email)}','${esc(a.photo_url)}')`
    )
    .join(',\n');
  sql += ';\n';
}
if (posts.length) {
  sql += `INSERT INTO posts (id, content_type, timestamp, account_id, image_id) VALUES\n`;
  sql += posts
    .map(
      (p) => `('${esc(p.id)}','${esc(p.content_type)}','${esc(p.timestamp)}','${esc(p.account_id)}','${esc(p.image_id)}')`
    )
    .join(',\n');
  sql += ';\n';
}
sql += 'COMMIT;\n';

// Write to temp SQL file and execute
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'populate-'));
const sqlFile = path.join(tmpDir, 'seed.sql');
await fs.writeFile(sqlFile, sql, 'utf8');

await $`corepack pnpm wrangler d1 execute ${DB_NAME} ${LOCAL_FLAG} --file ${sqlFile}`;

console.log('\n✅ Local data populated:');
console.log(`- Accounts: ${accounts.length}`);
console.log(`- Posts: ${posts.length}`);
console.log(`- R2 objects uploaded: ${imageRecords.length} to bucket ${BUCKET_NAME}`);
