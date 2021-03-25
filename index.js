const express = require("express");
const mongoose = require("mongoose");
const items = require("./routes/items");
const users = require("./routes/Users");
const auth = require("./routes/auth");
const path = require("path");
const cors = require("cors");
const PORT = require("./config/index").PORT;

const app = express();

const db = require("./config/index").MONGO_URI;

app.use(express.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("the database is ready to use ..."))
  .catch((err) => console.log(err));

app.use("/items", items);
app.use("/users", users);
app.use("/auth", auth);
app.use("/uploads", express.static("uploads"));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("myapp/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "myapp", "build", "index.html"));
  });
}

const port = PORT || 5000;

app.listen(port, () => {
  console.log(`every thing is okk ...${port} ${process.env.NODE_ENV}`);
});
