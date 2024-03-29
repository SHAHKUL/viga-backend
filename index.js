require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const organisationRouter = require("./controllers/organisation");
const itemRouter = require("./controllers/item");
const pricingRouter = require("./controllers/pricing");
app.use(express.json());

app.use(cors());

app.use("/firm", organisationRouter);

app.use("/item", itemRouter);

app.use("/pricing", pricingRouter);

app.get("/", (req, res) => {
  res.json({ message: "server running on postGreSql successfully" });
});

app.listen(process.env.PORT, () => {
  console.log("server works");
});
