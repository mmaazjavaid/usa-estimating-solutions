/**
 * One-off cleanup: strip invisible characters (zero-width spaces, BOM, bidi marks, control chars)
 * from CMS slug/path fields that survived `String.prototype.trim()` at save time.
 *
 * These hidden chars make a page's stored path differ from its real URL, so the route 404s and the
 * sitemap emits a `%E2%80%8B`-style encoded URL. The app code now strips them on write; this script
 * repairs records created before that fix.
 *
 *   node scripts/fix-invisible-slugs.mjs           # dry run — report only, no writes
 *   node scripts/fix-invisible-slugs.mjs --apply    # apply the cleanup
 *
 * Reads MONGODB_URI from the environment, falling back to .env.local.
 */
import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const INVISIBLE = /[\p{Cc}\p{Cf}]/gu;
const APPLY = process.argv.includes('--apply');

function loadMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  try {
    const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
    const line = readFileSync(envPath, 'utf8')
      .split('\n')
      .find((l) => l.startsWith('MONGODB_URI'));
    if (line) return line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
  } catch {
    /* fall through */
  }
  throw new Error('MONGODB_URI not found in environment or .env.local');
}

// collection name -> fields to clean
const TARGETS = {
  pages: ['slug', 'path'],
  services: ['slug', 'path'],
  subservices: ['slug'],
  blogs: ['slug'],
};

async function run() {
  await mongoose.connect(loadMongoUri());
  const db = mongoose.connection.db;
  let totalDirty = 0;

  for (const [collName, fields] of Object.entries(TARGETS)) {
    const coll = db.collection(collName);
    const docs = await coll.find({}).toArray();

    for (const doc of docs) {
      const updates = {};
      for (const field of fields) {
        const val = doc[field];
        if (typeof val === 'string' && INVISIBLE.test(val)) {
          INVISIBLE.lastIndex = 0; // reset stateful global regex
          updates[field] = val.replace(INVISIBLE, '').trim();
        }
      }
      if (Object.keys(updates).length === 0) continue;

      totalDirty += 1;
      console.log(`\n[${collName}] _id=${doc._id}`);
      for (const [field, cleaned] of Object.entries(updates)) {
        console.log(`  ${field}: ${JSON.stringify(doc[field])}  ->  ${JSON.stringify(cleaned)}`);
      }

      if (APPLY) {
        await coll.updateOne({ _id: doc._id }, { $set: updates });
        console.log('  ✓ updated');
      }
    }
  }

  console.log(
    `\n${totalDirty} record(s) with invisible characters ${
      APPLY ? 'cleaned' : 'found (dry run — re-run with --apply to fix)'
    }.`,
  );
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
