const { dynaliteServer } = require('../util/dynalite')

module.exports = async () => {
  await new Promise((resolve,reject) => {
    dynaliteServer.listen(4567, function(err) {
      if (err) reject(err)
        resolve(true)
    })
  })
}
