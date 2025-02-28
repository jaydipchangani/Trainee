const jsonServer = require("json-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router("server/db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "your_secret_key";

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Login Endpoint
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value();
  const user = users.find((u) => u.email === email);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, role: user.role, permissions: user.permissions });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

server.use(router);
server.listen(5000, () => console.log("JSON Server running on port 5000"));
