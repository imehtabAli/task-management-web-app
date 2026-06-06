const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors")
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const taskRoute = require("./routes/taskRoute");

connectDB();
app.use(cors({origin: "*"}));

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);

app.get("/", async (req, res) => {
    res.send("Server is live.")
})
app.listen(process.env.PORT, ()=>{
  console.log(`App is listening to ${process.env.PORT}`);
  
})