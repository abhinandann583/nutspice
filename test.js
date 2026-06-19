const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('file://' + __dirname + '/index.html', { waitUntil: 'networkidle0' });
  
  console.log('Clicking cart button...');
  await page.click('#cart-btn');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await browser.close();
})();
