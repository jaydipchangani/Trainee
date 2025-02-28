const jsonServer = require("json-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const SECRET_KEY = "jaydipchanagni"; // Make sure it's defined!
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// 🔹 Login Route (Fix JWT Issue)
server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value(); // Fetch all users
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // ✅ Verify password using bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // ✅ Generate JWT Token
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
});

  // ✅ Send user & token in response
  res.json({
    token, // Make sure token is included in response
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 🔹 Start JSON Server
server.use(router);
server.listen(5000, () => {
  console.log("JSON Server is running on port 5000");
});
