import React from 'react';
import {spy, expect} from 'chai';
import puppeteer from 'puppeteer';
const {Assertion} = require('chai');
const toMatchScreenshot = require('match-screenshot/chai');
Assertion.addMethod('toMatchScreenshot', toMatchScreenshot);

describe('Eyes layout tests', () => {

  let page;
  let browser;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(() => browser.close());

  it('Default layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Default');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Default layout'});
  });

  it('Collage layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Collage');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Collage layout'});
  });

  it('Masonry layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Masonry');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Masonry layout'});
  });

  it('Grid layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Grid');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Grid layout'});
  });

  it('Thumbnails layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Thumbnails');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Thumbnails layout'});
  });

  it('Slider layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Slider');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Slider layout'});
  });

  it('Slideshow layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Slideshow');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Slideshow layout'});
  });

  it('Strip layout', async () => {
    await page.goto('http://localhost:6006/?selectedKind=Eyes&selectedStory=Strip');
    const myScreenshot = await page.screenshot();
    await expect(myScreenshot).toMatchScreenshot({key: 'Strip layout'});
  });
});
