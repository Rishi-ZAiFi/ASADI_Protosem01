import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // Find a tool and click it
  console.log('Navigating to content-idea-generator...');
  await page.evaluate(() => {
    window.location.hash = '#content-idea-generator';
  });
  
  // Wait for the page to update
  await new Promise(r => setTimeout(r, 1000));
  
  let content = await page.content();
  if (content.includes('Content Idea Generator')) {
    console.log('SUCCESS: Tool page loaded.');
  } else {
    console.log('FAILURE: Tool page did not load.');
  }

  // Find and click the generate button
  console.log('Clicking Generate button...');
  const buttons = await page.$$('button');
  let generateClicked = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Generate') && !text.includes('Retry')) {
      await btn.click();
      generateClicked = true;
      break;
    }
  }

  if (generateClicked) {
    console.log('Clicked Generate button, waiting for response or error...');
    await new Promise(r => setTimeout(r, 2000));
  } else {
    console.log('Could not find Generate button');
  }

  await browser.close();
})();
