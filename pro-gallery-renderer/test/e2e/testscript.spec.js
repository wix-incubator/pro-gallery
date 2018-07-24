// import puppeteer from 'puppeteer';
// import GalleryDriver from '../drivers/pupDriver';
// import {use, spy, expect, chai} from 'chai';
// import sinon from 'sinon';
// import chaiEnzyme from 'chai-enzyme';

// //const puppeteer = require('puppeteer');

// let browser;
// let page;

// beforeEach(async () => {
//   browser = await puppeteer.launch({
//     slowMo: 70,
//     //devtools: true,
//     headless: false,
//     args: ['--no-sandbox']});
//   page = await browser.newPage();
//   //await page.tracing.start({path: 'trace.json'});
// });

// describe.skip('Walmart shopping cart', () => {
//   it('shows the correct product', async () => {
//     await page.setViewport({width: 1280, height: 800});
//     await page.goto('https://www.walmart.com/ip/Super-Mario-Odyssey-Nintendo-Switch/56011600', {waitUntil: 'networkidle2'});
//     const productTitle = await page.evaluate(() => document.querySelector('h1.prod-ProductTitle').textContent);
//     expect(productTitle).toBe('Super Mario Odyssey (Nintendo Switch)');
//   }, 20000);

//   afterEach(async () => {
//     //await page.tracing.stop();
//     await browser.close();
//   });
// })
// ;
