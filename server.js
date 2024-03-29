require("dotenv").config({ path: "./.env" });
const express = require("express");
const PORT = process.env.PORT;
const app = express();
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const path = require("path");
//
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
// app configrations middlewares
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  next();
});
//END
console.log(process.env.NODE_ENV);

//? Databse connection
const dbConnect = require("./DB/config");
async function connect(fn) {
  await fn();
}
connect(dbConnect);

//? mouintain routes
app.use("/api/v1/", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
//* handling unhadled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on our server`, 404));
});
//* END
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 😄`);
});
