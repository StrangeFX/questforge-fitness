import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4177);
const rootPath = resolve(root);
const noCacheTypes = new Set([".html", ".css", ".js", ".json", ".tsv"]);

function localNetworkUrls() {
  return Object.values(networkInterfaces())
    .flat()
    .filter(address => address && address.family === "IPv4" && !address.internal)
    .map(address => `http://${address.address}:${port}/index.html`);
}

createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const path = normalize(url.pathname === "/" ? "/index.html" : url.pathname);
  const file = resolve(join(root, path));

  if (!file.startsWith(rootPath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(file);
    const extension = extname(file);
    response.writeHead(200, {
      "content-type": types[extension] || "application/octet-stream",
      "cache-control": noCacheTypes.has(extension) ? "no-store" : "public, max-age=300"
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, host, () => {
  console.log("QuestForge Fitness dev server");
  console.log(`Local:   http://127.0.0.1:${port}/index.html`);
  localNetworkUrls().forEach(url => console.log(`Network: ${url}`));
});
