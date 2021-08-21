#!/usr/bin/env node
const app = require('../app')
const port = normalizePort('50051')
const server = new app.grpc.Server()
 
const client = new app.newsProto.News(
  process.env.GRPC_HOST,
  app.grpc.credentials.createInsecure()
)
 
app.promisify(client)
 
try {
  let address = `0.0.0.0:${port}`
  server.addService(app.newsProto.News.service, app.newsImpl)
  server.bind(address, app.grpc.ServerCredentials.createInsecure())
  server.start()
  console.info(`Crawler gRPC server: Listening on ${address}`)
} catch (error) {
  console.error(`Crawler gRPC server error: ${error.message}`)
  process.exit(1)
}

function normalizePort (val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}
