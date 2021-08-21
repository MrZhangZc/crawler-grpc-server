module.exports = {
  GetNabNews: async (call, callback) => {
    console.log(call.request)
    let err = null
    callback(err, { data: 'Hello' + call.request.keyword });
  }
}
