const express = require("express")
const {db}=require("./config/db")
const cors = require("cors")
const userRouter = require("./routes/user.routes");
const companyRouter = require("./routes/company.routes");
require("dotenv").config()
const port = process.env.PORT
const app = express()

app.use(express.json())
app.use(cors())


app.get("/", (req,res) => {
    res.send("Welcome, Backend of JobPortal!")
})

app.use(userRouter,companyRouter); 
// app.use("/company", companyRouter); 

app.listen(port, () => {
    try {
        db()
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        console.error(error)
    }

})