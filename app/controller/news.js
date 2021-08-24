const puppeteer = require('puppeteer');
const { resolve } = require('path')
const { getFileName, saveToQiNIu, deleteFile } = require('../../util/qiniu')

module.exports = {
  ScreenShot: async (call, callback) => {
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
    // update article set "screen_shot" = "screen_shot"||'{今晚吃西瓜}'
    const res = await __pgQuery('update article set "screen_shot" = "screen_shot"||$1 where "id" = $2' , ['{晚上吃西瓜}', '712958ef-b25c-410e-969a-a69a7101b587'])
    console.log(res)
  }
}
