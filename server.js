const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");

/* CONFIGURATION */
dotenv.config();
app.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ROUTER */
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .json({ message: err.message || `Something went wrong` });
});

/* MOONGOSE */
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 1000, () => {
      console.log(`Server Port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
