/* eslint-disable no-console */
import 'dotenv/config.js'
import app from './app.js'

const PORT = 3000
async function run() {
  try {
    app.listen(PORT, () => {
      console.log(`Quotable is running on port: ${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}
run()
