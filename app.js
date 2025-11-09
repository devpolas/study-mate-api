require("@dotenvx/dotenvx").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/usersRouter");
const friendshipRouter = require("./routes/friendshipRouter");

// create the app
const app = express();

// middlewares
app.use(cookieParser());
// use json form data parsing middleware
app.use(express.json());

// requests are logging console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/friendships", friendshipRouter);

// handel unrecognized routes
app.all("/*splat", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `can't find ${req.originalUrl} on this server`,
  });
});

// export the app from file
module.exports = app;
