const puppeteer = require('puppeteer');
const { resolve } = require('path')
const { getFileName, saveToQiNIu, deleteFile } = require('../../util/qiniu')

module.exports = {
  ScreenShot: async (call, callback) => {
    const { url } = call.request
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
    deleteFile(filename)
  },
  GetNabNews: async (call, callback) => {
    const { keyword } = call.request
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto('http://sports.sina.com.cn/nba/');
    await page.setViewport({
      width: 1920,
      height: 1080
    })
    await page.focus('.search-input')
    await page.keyboard.sendCharacter(keyword)
    await page.click('.search-icon')

    page.on('load', async () => {
      await browser.close();
    })
    let err = null
    callback(err, { data: 'Hello' + call.request.keyword });
  },
  GetContent: async (call, callback) => {
    err = null
    callback(err, { data: 'Hello' + call.request.keyword });
    const res = await __pgQuery('SELECT * FROM note WHERE "desc" = $1', ['晚上吃西瓜'])
    console.log(res.rows)
  }
}
