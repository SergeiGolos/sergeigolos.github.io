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
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import puppeteer from "puppeteer";

const require = createRequire(import.meta.url);
const theme = require("jsonresume-theme-relaxed");

const resume = JSON.parse(readFileSync(new URL("../resume.json", import.meta.url), "utf-8"));
const html = theme.render(resume);

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
try {
  const page = await browser.newPage();
  if (theme.pdfViewport) {
    await page.setViewport(theme.pdfViewport);
  }
  await page.setContent(html, { waitUntil: "networkidle0" });
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
