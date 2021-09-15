const express = require("express");
const path = require("path");

const port = process.env.PORT || 8888;
const app = express();

app.use(express.static(path.join(__dirname, "/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build", "index.html"));
});

app.listen(port, () => {
  console.clear();
  console.log("\nServer run on:\n");
  console.log("\x1b[33m%s\x1b[0m", `\t🎉 http://localhost:${port} 🎉\n`);
});
