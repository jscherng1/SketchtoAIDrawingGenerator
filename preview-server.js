const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 16 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function dataUrlToBlob(dataUrl) {
  const [meta, content] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/png";
  const bytes = Buffer.from(content, "base64");
  return new Blob([bytes], { type: mime });
}

async function handleImageGeneration(req, res) {
  try {
    const rawBody = await readRequestBody(req);
    const payload = JSON.parse(rawBody);
    const apiKey = payload.apiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      sendJson(res, 400, {
        error: "Missing OpenAI API key. Fill API Key in the page or set OPENAI_API_KEY before starting the preview server."
      });
      return;
    }

    if (!payload.sketchImageBase64 || !payload.prompt) {
      sendJson(res, 400, { error: "Missing sketch image or prompt." });
      return;
    }

    const imageBlob = dataUrlToBlob(payload.sketchImageBase64);
    const form = new FormData();
    form.append("model", payload.model || "gpt-image-1.5");
    form.append("prompt", payload.prompt);
    form.append("image", imageBlob, "sketch.png");
    form.append("size", "1024x1024");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: form
    });

    const data = await response.json();
    if (!response.ok) {
      sendJson(res, response.status, {
        error: data.error?.message || "OpenAI image generation failed."
      });
      return;
    }

    const imageBase64 = data.data?.[0]?.b64_json;
    if (!imageBase64) {
      sendJson(res, 502, { error: "OpenAI response did not include image data." });
      return;
    }

    sendJson(res, 200, {
      imageUrl: `data:image/png;base64,${imageBase64}`,
      revisedPrompt: data.data?.[0]?.revised_prompt || "",
      source: "openai"
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error." });
  }
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");

    if (req.method === "POST" && url.pathname === "/api/generate-image") {
      handleImageGeneration(req, res);
      return;
    }

    const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const filePath = path.resolve(root, requested);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
      });
      res.end(data);
    });
  })
  .listen(8765, "127.0.0.1");
