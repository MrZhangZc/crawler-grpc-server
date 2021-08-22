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
    console.log(call.request)
    let err = null
    callback(err, { data: 'Hello' + call.request.keyword });
  }
}
