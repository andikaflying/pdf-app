import { NextResponse } from "next/server";

import puppeteer from "puppeteer-core";
import fs from "fs";
import { Readable } from "stream";

const TOKEN = "S7eonO0agJurKn81a5848c8efa4c469a377f123428";

async function generatePDF(url: string): Promise<Readable> {
  let browser = null;

  try {
    const launchArgs = JSON.stringify({
      args: [`--window-size=1920,1080`],
      headless: false,
      stealth: true,
      timeout: 30000,
    });

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io/?token=${TOKEN}&launch=${launchArgs}`,
    });

    const page = await browser.newPage();

    page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent("My Custom User Agent/1.0");
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "load" });

    await page.waitForSelector("body");
    console.log("Page fully loaded. Taking screenshot...");
    await page.screenshot({ path: "site.png" });
    console.log(`Screenshot saved.`);

    // Use Puppeteer's `pdf` method with a custom stream
    const pdfStream = new Readable({
      read() {
        // Puppeteer will write chunks of the PDF to this stream
      },
    });

    const pdfBuffer = await page.pdf({ format: "A4" });
    pdfStream.push(pdfBuffer);
    pdfStream.push(null); // Signal the end of the stream

    console.log("PDF generation successful.");
    return pdfStream;
  } catch (error) {
    console.error("An error occurred during PDF generation:", error.message);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      try {
        console.log("Closing browser...");
        await browser.close();
      } catch (closeError) {
        console.error("Error while closing browser:", closeError.message);
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
  } catch (error) {
    console.error("Error in POST API:", error.message);
    return NextResponse.json(
      { error: "Failed to generate and download PDF" },
      { status: 400 }
    );
  }
}

// export async function GET() {
//   try {
//     const url = "https://wise.com"; // Replace with the default URL for PDF generation

//     console.log("Starting PDF generation for URL:", url);
//     const pdfBuffer = await generatePDF(url);

//     console.log("Sending PDF file to client...");
//     return new NextResponse(pdfBuffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=generated.pdf",
//       },
//     });
//   } catch (error) {
//     console.error("Error in GET API:", error.message);
//     return NextResponse.json(
//       { error: "Failed to generate and download PDF" },
//       { status: 400 }
//     );
//   }
// }
