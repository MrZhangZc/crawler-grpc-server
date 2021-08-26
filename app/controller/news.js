const puppeteer = require('puppeteer');
const { resolve } = require('path')
const { getFileName, saveToQiNIu, deleteFile } = require('../../util/qiniu')
const URL = require('url')

const ScreenShot = async (call, callback) => {
  const { url, dataId } = call.request
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  const filename = getFileName()
  await page.screenshot({path: resolve(__dirname, `../../public/${filename}`)});
  await browser.close();
  const qnres = await saveToQiNIu(filename)
  if(qnres && qnres.key){
    callback(null, { data: qnres.key });
  }else {
    callback('qiniuerr');
  }
  const sql = 'update article set "screen_shot" = "screen_shot"||$1 where "id" = $2'
  const values = [`{${qnres.key}}`, dataId]
  await __pgQuery(sql, values)
  deleteFile(filename)
}

const GetHpNabNews = async (call, callback) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.goto('https://nba.hupu.com/');
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  const res = await page.$$eval('.list-item > a', eles => eles.map(ele => ({
    href: ele.href,
    title: ele.innerText,
    data_id: ele.getAttribute('data-tid'),
    type: 'nba',
    from: 'hupu'
  })))
  // await page.focus('.search-input')
  // await page.keyboard.sendCharacter(keyword)
  // await page.click('.search-icon')
  
  // page.on('load', async () => {
  //   await browser.close();
  await browser.close();
  let err = null
  callback(err, { data: 'success' });
  for(let news of res){
    const sql = 'INSERT INTO crawler("type", "title", "href", "data_id", "from") VALUES($1, $2, $3, $4, $5)'
    const values = [news.type, news.title, news.href, news.data_id, news.from]
    await __pgQuery(sql, values)
  }
}

const GetShNabNews = async (call, callback) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.goto('https://sports.sohu.com/s/nba/');
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  const res = await page.$$eval('li.item > a', eles => eles.map(ele => ({
    href: ele.href,
    title: ele.innerText,
    data_id: ele.href.slice(22, 38),
    type: 'nba',
    from: 'sh'
  })))
  await browser.close();
  let err = null
  callback(err, { data: 'success' });
  for(let news of res){
    const sql = 'INSERT INTO crawler("type", "title", "href", "data_id", "from") VALUES($1, $2, $3, $4, $5)'
    const values = [news.type, news.title, news.href, news.data_id, news.from]
    await __pgQuery(sql, values)
  }
}

const GetNbaWebNabNews = async (call, callback) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.goto('https://china.nba.com/news/');
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  const res = await page.$$eval('.news-wrap > a', eles => eles.map(ele => ({
    href: ele.href,
    title: ele.innerText,
    data_id: ele.href.slice(52, 66),
    type: 'nba',
    from: 'nba-web'
  })))
  await browser.close();
  let err = null
  callback(err, { data: 'success' });
  for(let news of res){
    const sql = 'INSERT INTO crawler("type", "title", "href", "data_id", "from") VALUES($1, $2, $3, $4, $5)'
    const values = [news.type, news.title, news.href, news.data_id, news.from]
    await __pgQuery(sql, values)
  }
}

module.exports = {
  ScreenShot,
  GetHpNabNews,
  GetShNabNews,
  GetNbaWebNabNews
}
