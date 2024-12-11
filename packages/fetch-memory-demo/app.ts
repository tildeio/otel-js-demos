import express, { Express, type Response, type NextFunction } from "express";
import { readFileSync } from "node:fs";

const PORT: number = parseInt(process.env.PORT || "8080");
const app: Express = express();

const CHUNK_SIZE = 64 * 1024 * 1024; // 64 MiB chunks

const CHUNK = new Array(CHUNK_SIZE).fill("-").join("");

const WAIT_BETWEEN_CHUNKS = 250; // ms

const INDEX_HTML = readFileSync("index.html", { encoding: "utf8" });

function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function write(res: Response, chunk: string): Promise<void> {
  return new Promise((resolve, reject) => {
    res.write(chunk, (error) => (error ? reject(error) : resolve()));
  });
}

async function infiniteStream(
  res: Response,
  next: NextFunction
): Promise<void> {
  res.statusCode = 200;
  res.setHeader("Content-type", "text/plain");

  try {
    while (true) {
      await write(res, CHUNK);
      await sleep(WAIT_BETWEEN_CHUNKS);
    }
  } catch {
    next();
  }
}

app.get("/infinite-stream", (req, res, next) => {
  void infiniteStream(res, next);
});

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-type", "text/html");
  res.send(INDEX_HTML);
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
