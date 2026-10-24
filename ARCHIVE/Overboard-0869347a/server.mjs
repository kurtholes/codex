import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = process.argv.includes("--dev") ? "src" : "dist";
http
  .createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/index.html";
      if (p.includes("..")) throw Error();
      const b = await readFile(path.join(root, p));
      res.setHeader(
        "Content-Type",
        { html: "text/html", js: "text/javascript", css: "text/css" }[
          p.split(".").pop()
        ] || "application/octet-stream",
      );
      res.end(b);
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(4173, "0.0.0.0", () => console.log("http://localhost:4173 " + root));
