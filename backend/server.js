const express = require("express");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const commentRoute = require("./routes/commentRoute");
const showRoute = require("./routes/showRoute");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const redis = require("ioredis");
const redisStore = require("connect-redis")(session);
const path = require("path");
const redisClient = new redis();
require("dotenv").config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const { PORT, SESSION_KEY } = process.env;
const client = require("./config/api");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.set("trust-proxy", 1);

app.use(
  session({
    secret: SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
      domain: ".onrender.com",
    },
    store: new redisStore({
      client: redisClient,
    }),
  })
);

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://htbook-react-app-n608.onrender.com",
//     ],
//     credentials: true,
//   })
// );

app.use(express.json());

app.use(passport.initialize());

app.use(passport.session());

app.use("/api/auth/", authRoute);

app.use("/api/product/", productRoute);

app.use("/api/order/", orderRoute);

app.use("/api/comment/", commentRoute);

app.use("/api/show/", showRoute);

// const socketIo = require("socket.io")(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "https://htbook-react-app-n608.onrender.com",
//     ],
//     credentials: true,
//   },
// });

const socketIo = require("socket.io")(server);

socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới

  socketIo.emit("getId", socket.id);

  socket.on("sendDataClient", function (data) {
    // Handle khi có sự kiện tên là sendDataClient từ phía client
    client.query(
      `INSERT INTO public."Comments"(
      "Username", "ProductID", "Content", "PostDate", "StarVote")
      VALUES ('${data.username}', ${data.product_id}, '${data.content}', '${data.post_date}', ${data.star_vote});`,
      (err, results) => {
        if (err) throw err;
        return socketIo.emit("sendDataServer", {
          Username: data.username,
          Content: data.content,
          PostDate: data.date_post,
          StarVote: data.star_vote,
        }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
      }
    );
  });

  socket.on("disconnect", () => {
    //console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(PORT, (req, res) => {
  console.log("Server is running...");
});
