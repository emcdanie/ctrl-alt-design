// Prints the open CV dialog to public/cv/Elleta_McDaniel_Product_Designer_CV.pdf.
// The dialog is the single source (components/ResumeModal.tsx); @media print in
// app/globals.css strips everything but it. Needs a running site: CV_URL
// (default http://localhost:3000). Run: npm run build:cv
import { chromium } from "playwright";
import { writeFileSync, statSync, readFileSync } from "node:fs";

const base = process.env.CV_URL || "http://localhost:3000";
const out = "public/cv/Elleta_McDaniel_Product_Designer_CV.pdf";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
await page.goto(`${base}/about`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /view cv/i }).first().click();
await page.getByRole("dialog").waitFor();
// the address is never in the page's HTML or source (constitution section 6):
// copy it the way a visitor would, then write it into the print-only slot
await page.getByRole("dialog").getByRole("button", { name: /copy email/i }).click();
const email = await page.evaluate(() => navigator.clipboard.readText());
await page.locator("[data-cv-email-slot]").evaluate((el, v) => { el.textContent = v; }, email);
await page.emulateMedia({ media: "print" });
const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
writeFileSync(out, pdf);
await browser.close();
const pages = (readFileSync(out, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`${out}: ${(statSync(out).size / 1024).toFixed(0)} KB, ${pages} pages`);
