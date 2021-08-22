#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const app = require('../app')
const server = new app.grpc.Server()
 
const client = new app.newsProto.News(
  process.env.GRPC_HOST,
  app.grpc.credentials.createInsecure()
)
 
app.promisify(client)
 
try {
  let address = `0.0.0.0:${process.env.GREP_PORT}`
  server.addService(app.newsProto.News.service, app.newsImpl)
  server.bind(address, app.grpc.ServerCredentials.createInsecure())
  server.start()
  console.info(`Crawler gRPC server: Listening on ${address}`)
} catch (error) {
  console.error(`Crawler gRPC server error: ${error.message}`)
  process.exit(1)
}