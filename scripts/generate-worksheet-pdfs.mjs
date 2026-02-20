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

// Discover worksheet types dynamically from worksheets/types directory
async function discoverWorksheets() {
    const worksheetsDir = join(projectRoot, "worksheets", "types");
    const files = fs.readdirSync(worksheetsDir).filter(file => {
        return file.endsWith(".js") && file !== "utils.js" && file !== "index.js";
    });

    const worksheets = [];
    for (const file of files) {
        try {
            const modulePath = join(worksheetsDir, file);
            const module = await import(`file://${modulePath}`);
            const worksheet = module.default;

            if (worksheet && worksheet.id && worksheet.label) {
                worksheets.push({
                    id: worksheet.id,
                    name: worksheet.label
                });
            }
        } catch (error) {
            console.warn(`⚠️  Failed to import ${file}: ${error.message}`);
        }
    }

    // Sort by id for consistent output
    worksheets.sort((a, b) => a.id.localeCompare(b.id));
    return worksheets;
}

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

async function generatePDFs() {
    console.log("🚀 Starting PDF generation...\n");

    // Discover worksheets dynamically
    const WORKSHEET_TYPES = await discoverWorksheets();
    console.log(`📚 Discovered ${WORKSHEET_TYPES.length} worksheet types\n`);

    // Create examples directory if it doesn't exist
    const examplesDir = join(projectRoot, "examples");
    if (!existsSync(examplesDir)) {
        mkdirSync(examplesDir);
        console.log("📁 Created examples directory\n");
    }

    // Start local HTTP server
    const server = createServer();
    const PORT = 8765;
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`🌐 Started local server on http://localhost:${PORT}\n`);

    // Launch browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });

    // Navigate to the worksheet page
    const worksheetUrl = `http://localhost:${PORT}/worksheets/index.html`;

    console.log(`📄 Opening worksheet page: ${worksheetUrl}\n`);
    await page.goto(worksheetUrl, { waitUntil: "networkidle0" });

    // Wait for the page to be ready
    await page.waitForSelector("#problem-type");

    for (const worksheet of WORKSHEET_TYPES) {
        try {
            console.log(`📝 Generating ${worksheet.name}...`);

            // Clear previous content
            await page.evaluate(() => {
                const output = document.getElementById("worksheet-output");
                if (output) output.innerHTML = "";
            });

            // Select the worksheet type
            await page.select("#problem-type", worksheet.id);

            // Wait for dynamic options to load
            await page.waitForTimeout(300);

            // Set difficulty to normal
            await page.select("#difficulty", "normal");

            // Set number of problems to 20
            await page.evaluate(() => {
                document.getElementById("num-problems").value = "20";
            });

            // Click generate button
            await page.click("#generate-btn");

            // Wait for worksheet to be generated (wait for problems grid to appear)
            await page.waitForSelector(".problems-grid", { timeout: 5000 });
            // Wait for KaTeX to render all math
            await page.waitForTimeout(1500);

            // Show answer key
            await page.evaluate(() => {
                const answersDiv = document.querySelector(".answers");
                if (answersDiv) {
                    answersDiv.style.display = "block";
                }
            });

            // Wait for answer key to render
            await page.waitForTimeout(500);

            // Generate PDF
            const pdfPath = join(
                examplesDir,
                `${worksheet.id.replace(/\//g, "-")}.pdf`,
            );

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

            console.log(`   ✅ Saved to examples/${worksheet.id}.pdf`);
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
        }
    }

    await browser.close();
    server.close();
    console.log("\n✨ All PDFs generated successfully!");
    console.log(`📂 Check the examples/ folder for all worksheet PDFs`);
}

generatePDFs().catch((error) => {
    console.error("Error generating PDFs:", error);
    process.exit(1);
});
