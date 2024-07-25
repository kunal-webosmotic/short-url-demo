import express from "express";
import { customAlphabet } from "nanoid";
import mongoose from "mongoose";

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/short-links");

// MongoDB schema and model
const linkSchema = new mongoose.Schema({
  shortId: String,
  originalUrl: String,
});

const Link = mongoose.model("Link", linkSchema);

const app = express();
const port = 3000;

// Endpoint to generate short link
app.post("/generate", async (req, res) => {
  const originalUrl = req.query.url;
  const nanoid = await customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    8
  );
  const shortId = nanoid();
  // Save to MongoDB
  const link = new Link({ shortId, originalUrl });
  await link.save();

  res.status(200).json({
    shortId: shortId,
    shortURL: "https://link.kunalbariya-webosmotic.workers.dev/" + shortId,
  });
});

// Endpoint to redirect short link to original URL
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const link = await Link.findOne({ shortId });
  console.log(link.originalUrl);
  if (link) {
    res.redirect(link.originalUrl);
  } else {
    res.status(404).send("Short link not found");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
