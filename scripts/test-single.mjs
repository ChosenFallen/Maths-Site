import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync, existsSync } from "fs";
import http from "http";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Simple HTTP server to serve files
function createServer() {
    const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
    };

    const server = http.createServer((req, res) => {
        let filePath = path.join(
            projectRoot,
            req.url === "/" ? "index.html" : req.url,
        );

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || "application/octet-stream";

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == "ENOENT") {
                    res.writeHead(404);
                    res.end("404 Not Found");
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content, "utf-8");
            }
        });
    });

    return server;
}

async function testPDF() {
    const worksheetId = process.argv[2] || "equivalent-fractions";
    console.log(`🧪 Generating ${worksheetId} worksheet...\n`);

    const examplesDir = join(projectRoot, "examples");
    if (!existsSync(examplesDir)) {
        mkdirSync(examplesDir);
    }

    const server = createServer();
    const PORT = 8767;
    await new Promise((resolve) => server.listen(PORT, resolve));

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });

    const worksheetUrl = `http://localhost:${PORT}/worksheets/index.html`;
    await page.goto(worksheetUrl, { waitUntil: "networkidle0" });
    await page.waitForSelector("#problem-type");

    await page.select("#problem-type", worksheetId);
    await page.waitForTimeout(100);
    await page.select("#difficulty", "normal");
    await page.evaluate(() => {
        document.getElementById("num-problems").value = "20";
    });

    await page.click("#generate-btn");
    await page.waitForSelector(".problems-grid", { timeout: 5000 });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
        const answersDiv = document.querySelector(".answers");
        if (answersDiv) {
            answersDiv.style.display = "block";
        }
    });

    await page.waitForTimeout(500);

    const pdfPath = join(examplesDir, `${worksheetId}.pdf`);
    await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
        },
    });

    console.log(`✅ PDF saved to examples/${worksheetId}.pdf`);

    await browser.close();
    server.close();
}

testPDF().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
