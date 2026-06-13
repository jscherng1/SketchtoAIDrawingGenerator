const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

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

function loadDotEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (!key || process.env[key]) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadDotEnv();

const port = Number(process.env.PORT || 8765);
const host = process.env.HOST || "0.0.0.0";
const defaultImageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
const creditBudgetUsd = Number(process.env.OPENAI_CREDIT_BUDGET_USD || 5);
const creditStartDate = process.env.OPENAI_CREDIT_START_DATE || "";
const creditInitialSpentUsd = Number(process.env.OPENAI_CREDIT_INITIAL_SPENT_USD || 0);
const estimatedImageCostUsd = Number(process.env.OPENAI_ESTIMATED_IMAGE_COST_USD || 0.05);
const usageStorePath = path.join(root, ".openai-credit-usage.json");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": getAllowedOrigin(res.req),
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization"
  });
  res.end(JSON.stringify(payload));
}

function getAllowedOrigin(req) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
  if (allowedOrigin === "*") return "*";

  const requestOrigin = req?.headers?.origin || "";
  const allowedOrigins = allowedOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0] || "*";
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
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    throw new Error("Sketch image must be a valid image data URL.");
  }

  const [meta, content] = dataUrl.split(",");
  if (!content) {
    throw new Error("Sketch image is missing base64 data.");
  }

  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/png";
  const bytes = Buffer.from(content, "base64");
  return new Blob([bytes], { type: mime });
}

function getImageFilename(mime) {
  const extension = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp"
  }[mime] || "png";

  return `sketch.${extension}`;
}

function paethPredictor(left, above, upperLeft) {
  const prediction = left + above - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const aboveDistance = Math.abs(prediction - above);
  const upperLeftDistance = Math.abs(prediction - upperLeft);

  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  if (aboveDistance <= upperLeftDistance) return above;
  return upperLeft;
}

function pngHasTransparentPixels(bytes) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < 33 || !bytes.subarray(0, 8).equals(signature)) return false;

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlaceMethod = 0;
  let transparency = null;
  const imageDataChunks = [];

  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const chunkData = bytes.subarray(offset + 8, offset + 8 + length);

    if (type === "IHDR") {
      width = chunkData.readUInt32BE(0);
      height = chunkData.readUInt32BE(4);
      bitDepth = chunkData[8];
      colorType = chunkData[9];
      interlaceMethod = chunkData[12];
    } else if (type === "tRNS") {
      transparency = Buffer.from(chunkData);
    } else if (type === "IDAT") {
      imageDataChunks.push(chunkData);
    }

    if (type === "IEND") break;
    offset += 12 + length;
  }

  if (!width || !height || bitDepth !== 8 || interlaceMethod !== 0 || imageDataChunks.length === 0) {
    return false;
  }

  const channelsByColorType = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
  const channels = channelsByColorType[colorType];
  if (!channels) return false;

  const bytesPerPixel = channels;
  const rowLength = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(imageDataChunks));
  const previousRow = Buffer.alloc(rowLength);
  const currentRow = Buffer.alloc(rowLength);
  let inputOffset = 0;

  for (let row = 0; row < height; row += 1) {
    const filterType = inflated[inputOffset];
    inputOffset += 1;

    for (let column = 0; column < rowLength; column += 1) {
      const raw = inflated[inputOffset + column];
      const left = column >= bytesPerPixel ? currentRow[column - bytesPerPixel] : 0;
      const above = previousRow[column];
      const upperLeft = column >= bytesPerPixel ? previousRow[column - bytesPerPixel] : 0;
      let value = raw;

      if (filterType === 1) value = raw + left;
      if (filterType === 2) value = raw + above;
      if (filterType === 3) value = raw + Math.floor((left + above) / 2);
      if (filterType === 4) value = raw + paethPredictor(left, above, upperLeft);
      currentRow[column] = value & 255;
    }

    inputOffset += rowLength;

    for (let pixel = 0; pixel < width; pixel += 1) {
      const pixelOffset = pixel * channels;
      if (colorType === 6 && currentRow[pixelOffset + 3] < 255) return true;
      if (colorType === 4 && currentRow[pixelOffset + 1] < 255) return true;
      if (colorType === 3 && transparency && (transparency[currentRow[pixelOffset]] ?? 255) < 255) return true;
      if (colorType === 0 && transparency?.length >= 2 && currentRow[pixelOffset] === transparency.readUInt16BE(0)) return true;
      if (
        colorType === 2 &&
        transparency?.length >= 6 &&
        currentRow[pixelOffset] === transparency.readUInt16BE(0) &&
        currentRow[pixelOffset + 1] === transparency.readUInt16BE(2) &&
        currentRow[pixelOffset + 2] === transparency.readUInt16BE(4)
      ) {
        return true;
      }
    }

    currentRow.copy(previousRow);
  }

  return false;
}

function getCreditStartTime() {
  if (creditStartDate) {
    const configuredDate = new Date(`${creditStartDate}T00:00:00Z`);
    if (!Number.isNaN(configuredDate.getTime())) {
      return Math.floor(configuredDate.getTime() / 1000);
    }
  }

  const now = new Date();
  return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000);
}

function sumCostsResponse(data) {
  if (!Array.isArray(data?.data)) return 0;

  return data.data.reduce((bucketTotal, bucket) => {
    if (!Array.isArray(bucket.results)) return bucketTotal;

    const resultTotal = bucket.results.reduce((sum, result) => {
      const value = Number(result.amount?.value || 0);
      return sum + value;
    }, 0);

    return bucketTotal + resultTotal;
  }, 0);
}

function loadUsageStore() {
  try {
    if (!fs.existsSync(usageStorePath)) {
      return { imageGenerations: 0, estimatedSpendUsd: 0, history: [] };
    }

    const data = JSON.parse(fs.readFileSync(usageStorePath, "utf8"));
    return {
      imageGenerations: Number(data.imageGenerations || 0),
      estimatedSpendUsd: Number(data.estimatedSpendUsd || 0),
      history: Array.isArray(data.history) ? data.history : []
    };
  } catch (error) {
    return { imageGenerations: 0, estimatedSpendUsd: 0, history: [] };
  }
}

function saveUsageStore(store) {
  fs.writeFileSync(usageStorePath, JSON.stringify(store, null, 2), "utf8");
}

function recordEstimatedImageSpend(payload) {
  const store = loadUsageStore();
  store.imageGenerations += 1;
  store.estimatedSpendUsd = Number((store.estimatedSpendUsd + estimatedImageCostUsd).toFixed(6));
  store.history = [
    {
      createdAt: new Date().toISOString(),
      model: payload.model || defaultImageModel,
      estimatedCostUsd: estimatedImageCostUsd
    },
    ...store.history
  ].slice(0, 200);
  saveUsageStore(store);
}

function buildEstimatedCreditStatus(message = "") {
  const store = loadUsageStore();
  const spentUsd = Number((creditInitialSpentUsd + store.estimatedSpendUsd).toFixed(6));

  return {
    available: true,
    estimated: true,
    budgetUsd: creditBudgetUsd,
    spentUsd,
    remainingUsd: Math.max(creditBudgetUsd - spentUsd, 0),
    currency: "usd",
    imageGenerations: store.imageGenerations,
    estimatedImageCostUsd,
    source: "local-estimate",
    message
  };
}

async function handleCreditStatus(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sendJson(res, 200, buildEstimatedCreditStatus("尚未設定 OPENAI_API_KEY，改用本機估算。"));
    return;
  }

  try {
    const url = new URL("https://api.openai.com/v1/organization/costs");
    url.searchParams.set("start_time", String(getCreditStartTime()));
    url.searchParams.set("bucket_width", "1d");
    url.searchParams.set("limit", "180");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      data = { error: { message: responseText || "OpenAI returned a non-JSON response." } };
    }

    if (!response.ok) {
      sendJson(
        res,
        200,
        buildEstimatedCreditStatus(data.error?.message || "無法讀取 OpenAI 成本資料，改用本機估算。")
      );
      return;
    }

    const spentUsd = sumCostsResponse(data);
    sendJson(res, 200, {
      available: true,
      estimated: false,
      budgetUsd: creditBudgetUsd,
      spentUsd,
      remainingUsd: Math.max(creditBudgetUsd - spentUsd, 0),
      currency: "usd",
      startTime: getCreditStartTime(),
      source: "openai-costs"
    });
  } catch (error) {
    sendJson(
      res,
      200,
      buildEstimatedCreditStatus("OpenAI 成本查詢逾時或失敗，改用本機估算。")
    );
  }
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

    const requestedModel = payload.model || defaultImageModel;
    if (payload.removeBackground && requestedModel.startsWith("gpt-image-2")) {
      sendJson(res, 400, {
        error: "gpt-image-2 does not currently support transparent backgrounds. Use gpt-image-1.5 for Remove Background."
      });
      return;
    }

    const imageBlob = dataUrlToBlob(payload.sketchImageBase64);
    const form = new FormData();
    form.append("model", requestedModel);
    form.append("prompt", payload.prompt);
    form.append("image", imageBlob, getImageFilename(imageBlob.type));
    form.append("size", payload.size || "1024x1024");
    form.append("output_format", "png");

    if (payload.removeBackground) {
      form.append("background", "transparent");
    }

    if (payload.quality) {
      form.append("quality", payload.quality);
    }

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: form
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      data = { error: { message: responseText || "OpenAI returned a non-JSON response." } };
    }

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

    const imageBytes = Buffer.from(imageBase64, "base64");
    const hasTransparentPixels = payload.removeBackground
      ? pngHasTransparentPixels(imageBytes)
      : false;

    recordEstimatedImageSpend(payload);

    if (payload.removeBackground && !hasTransparentPixels) {
      sendJson(res, 502, {
        error: "OpenAI returned an image without any truly transparent pixels. Please regenerate with Remove Background enabled and model gpt-image-1.5."
      });
      return;
    }

    sendJson(res, 200, {
      imageUrl: `data:image/png;base64,${imageBase64}`,
      revisedPrompt: data.data?.[0]?.revised_prompt || "",
      source: "openai",
      transparent: hasTransparentPixels
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error." });
  }
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");

    if (req.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": getAllowedOrigin(req),
        "Vary": "Origin",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      });
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/status") {
      sendJson(res, 200, {
        provider: "openai",
        hasServerApiKey: Boolean(process.env.OPENAI_API_KEY),
        defaultImageModel,
        endpoint: "/api/generate-image"
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/credit-status") {
      handleCreditStatus(req, res);
      return;
    }

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
  .listen(port, host, () => {
    const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;
    console.log(`Sketch AI preview server running at http://${displayHost}:${port}/`);
    console.log(
      process.env.OPENAI_API_KEY
        ? `OpenAI API key loaded. Default image model: ${defaultImageModel}`
        : "OpenAI API key not found. Add OPENAI_API_KEY to .env or enter it in the web page."
    );
  });
