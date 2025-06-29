require('dotenv').config();
 express = require("express");
const cors=require("cors");
const app=express();

app.use(cors());
app.use(express.json());

const port=process.env.PORT || 3000
const { router: mainRouter } = require("./routes/index");
app.use("/api/v1", mainRouter);


app.use(express.json());

app.listen(port);