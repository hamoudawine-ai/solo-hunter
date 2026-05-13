import puppeteer from 'puppeteer';

async function scrapeOnlineFixDownloadLink(gameName) {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the site
    console.log('Navigating to online-fix.me...');
    await page.goto('https://online-fix.me/', { waitUntil: 'networkidle2' });

    // Handle potential pop-ups
    page.on('dialog', async dialog => {
      console.log('Dialog detected:', dialog.message());
      await dialog.dismiss(); // Dismiss pop-ups
    });

    // Wait for the page to load and find the search input
    await page.waitForSelector('input[placeholder="Поиск..."]', { timeout: 10000 });

    // Type the game name into the search box
    console.log(`Searching for "${gameName}"...`);
    await page.type('input[placeholder="Поиск..."]', gameName);

    // Submit the search
    await page.keyboard.press('Enter');

    // Wait for search results
    await page.waitForSelector('.search-results, .games-list, .item', { timeout: 10000 });

    // Find the correct game result (assuming it's the first or exact match)
    const gameLink = await page.evaluate((name) => {
      const links = Array.from(document.querySelectorAll('a[href*="/games/"]'));
      return links.find(link => link.textContent.toLowerCase().includes(name.toLowerCase()))?.href;
    }, gameName);

    if (!gameLink) {
      throw new Error(`Game "${gameName}" not found in search results.`);
    }

    console.log(`Found game page: ${gameLink}`);

    // Navigate to the game page
    await page.goto(gameLink, { waitUntil: 'networkidle2' });

    // Wait for the download link to appear
    await page.waitForSelector('a[href*="download"], .download-btn, .btn-download', { timeout: 10000 });

    // Extract the download link
    const downloadLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="download"], .download-btn, .btn-download');
      return link ? link.href : null;
    });

    if (!downloadLink) {
      throw new Error('Download link not found on the game page.');
    }

    console.log(`Download link extracted: ${downloadLink}`);
    return downloadLink;

  } catch (error) {
    console.error('Error during scraping:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

// Usage
const gameName = 'Elden Ring';
scrapeOnlineFixDownloadLink(gameName).then(link => {
  if (link) {
    console.log(`Final download link for ${gameName}: ${link}`);
  } else {
    console.log('Failed to extract download link.');
  }
});