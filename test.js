import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  if (content.includes('CreatorOS Tool Suite') || content.includes('Welcome back')) {
    console.log("SUCCESS: Dashboard text found.");
  } else {
    console.log("FAILURE: Dashboard text not found.");
    console.log(content.substring(0, 1000));
  }
  
  await browser.close();
})();
