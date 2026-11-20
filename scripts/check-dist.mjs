import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'dist');
const requiredPages = ['index.html', 'work.html', 'project.html', 'capabilities.html', 'about.html'];
const requiredAssets = ['.nojekyll', 'favicon.svg'];
const errors = [];
let checkedLinks = 0;

if (!fs.existsSync(root)) {
  console.error(`Build output directory not found: ${root}`);
  process.exit(1);
}

for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(root, asset))) {
    errors.push(`Missing required static asset: ${asset}`);
  }
}

for (const name of requiredPages) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required page: ${name}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${name}: missing <title>`);
  if (!html.includes('name="viewport"')) errors.push(`${name}: missing viewport meta`);
  if (!html.includes('name="description"')) errors.push(`${name}: missing description meta`);
  if (html.includes('<!-- SITE_HEADER -->') || html.includes('<!-- SITE_FOOTER -->')) {
    errors.push(`${name}: chrome placeholders were not injected`);
  }
  if (!html.includes('<header') || !html.includes('<footer')) {
    errors.push(`${name}: missing rendered <header> or <footer>`);
  }

  for (const [, rawUrl] of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(rawUrl)) continue;
    if (rawUrl.startsWith('/')) {
      errors.push(`${name}: root-relative path breaks GitHub Pages subpath hosting -> ${rawUrl}`);
      continue;
    }
    const target = rawUrl.split(/[?#]/)[0];
    if (!target) continue;
    checkedLinks += 1;
    const resolved = path.resolve(root, decodeURIComponent(target));
    if (!fs.existsSync(resolved)) {
      errors.push(`${name}: missing referenced file -> ${rawUrl}`);
    }
  }
}

const assetsDir = path.join(root, 'assets');
if (fs.existsSync(assetsDir)) {
  for (const file of fs.readdirSync(assetsDir)) {
    if (!file.endsWith('.css')) continue;
    const css = fs.readFileSync(path.join(assetsDir, file), 'utf8');
    if (/url\(["']?\/(?!\/)/.test(css)) {
      errors.push(`assets/${file}: root-relative url() detected in CSS`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Validated ${requiredPages.length} pages, header/footer injection, and ${checkedLinks} local asset/page references in ${root}.`
);
