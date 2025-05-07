const express = require("express")
const app = express()
const cors = require("cors")

const ConnectedDb = require("./src/Config/db")
const AuthRouter = require("./src/Routes/Auth.route")

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello")
})

app.use("/auth",AuthRouter)
app.listen(4000, async () => {
  try {
    await ConnectedDb()
    console.log("http://localhost:4000")
  } catch (err) {
    console.log(err)
  }
});
