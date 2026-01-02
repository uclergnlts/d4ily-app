import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function testScraping() {
    console.log("Starting Official Gazette scrape test...");
    const url = 'https://www.resmigazete.gov.tr/';

    try {
        const response = await fetch(url);
        console.log("Status:", response.status);
        if (!response.ok) throw new Error("Failed to fetch");

        const html = await response.text();
        console.log("HTML Length:", html.length);

        fs.writeFileSync('gazette_dump.html', html); // Save HTML for review

        const $ = cheerio.load(html);
        let output = "Debug Output:\n";

        // Extract content - structure is flattened but ordered in #html-content
        const contentDiv = $('#html-content');

        if (contentDiv.length > 0) {
            output += "FOUND #html-content\n";
            contentDiv.children().each((_, el) => {
                const $el = $(el);
                const text = $el.text().trim();
                // if (!text) return; // Allow empty lines?

                if ($el.hasClass('html-title')) {
                    output += `\n[TITLE] ${text}\n`;
                } else if ($el.hasClass('html-subtitle')) {
                    output += `[SUBTITLE] ${text}\n`;
                } else if ($el.hasClass('fihrist-item')) {
                    const link = $el.find('a').attr('href');
                    output += `[ITEM] ${text} -> ${link}\n`;
                }
            });
        } else {
            output += "WARNING: #html-content NOT FOUND\n";
        }

        fs.writeFileSync('debug_gazette_output.txt', output);
        console.log("Debug info written to debug_gazette_output.txt");

    } catch (error) {
        console.error("Error:", error);
    }
}

testScraping();
