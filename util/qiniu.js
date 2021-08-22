const qiniu = require('qiniu');
const { unlinkSync } = require('fs');
const { resolve } = require('path');

const getFileName = (file, prefix) => {
  const uuid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  };
  return uuid() + '.png'
};

const deleteFile = (name) => {
  const path = resolve(__dirname, `../public/${name}`);
  unlinkSync(path);
};

const saveToQiNIu = async (fileName) => {
  const mac = new qiniu.auth.digest.Mac(
    process.env.ACCESS_KEY,
    process.env.SECRET_KEY,
  );
  const options = { scope: process.env.BUCKET };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  const localFile = resolve(__dirname, `../public/${fileName}`);
  const putExtra = new qiniu.form_up.PutExtra();
  const formUploader = new qiniu.form_up.FormUploader(config);
  return new Promise((resolve, reject) => {
    formUploader.putFile(
      uploadToken,
      fileName,
      localFile,
      putExtra,
      function (respErr, respBody, respInfo) {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody);
        }
      },
    );
  });
};

const deleteQiNiuSource = async (key) => {
  const mac = new qiniu.auth.digest.Mac(
    process.env.ACCESS_KEY,
    process.env.SECRET_KEY,
  );
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  const bucketManager = new qiniu.rs.BucketManager(mac, config);

  return new Promise((resolve, reject) => {
    bucketManager.delete(
      process.env.BUCKET,
      key,
      function (err, respBody, respInfo) {
        if (err) {
          reject(err);
        } else {
          resolve(respInfo);
        }
      },
    );
  });
};

module.exports = {
  saveToQiNIu,
  deleteQiNiuSource,
  getFileName,
  deleteFile
}
