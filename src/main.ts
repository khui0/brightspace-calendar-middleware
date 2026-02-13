import express from "express";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
