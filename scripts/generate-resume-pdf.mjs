#!/usr/bin/env node
/**
 * Generate public/sergei-golos-resume.pdf from resume.json.
 *
 * Replaces the unmaintained resume-cli (engines: node >=12 <18, puppeteer 18),
 * which broke the CI build on modern Node. The relaxed theme is a plain
 * render function; we print its HTML to PDF with the current puppeteer.
 * The theme's own pdfViewport / pdfRenderOptions are honored so the output
 * matches what resume-cli produced.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import puppeteer from "puppeteer";

const require = createRequire(import.meta.url);
const theme = require("jsonresume-theme-relaxed");

const resume = JSON.parse(readFileSync(new URL("../resume.json", import.meta.url), "utf-8"));

// The theme references every icon (section titles, contact icons, profile
// brand icons) from public CDNs at print time. Whether they print depends on
// the build machine's network reaching those CDNs — in practice the
// simpleicons.org icons silently printed as broken images in CI while
// loading fine elsewhere. The icons are vendored under scripts/icons/ and
// inlined as data URIs, so the PDF no longer depends on any icon CDN.
const iconDir = new URL("./icons/", import.meta.url);
function iconDataUri(name) {
  const file = new URL(`${name}.svg`, iconDir);
  if (!existsSync(file)) return null;
  return `data:image/svg+xml;base64,${readFileSync(file).toString("base64")}`;
}
function swapIcon(html, pattern, name) {
  const uri = iconDataUri(name);
  return uri ? html.replace(pattern, `src="${uri}"`) : html;
}
function inlineIconImages(html) {
  let out = html;
  out = out.replace(
    /src="https:\/\/cdn\.statically\.io\/gh\/tailwindlabs\/heroicons\/[^"]*\/([a-z0-9-]+)\.svg"/g,
    (match, name) => {
      const uri = iconDataUri(name);
      return uri ? `src="${uri}"` : match;
    },
  );
  out = out.replace(/src="https:\/\/cdn\.simpleicons\.org\/([a-z0-9-]+)"/g, (match, name) => {
    const uri = iconDataUri(name);
    return uri ? `src="${uri}"` : match;
  });
  out = swapIcon(
    out,
    /src="https:\/\/upload\.wikimedia\.org\/[^"]*LinkedIn_icon\.svg"/g,
    "linkedin",
  );
  return out;
}

// The profile photo is also fetched from the live site at print time; inline
// it from public/ when the resume points at a same-site asset, so the PDF is
// fully self-contained.
function inlineProfileImage(html) {
  const image = resume.basics?.image;
  if (!image) return html;
  let pathname;
  try {
    pathname = new URL(image).pathname;
  } catch {
    return html;
  }
  const file = new URL(`../public${pathname}`, import.meta.url);
  if (!existsSync(file)) return html;
  const ext = pathname.split(".").at(-1).toLowerCase();
  const mime =
    ext === "webp" ? "image/webp" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  const uri = `data:${mime};base64,${readFileSync(file).toString("base64")}`;
  return html.split(`src="${image}"`).join(`src="${uri}"`);
}

// Style overrides on top of the theme: keyword "chips" (skills, interests)
// print as plain comma-separated text instead of teal pills.
const styleOverrides = `
  mark {
    color: inherit;
    background: none;
    border-radius: 0;
    display: inline;
    padding: 0;
    margin: 0;
  }
  .keywords > mark:not(:last-child)::after {
    content: ", ";
  }
`;

const html = inlineProfileImage(inlineIconImages(theme.render(resume)));

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
try {
  const page = await browser.newPage();
  if (theme.pdfViewport) {
    await page.setViewport(theme.pdfViewport);
  }
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.addStyleTag({ content: styleOverrides });
  const options = theme.pdfRenderOptions ?? { format: "A4" };
  if (options.mediaType) {
    await page.emulateMediaType(options.mediaType);
  }
  const { mediaType, ...pdfOptions } = options;
  const pdf = await page.pdf({ ...pdfOptions, printBackground: true });
  const out = new URL("../public/sergei-golos-resume.pdf", import.meta.url);
  writeFileSync(out, pdf);
  console.log(`Wrote ${out.pathname} (${pdf.length} bytes)`);
} finally {
  await browser.close();
}
