import "server-only";
import puppeteer, { type Browser } from "puppeteer-core";

/**
 * Launch a headless browser across environments:
 *  - BROWSERLESS_URL set      -> connect to a managed browser (WS endpoint)
 *  - CHROME_EXECUTABLE_PATH   -> local Chrome/Chromium (dev on macOS)
 *  - otherwise                -> @sparticuz/chromium (Linux serverless / Vercel)
 */
async function launch(): Promise<Browser> {
  const ws = process.env.BROWSERLESS_URL;
  if (ws) return puppeteer.connect({ browserWSEndpoint: ws });

  // A local Chrome path is only valid off-platform (dev). On Vercel always use
  // @sparticuz/chromium, even if a stray CHROME_EXECUTABLE_PATH leaked into env.
  const localPath = process.env.CHROME_EXECUTABLE_PATH;
  if (localPath && !process.env.VERCEL) {
    return puppeteer.launch({
      executablePath: localPath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  const chromium = (await import("@sparticuz/chromium")).default;
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

/**
 * Render a server-rendered HTML page (e.g. /print/[id]?token=…) to a PDF Buffer.
 * Chromium fetches the page itself, so CSS + images resolve exactly as on screen.
 */
export async function renderUrlToPdf(url: string): Promise<Buffer> {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 45_000 });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close().catch(() => {});
  }
}
