const puppeteer = require('puppeteer');
const path = require('path');

async function generatePdf(data) {
    const htmlContent = `
        <html>
        <head>
            <title>Proposal Agreement</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { color: #333; }
                p { font-size: 14px; }
            </style>
        </head>
        <body>
            <h1>Proposal Agreement</h1>
            <p>Customer Name: ${data.customerName}</p>
            <p>Proposal Details: ${data.proposalDetails}</p>
            <p>Amount: $${data.amount}</p>
        </body>
        </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
    // Save PDF to a temporary path
    const pdfPath = path.join(__dirname, `proposal_${Date.now()}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();
    return pdfPath;
}

module.exports = generatePdf;
