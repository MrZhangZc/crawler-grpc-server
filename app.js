const path = require('path')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const promisify = require(path.join(__dirname, 'util/grpc-promisify'))

const News_PATH = path.join(__dirname, 'protos/news.proto')

const newsDefinition = protoLoader.loadSync(News_PATH, {
  defaults: true
})
module.exports = {
  newsProto: grpc.loadPackageDefinition(newsDefinition).news,
  newsImpl: require(path.join(__dirname, '/app/controller/news')),
  grpc,
  promisify
}
