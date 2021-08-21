function promisify (client) {
  Object.keys(Object.getPrototypeOf(client)).forEach(functionName => {
    if (functionName.startsWith('$')) {
      return
    }
    const originalFunction = client[functionName]
    client[functionName] = (request, callback) => {
      if (callback && typeof callback === 'function') {
        return originalFunction.call(client, request, (error, response) => {
          callback(error, response)
        })
      }
      return new Promise((resolve, reject) => {
        originalFunction.call(client, request, (error, response) => {
          if (error) {
            reject(error)
          } else {
            resolve(response)
          }
        })
      })
    }
    client[functionName].interceptors = originalFunction.interceptors
  })
}

module.exports = promisify
