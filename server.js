const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const cors = require("cors");
// const execSocket = require("./services/order.service");
const Order = require("./models/order.model");

//load user model
const users = require("./routes/api/users.route");

//load products model
const fertilized_products = require("./routes/api/fertilized_products.route");
const agricultural_products = require("./routes/api/agricultural_products.route");
const orders = require("./routes/api/order.route");
const reveiws = require("./routes/api/reveiw.route");
const recommandation = require("./routes/api/recommandation.route");
const scraps = require("./routes/api/scrap.route");
//mongo "mongodb+srv://cluster0-etr0j.mongodb.net/test"  --username karim
//use corse
app.use(cors());
//use compression
app.use(compression());
// to upload files
app.use(express.static("uploads"));
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected..."))
  .catch((err) => console.log(err));
const port = process.env.PORT || 5000;

// Passport middleware
app.use(passport.initialize());
// app.set("view engine", "pug");
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/fertilized_products", fertilized_products);
app.use("/api/agricultural_products", agricultural_products);
app.use("/api/recommandation", recommandation);
app.use("/api/orders", orders);
app.use("/api/reveiws", reveiws);
app.use("/api/scrap", scraps);
// app.use(express.static(__dirname));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Socket Connection Established with ID :" + socket.id);
  socket.on("sendOrder", async function (msg) {
    try {
      let order = new Order(msg);
      order.save((err, doc) => {
        if (err) {
          console.log("err", err);
          return err;
        }
        Order.findById(doc._id).exec((err, doc) => {
          // console.log("doc", doc);
          return io.emit("sendResponse", doc);
        });
      });
    } catch (err) {
      console.log("err", err);
    }
  });
  socket.on("approve", async function (id) {
    try {
      Order.findById(id, (err, order) => {
        if (!order) console.log("order not found");
        else {
          order.status = true;
          order.date = Date.now();
        }
        order.save((err, doc) => {
          if (err) {
            console.log("err", err);
            return err;
          }
          Order.findById(doc._id).exec((err, doc) => {
            // console.log("doc", doc);
            return io.emit("approvedNotif", doc);
          });
        });
      });
    } catch (err) {
      console.log("err", err);
    }
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
    clearInterval();
  });
});

server.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
);
