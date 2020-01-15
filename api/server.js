const express = require("express");

const postsRouter = require("../posts/post-router");

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>Express 2 Project</h2>`);
});

module.exports = server;
