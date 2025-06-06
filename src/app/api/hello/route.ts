import { NextResponse } from "next/server";

import puppeteer, { Page } from "puppeteer-core";

const TOKEN = process.env.SERVERLESS_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const waitForDOMToSettle = (page: Page, timeoutMs = 30000, debounceMs = 1000) =>
  page.evaluate(
    (timeoutMs, debounceMs) => {
      interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
        (...args: Parameters<T>): void;
      }

      const debounce = <T extends (...args: unknown[]) => unknown>(
        func: T,
        ms: number = 1000
      ): DebouncedFunction<T> => {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>): void => {
          console.log("in debounce, clearing timeout again");
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(this, args);
          }, ms);
        };
      };
      return new Promise<void>((resolve, reject) => {
        const mainTimeout = setTimeout(() => {
          observer.disconnect();
          reject(new Error("Timed out whilst waiting for DOM to settle"));
        }, timeoutMs);

        const debouncedResolve = debounce(async () => {
          observer.disconnect();
          clearTimeout(mainTimeout);
          resolve();
        }, debounceMs);

        const observer = new MutationObserver(() => {
          debouncedResolve();
        });
        const config = {
          attributes: true,
          childList: true,
          subtree: true,
        };
        observer.observe(document.body, config);
      });
    },
    timeoutMs,
    debounceMs
  );

async function generatePDF(url: string): Promise<Uint8Array<ArrayBufferLike>> {
  let browser = null;

  try {
    const launchArgs = JSON.stringify({
      args: [`--window-size=1920,1080`],
      headless: false,
      stealth: true,
    });

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io/?token=${TOKEN}&launch=${launchArgs}`,
    });

    const page = await browser.newPage();

    page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent("My Custom User Agent/1.0");
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // await waitForDOMToSettle(page);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    console.log("PDF generated successfully!");

    return pdfBuffer;
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error.toUpperCase();
    }

    console.error("An error occurred during PDF generation:", message);
    throw new Error(message);
  } finally {
    if (browser) {
      try {
        console.log("Closing browser...");
        await browser.close();
      } catch (closeError: unknown) {
        let message = "";
        if (closeError instanceof Error) {
          message = closeError.message;
        } else if (typeof closeError === "string") {
          message = closeError.toUpperCase();
        }
        console.error("Error while closing browser:", message);
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing 'url' in request body" },
        { status: 400 }
      );
    }

    console.log("Starting PDF generation for URL:", url);
    const pdfStream = await generatePDF(url);

    console.log("Streaming PDF file to client...");
    return new NextResponse(pdfStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=site.pdf",
      },
    });
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error.toUpperCase();
    }

    return NextResponse.json(
      { error: message || "Failed to generated PDF" },
      { status: 400 }
    );
  }
}
