const Pool = require('pg-pool');

const pgConnection = new Pool({
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: 5432,
  database: process.env.PG_DATABASE
})

module.exports = {
  pgQuery: async (sql, values) => {
    let connection = false
    try {
      connection = await pgConnection.connect()
      let results = await connection.query(sql, values)
      return results
    } catch (error) {
      throw error
    } finally {
      if (connection) {
        connection.release()
      }
    }
  },
}