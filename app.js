const { request, response } = require("express");
const express = require("express");
const { status } = require("express/lib/response");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
require("./userDetails");
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "asfbhetnbenbifnbafvasdvefeq4358ytejhw5gnvryvn arv nqyurgt";

const dbUrl =
  "mongodb+srv://ramesh:ramdatabase@cluster0.curv2jq.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.log(e));

const User = mongoose.model("UserDetails");

// Register API
app.post("/register", async (request, response) => {
  const { name, email, password } = request.body;
  const bcryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.send({ error: "User exists" });
    }

    await User.create({
      name: name,
      email: email,
      password: bcryptedPassword,
    });
    response.send({ status: "ok" });
  } catch (error) {
    response.send({ status: "error" });
  }
});

// login API
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

// Get user details API
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server started");
});
