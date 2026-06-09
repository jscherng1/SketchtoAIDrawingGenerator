const canvas = document.querySelector("#drawingCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const projectName = document.querySelector("#projectName");
const sourceButtons = document.querySelectorAll(".source-button");
const uploadPanel = document.querySelector("#uploadPanel");
const imageInput = document.querySelector("#imageInput");
const toolButtons = document.querySelectorAll(".tool-button");
const brushColor = document.querySelector("#brushColor");
const brushSize = document.querySelector("#brushSize");
const brushSizeValue = document.querySelector("#brushSizeValue");
const undoBtn = document.querySelector("#undoBtn");
const clearBtn = document.querySelector("#clearBtn");
const downloadSketchBtn = document.querySelector("#downloadSketchBtn");
const enhancementLevel = document.querySelector("#enhancementLevel");
const stylePreset = document.querySelector("#stylePreset");
const extraPrompt = document.querySelector("#extraPrompt");
const promptText = document.querySelector("#promptText");
const copyPromptBtn = document.querySelector("#copyPromptBtn");
const generateBtn = document.querySelector("#generateBtn");
const resultPreview = document.querySelector("#resultPreview");
const resultActions = document.querySelector("#resultActions");
const resultNote = document.querySelector("#resultNote");
const creditMeter = document.querySelector("#creditMeter");
const creditRemaining = document.querySelector("#creditRemaining");
const creditDetail = document.querySelector("#creditDetail");
const downloadResultBtn = document.querySelector("#downloadResultBtn");
const useResultBtn = document.querySelector("#useResultBtn");
const resultViewButtons = document.querySelectorAll("[data-result-view]");
const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistoryBtn");
const downloadNotice = document.querySelector("#downloadNotice");
const downloadNoticeTitle = document.querySelector("#downloadNoticeTitle");
const downloadNoticeText = document.querySelector("#downloadNoticeText");
const closeDownloadNotice = document.querySelector("#closeDownloadNotice");
const openDownloadImageBtn = document.querySelector("#openDownloadImageBtn");
const saveProjectBtn = document.querySelector("#saveProjectBtn");
const loadProjectBtn = document.querySelector("#loadProjectBtn");
const clearProjectBtn = document.querySelector("#clearProjectBtn");
const exportProjectBtn = document.querySelector("#exportProjectBtn");
const importProjectInput = document.querySelector("#importProjectInput");
const projectStatus = document.querySelector("#projectStatus");
const canvasStatus = document.querySelector("#canvasStatus");
const levelNote = document.querySelector("#levelNote");
const styleNote = document.querySelector("#styleNote");
const apiModelInput = document.querySelector("#apiModelInput");
const apiHelp = document.querySelector("#apiHelp");
const flowSteps = document.querySelectorAll(".flow-step");
const backTopButtons = document.querySelectorAll("[data-back-top]");
const jumpTargets = {
  studio: document.querySelector("#studioSection"),
  settings: document.querySelector("#settingsSection"),
  result: document.querySelector("#resultSection")
};
const apiBaseUrl = (window.SKETCH_AI_API_BASE_URL || "").replace(/\/$/, "");

function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

const enhancementPrompts = {
  1: "Clean up the sketch lines while keeping the original composition and hand-drawn feeling.",
  2: "Refine the sketch into clean line art, improve proportions slightly, and keep the original design.",
  3: "Turn the sketch into a colored illustration with simple shading, while preserving the original pose and composition.",
  4: "Transform the sketch into a polished digital illustration with refined details, lighting, and texture.",
  5: "Convert the sketch into a high-quality anime-style character design, keeping the original concept, pose, and main features."
};

const enhancementNotes = {
  1: "清理線條：整理雜線，保留手繪感與原始構圖。",
  2: "精緻線稿：讓比例與線條更乾淨，適合角色或物件草圖。",
  3: "上色插畫：加入簡單上色與陰影，保留原本姿勢。",
  4: "完整數位插畫：加入細節、光影與質感，保留原本構圖。",
  5: "動漫角色設計：轉成較完整的動漫角色概念圖。"
};

const stylePresets = {
  cute: {
    label: "可愛插畫",
    prompt: "Use a cute illustration style with rounded shapes, friendly details, and bright colors.",
    note: "可愛插畫：圓潤、親切、色彩明亮，適合角色或小物件。"
  },
  anime: {
    label: "動漫角色",
    prompt: "Use an anime character design style with expressive eyes, clean shapes, and crisp details.",
    note: "動漫角色：輪廓清楚、表情鮮明，適合人物或角色概念。"
  },
  watercolor: {
    label: "柔和水彩",
    prompt: "Use a soft watercolor style with gentle edges, light texture, and airy colors.",
    note: "柔和水彩：邊緣柔軟、色彩輕盈，適合溫柔或繪本感作品。"
  },
  storybook: {
    label: "繪本風格",
    prompt: "Use a charming storybook illustration style with warm shapes and narrative details.",
    note: "繪本風格：溫暖、有故事感，適合兒童插畫或角色場景。"
  },
  toy3d: {
    label: "3D 玩具感",
    prompt: "Use a playful 3D toy-like style with soft materials, rounded volume, and studio lighting.",
    note: "3D 玩具感：立體、圓滑、像玩具模型，適合可愛角色。"
  },
  realistic: {
    label: "半寫實質感",
    prompt: "Use a semi-realistic style with refined lighting, believable materials, and polished texture.",
    note: "半寫實質感：光影和材質更完整，適合想要較成熟的完成圖。"
  },
  photoreal: {
    label: "寫實質感",
    prompt: "Use a photorealistic style with natural lighting, realistic surfaces, accurate proportions, and camera-like detail.",
    note: "寫實質感：接近照片效果，強調自然光線、真實材質與比例。"
  },
  cinematic: {
    label: "電影 Cinematic 質感",
    prompt: "Use a cinematic visual style with dramatic lighting, film-like color grading, depth of field, and a polished movie still atmosphere.",
    note: "電影 Cinematic 質感：強調電影光影、景深、色調與畫面氛圍。"
  },
  sketch: {
    label: "純素描質感",
    prompt: "Use a pure pencil sketch style with grayscale shading, visible hand-drawn strokes, paper texture, and no digital coloring.",
    note: "純素描質感：黑白鉛筆筆觸、灰階陰影與紙張質感，不做彩色上色。"
  },
  sticker: {
    label: "貼紙圖案",
    prompt: "Use a clean sticker design style with bold outlines, simple shapes, and a transparent-sticker feeling.",
    note: "貼紙圖案：粗輪廓、造型清楚，適合做成貼紙或小圖案。"
  },
  pixel: {
    label: "像素藝術",
    prompt: "Use a pixel art style with blocky shapes, limited colors, and retro game charm.",
    note: "像素藝術：方塊感、復古遊戲風，適合小角色或道具。"
  },
  comic: {
    label: "美式漫畫",
    prompt: "Use an American comic style with bold ink, dramatic contrast, and energetic shapes.",
    note: "美式漫畫：線條強烈、對比明顯，適合動作感或英雄風格。"
  },
  oilpaint: {
    label: "厚塗油畫",
    prompt: "Use a painterly oil painting style with visible brush strokes, rich colors, and textured shading.",
    note: "厚塗油畫：筆觸明顯、色彩厚實，適合藝術感完成圖。"
  },
  clay: {
    label: "黏土模型",
    prompt: "Use a handmade clay model style with soft sculpted forms, matte material, and cozy lighting.",
    note: "黏土模型：手作感、柔軟霧面材質，適合可愛角色或小物。"
  },
  fantasy: {
    label: "奇幻概念",
    prompt: "Use a fantasy concept art style with magical atmosphere, rich details, and cinematic lighting.",
    note: "奇幻概念：魔法氛圍、細節較多，適合怪物、角色或場景設定。"
  },
  cyberpunk: {
    label: "賽博龐克",
    prompt: "Use a cyberpunk style with neon lighting, futuristic details, and high-tech atmosphere.",
    note: "賽博龐克：霓虹、高科技、未來感，適合機械或城市風角色。"
  },
  minimal: {
    label: "極簡圖標",
    prompt: "Use a minimal icon style with simplified geometry, clean silhouettes, and flat colors.",
    note: "極簡圖標：造型簡化、顏色扁平，適合 logo、icon 或清楚的小圖。"
  }
};

const aiConfig = {
  mode: "real",
  provider: "openai",
  model: "gpt-image-1.5",
  serverHasApiKey: false,
  serverAvailable: false
};

const toolNames = {
  brush: "筆刷",
  eraser: "橡皮擦"
};

let activeTool = "brush";
let drawing = false;
let lastPoint = null;
let undoStack = [];
let latestResultUrl = "";
let latestSourceUrl = "";
let resultViewMode = "single";
let latestDownloadUrl = "";
let resultHistory = [];
let activeHistoryId = "";
const projectStorageKey = "sketchAiGeneratorProject";

function setActiveTool(tool) {
  activeTool = tool;
  toolButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tool === tool);
  });
  canvasStatus.textContent = `目前工具：${toolNames[tool]}`;
}

function renderEmptyResult() {
  resultPreview.innerHTML = `
    <div class="empty-result">
      <span aria-hidden="true">◇</span>
      <strong>AI 修飾結果會顯示在這裡</strong>
      <small>繪製或上傳草圖後，按下開始即可產生真正 AI 圖片。</small>
    </div>
  `;
  resultActions.hidden = true;
  if (resultNote) resultNote.textContent = "";
  latestResultUrl = "";
  latestSourceUrl = "";
  activeHistoryId = "";
  renderHistory();
}

function setResultViewMode(mode) {
  resultViewMode = mode;
  resultViewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.resultView === mode);
  });
  if (latestResultUrl) renderCurrentResult(latestResultUrl, latestSourceUrl);
}

function renderCurrentResult(imageUrl, sourceUrl = latestSourceUrl) {
  latestResultUrl = imageUrl;
  latestSourceUrl = sourceUrl || latestSourceUrl;
  resultPreview.innerHTML = "";

  if (resultViewMode === "compare" && latestSourceUrl) {
    resultPreview.innerHTML = `
      <div class="compare-grid">
        <div class="compare-card">
          <strong>原始草圖</strong>
          <img src="${latestSourceUrl}" alt="原始草圖">
        </div>
        <div class="compare-card">
          <strong>修飾結果</strong>
          <img src="${imageUrl}" alt="修飾結果">
        </div>
      </div>
    `;
    resultActions.hidden = false;
    return;
  }

  const image = document.createElement("img");
  image.alt = "AI 修飾結果預覽";
  image.src = imageUrl;
  resultPreview.append(image);
  resultActions.hidden = false;
}

function addResultHistoryItem(result, payload) {
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    imageUrl: result.imageUrl,
    sourceUrl: payload.sketchImageBase64,
    level: payload.enhancementLevel,
    label: payload.enhancementLabel,
    createdAt: new Date()
  };

  resultHistory = [item, ...resultHistory].slice(0, 6);
  activeHistoryId = item.id;
  renderHistory();
}

function renderHistory() {
  if (resultHistory.length === 0) {
    historyList.innerHTML = '<span class="history-empty">產生結果後會保留在這裡。</span>';
    return;
  }

  historyList.innerHTML = "";
  resultHistory.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `history-item${item.id === activeHistoryId ? " is-active" : ""}`;
    button.dataset.historyId = item.id;
    button.innerHTML = `
      <img src="${item.imageUrl}" alt="第 ${item.level} 級結果縮圖">
      <span>第 ${item.level} 級 · ${item.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
    `;
    historyList.append(button);
  });
}

function selectHistoryItem(id) {
  const item = resultHistory.find((entry) => entry.id === id);
  if (!item) return;
  activeHistoryId = item.id;
  renderCurrentResult(item.imageUrl, item.sourceUrl);
  if (resultNote) resultNote.textContent = `已切回結果紀錄：第 ${item.level} 級 AI 修飾結果。`;
  renderHistory();
}

function getSelectedValue(name) {
  return document.querySelector(`input[name='${name}']:checked`)?.value;
}

function setSelectedValue(name, value) {
  const normalizedValue = normalizeSelectedValue(name, value);
  const input = document.querySelector(`input[name='${name}'][value='${normalizedValue}']`);
  if (input) input.checked = true;
}

function normalizeSelectedValue(name, value) {
  if (name === "sketchMode") {
    if (value === "black and white line sketch") return "black-white";
    if (value === "colored sketch") return "colored";
  }

  return value;
}

function buildProjectSnapshot() {
  return {
    format: "sketch-ai-generator-project",
    formatVersion: 1,
    projectName: projectName.value,
    sketchMode: getSelectedValue("sketchMode"),
    apiModel: apiModelInput.value,
    enhancementLevel: enhancementLevel.value,
    stylePreset: stylePreset.value,
    extraPrompt: extraPrompt.value,
    canvasImage: canvas.toDataURL("image/png"),
    resultHistory: resultHistory.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    })),
    activeHistoryId,
    savedAt: new Date().toISOString()
  };
}

function saveProject() {
  const project = buildProjectSnapshot();
  localStorage.setItem(projectStorageKey, JSON.stringify(project));
  projectStatus.textContent = `已儲存進度：${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function loadImageToCanvas(dataUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      paintWhiteBackground();
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(true);
    };
    image.onerror = () => resolve(false);
    image.src = dataUrl;
  });
}

async function loadProject() {
  const raw = localStorage.getItem(projectStorageKey);
  if (!raw) {
    projectStatus.textContent = "目前沒有可載入的暫存進度。";
    return;
  }

  try {
    const project = JSON.parse(raw);
    await applyProjectSnapshot(project);
    projectStatus.textContent = "已載入暫存進度。";
  } catch (error) {
    console.error(error);
    projectStatus.textContent = "載入失敗，暫存資料可能已損毀。";
  }
}

async function applyProjectSnapshot(project) {
  if (project.format && project.format !== "sketch-ai-generator-project") {
    throw new Error("Unsupported project file.");
  }

  projectName.value = project.projectName || "";
  setSelectedValue("sketchMode", project.sketchMode || "black-white");
  apiModelInput.value = project.apiModel || "gpt-image-1.5";
  enhancementLevel.value = project.enhancementLevel || "4";
  stylePreset.value = project.stylePreset || "cute";
  extraPrompt.value = project.extraPrompt || "";

  if (project.canvasImage) {
    saveCanvasState();
    await loadImageToCanvas(project.canvasImage);
  }

  resultHistory = Array.isArray(project.resultHistory)
    ? project.resultHistory.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }))
    : [];
  activeHistoryId = project.activeHistoryId || "";

  updatePromptPreview();
  updateApiConfig();
  renderHistory();

    const activeItem = resultHistory.find((item) => item.id === activeHistoryId);
    if (activeItem) {
      renderCurrentResult(activeItem.imageUrl, activeItem.sourceUrl);
  } else if (resultHistory.length === 0) {
    renderEmptyResult();
  } else {
      activeHistoryId = resultHistory[0].id;
      renderCurrentResult(resultHistory[0].imageUrl, resultHistory[0].sourceUrl);
      renderHistory();
    }

  canvasStatus.textContent = "已載入專案草圖，可繼續修改";
}

function clearSavedProject() {
  localStorage.removeItem(projectStorageKey);
  projectStatus.textContent = "已清除瀏覽器暫存進度。";
}

async function exportProject() {
  const project = buildProjectSnapshot();
  const filename = `${project.projectName.trim() || "sketch-ai-project"}.json`;
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "專案 JSON",
            accept: { "application/json": [".json"] }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      projectStatus.textContent = `已儲存專案檔：${filename}`;
      showDownloadNotice(filename, "專案檔", "", true);
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        projectStatus.textContent = "已取消匯出專案。";
        return;
      }
      console.warn(error);
    }
  }

  downloadBlob(blob, filename);
  projectStatus.textContent = `已嘗試匯出專案檔：${filename}`;
  showDownloadNotice(filename, "專案檔", "", false);
}

function importProject(file) {
  if (file.size > 12 * 1024 * 1024) {
    projectStatus.textContent = "匯入檔案太大，請選擇此工具匯出的專案 JSON。";
    importProjectInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const project = JSON.parse(reader.result);
      await applyProjectSnapshot(project);
      projectStatus.textContent = `已匯入專案：${file.name}`;
    } catch (error) {
      console.error(error);
      projectStatus.textContent = "匯入失敗，請確認檔案是此工具匯出的 JSON。";
    } finally {
      importProjectInput.value = "";
    }
  };
  reader.onerror = () => {
    projectStatus.textContent = "讀取檔案失敗，請重新選擇。";
    importProjectInput.value = "";
  };
  reader.readAsText(file);
}

function paintWhiteBackground() {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function saveCanvasState() {
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (undoStack.length > 24) undoStack.shift();
}

function restoreCanvasState() {
  const previous = undoStack.pop();
  if (previous) ctx.putImageData(previous, 0, 0);
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}

function drawLine(from, to) {
  ctx.save();
  ctx.lineWidth = Number(brushSize.value);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (activeTool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = brushColor.value;
  }

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

function beginDrawing(event) {
  event.preventDefault();
  canvas.setPointerCapture?.(event.pointerId);
  saveCanvasState();
  drawing = true;
  lastPoint = getCanvasPoint(event);
}

function continueDrawing(event) {
  if (!drawing || !lastPoint) return;
  event.preventDefault();
  const nextPoint = getCanvasPoint(event);
  drawLine(lastPoint, nextPoint);
  lastPoint = nextPoint;
}

function endDrawing() {
  drawing = false;
  lastPoint = null;
}

function clearWorkspace() {
  saveCanvasState();
  paintWhiteBackground();
  imageInput.value = "";
  renderEmptyResult();
  setActiveTool("brush");
}

function getSketchMode() {
  return document.querySelector("input[name='sketchMode']:checked").value;
}

function getSketchModePrompt(mode) {
  if (mode === "black-white") {
    return {
      description: "The sketch is a black-and-white line sketch.",
      colorRule: "Treat the input as line art and do not infer existing color information from the sketch. The final output color should follow the selected visual style and enhancement level.",
      defaultDirection: "Create a refined illustration based on the sketch."
    };
  }

  return {
    description: "The sketch is a colored sketch.",
    colorRule: "Preserve and enhance the main color ideas from the input sketch while following the selected visual style and enhancement level.",
    defaultDirection: "Create a refined and cute character illustration based on the sketch."
  };
}

function buildPrompt() {
  const name = projectName.value.trim() || "untitled sketch";
  const mode = getSketchMode();
  const modePrompt = getSketchModePrompt(mode);
  const level = enhancementLevel.value;
  const style = stylePresets[stylePreset.value] || stylePresets.cute;
  const extra = extraPrompt.value.trim();

  return [
    `Artwork name: ${name}`,
    "Use the uploaded or drawn sketch as the main reference.",
    "Preserve the original composition and main shape.",
    modePrompt.description,
    modePrompt.colorRule,
    `Enhancement level: ${enhancementLevel.options[enhancementLevel.selectedIndex].text}.`,
    `Visual style: ${style.label}.`,
    enhancementPrompts[level],
    style.prompt,
    extra ? `Additional direction: ${extra}` : modePrompt.defaultDirection
  ].join("\n");
}

function buildAIRequestPayload() {
  return {
    appVersion: "prototype-stage-4",
    mode: "real",
    provider: aiConfig.provider,
    model: apiModelInput.value.trim() || aiConfig.model,
    hasApiKey: aiConfig.serverHasApiKey,
    projectName: projectName.value.trim() || "untitled sketch",
    sketchMode: getSketchMode(),
    enhancementLevel: Number(enhancementLevel.value),
    enhancementLabel: enhancementLevel.options[enhancementLevel.selectedIndex].text,
    stylePreset: stylePreset.value,
    styleLabel: stylePresets[stylePreset.value]?.label || "可愛插畫",
    extraPrompt: extraPrompt.value.trim(),
    prompt: buildPrompt(),
    sketchImageBase64: canvas.toDataURL("image/png"),
    createdAt: new Date().toISOString()
  };
}

function getSafePayloadLog(payload) {
  return {
    ...payload,
    sketchImageBase64: `[base64 image omitted, ${payload.sketchImageBase64.length} chars]`
  };
}

function updateApiConfig() {
  aiConfig.mode = "real";
  if (apiHelp) {
    apiHelp.textContent = aiConfig.serverHasApiKey
      ? ""
      : "尚未偵測到 .env 的 OPENAI_API_KEY。請設定後重新啟動本機 server。";
  }
}

function formatUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function renderCreditStatus(status) {
  if (!creditMeter || !creditRemaining || !creditDetail) return;

  creditMeter.classList.remove("is-warning", "is-error");

  if (!status?.available) {
    creditMeter.classList.add("is-error");
    creditRemaining.textContent = status?.budgetUsd ? `${formatUsd(status.budgetUsd)} 預算` : "無法讀取";
    creditDetail.textContent = status?.message || "請到 Usage Dashboard 確認";
    return;
  }

  const remaining = Number(status.remainingUsd || 0);
  const budget = Number(status.budgetUsd || 0);
  const spent = Number(status.spentUsd || 0);
  const ratio = budget > 0 ? remaining / budget : 0;

  if (ratio <= 0.2) creditMeter.classList.add("is-warning");

  creditRemaining.textContent = `${formatUsd(remaining)} ${status.estimated ? "估算剩餘" : "剩餘"}`;
  creditDetail.textContent = status.estimated
    ? `估算已用 ${formatUsd(spent)} / ${status.imageGenerations || 0} 次產圖`
    : `已用 ${formatUsd(spent)} / 總額 ${formatUsd(budget)}`;
}

async function refreshCreditStatus() {
  if (!creditRemaining || !creditDetail) return;

  try {
    creditRemaining.textContent = "讀取中";
    creditDetail.textContent = "OpenAI 用量";

    const response = await fetch(apiUrl("/api/credit-status"));
    const status = await response.json();
    renderCreditStatus(status);
  } catch (error) {
    renderCreditStatus({
      available: false,
      message: "無法連線到本機用量查詢"
    });
  }
}

async function refreshApiStatus() {
  try {
    const response = await fetch(apiUrl("/api/status"));
    if (!response.ok) throw new Error("API status unavailable.");

    const status = await response.json();
    aiConfig.serverAvailable = true;
    aiConfig.serverHasApiKey = Boolean(status.hasServerApiKey);
    aiConfig.model = status.defaultImageModel || aiConfig.model;
    if (!apiModelInput.value.trim()) {
      apiModelInput.value = aiConfig.model;
    }
  } catch (error) {
    aiConfig.serverAvailable = false;
    aiConfig.serverHasApiKey = false;
    console.warn("Could not read local API status:", error);
  } finally {
    updateApiConfig();
  }
}

function updatePromptPreview() {
  promptText.textContent = buildPrompt();
  levelNote.textContent = enhancementNotes[enhancementLevel.value];
  styleNote.textContent = (stylePresets[stylePreset.value] || stylePresets.cute).note;
}

function applyMockEnhancement(sourceCanvas, level, styleKey = "cute") {
  const output = document.createElement("canvas");
  output.width = sourceCanvas.width;
  output.height = sourceCanvas.height;
  const outputCtx = output.getContext("2d");
  const filters = {
    1: "contrast(1.18) brightness(1.04) grayscale(0.25)",
    2: "contrast(1.55) brightness(1.08) saturate(0.3)",
    3: "contrast(1.12) brightness(1.04) saturate(1.45)",
    4: "contrast(1.2) brightness(1.08) saturate(1.35)",
    5: "contrast(1.28) brightness(1.1) saturate(1.75)"
  };
  const styleFilters = {
    cute: " saturate(1.12) brightness(1.04)",
    anime: " saturate(1.35) contrast(1.12)",
    watercolor: " saturate(0.85) brightness(1.08)",
    storybook: " sepia(0.12) saturate(1.1)",
    toy3d: " saturate(1.22) brightness(1.12)",
    realistic: " contrast(1.08) saturate(0.95)",
    photoreal: " contrast(1.12) saturate(1.02) brightness(0.98)",
    cinematic: " contrast(1.32) saturate(1.18) brightness(0.96)",
    sketch: " grayscale(1) contrast(1.35) brightness(1.05)",
    sticker: " contrast(1.4) saturate(1.4) brightness(1.08)",
    pixel: " contrast(1.5) saturate(1.2)",
    comic: " contrast(1.65) saturate(1.28)",
    oilpaint: " contrast(1.15) saturate(1.25) sepia(0.08)",
    clay: " contrast(0.95) saturate(1.05) brightness(1.1)",
    fantasy: " contrast(1.22) saturate(1.42)",
    cyberpunk: " contrast(1.45) saturate(1.7)",
    minimal: " contrast(1.3) saturate(0.8) brightness(1.12)"
  };

  outputCtx.fillStyle = "#ffffff";
  outputCtx.fillRect(0, 0, output.width, output.height);
  outputCtx.filter = `${filters[level] || filters[4]}${styleFilters[styleKey] || styleFilters.cute}`;
  outputCtx.drawImage(sourceCanvas, 0, 0);
  outputCtx.filter = "none";

  if (level >= 3) {
    const gradient = outputCtx.createLinearGradient(0, 0, output.width, output.height);
    const styleGradient = {
      cute: ["rgba(255, 214, 143, 0.18)", "rgba(255, 143, 178, 0.12)"],
      anime: ["rgba(255, 143, 178, 0.18)", "rgba(116, 197, 255, 0.18)"],
      watercolor: ["rgba(143, 196, 255, 0.12)", "rgba(255, 255, 255, 0.18)"],
      storybook: ["rgba(231, 178, 112, 0.16)", "rgba(126, 169, 116, 0.12)"],
      toy3d: ["rgba(255, 255, 255, 0.22)", "rgba(128, 210, 255, 0.14)"],
      realistic: ["rgba(255, 244, 220, 0.10)", "rgba(70, 70, 70, 0.08)"],
      photoreal: ["rgba(255, 255, 255, 0.08)", "rgba(30, 30, 30, 0.06)"],
      cinematic: ["rgba(24, 36, 56, 0.16)", "rgba(255, 176, 92, 0.12)"],
      sketch: ["rgba(255, 255, 255, 0.12)", "rgba(0, 0, 0, 0.08)"],
      sticker: ["rgba(255, 255, 255, 0.22)", "rgba(255, 223, 93, 0.14)"],
      pixel: ["rgba(70, 70, 70, 0.08)", "rgba(255, 255, 255, 0.08)"],
      comic: ["rgba(255, 230, 80, 0.16)", "rgba(255, 64, 64, 0.10)"],
      oilpaint: ["rgba(138, 93, 55, 0.12)", "rgba(255, 220, 150, 0.10)"],
      clay: ["rgba(255, 224, 198, 0.18)", "rgba(255, 255, 255, 0.16)"],
      fantasy: ["rgba(151, 105, 255, 0.14)", "rgba(72, 214, 164, 0.12)"],
      cyberpunk: ["rgba(255, 0, 180, 0.14)", "rgba(0, 210, 255, 0.16)"],
      minimal: ["rgba(255, 255, 255, 0.22)", "rgba(0, 0, 0, 0.04)"]
    }[styleKey] || ["rgba(255, 214, 143, 0.16)", "rgba(72, 169, 153, 0.12)"];
    gradient.addColorStop(0, styleGradient[0]);
    gradient.addColorStop(1, styleGradient[1]);
    outputCtx.fillStyle = gradient;
    outputCtx.fillRect(0, 0, output.width, output.height);
  }

  if (level >= 4) {
    outputCtx.strokeStyle = "rgba(13, 92, 84, 0.34)";
    outputCtx.lineWidth = 18;
    outputCtx.strokeRect(26, 26, output.width - 52, output.height - 52);
  }

  if (level === 5) {
    outputCtx.fillStyle = "rgba(255, 255, 255, 0.42)";
    outputCtx.beginPath();
    outputCtx.ellipse(output.width * 0.78, output.height * 0.18, 150, 70, -0.3, 0, Math.PI * 2);
    outputCtx.fill();
  }

  if (styleKey === "watercolor") {
    outputCtx.fillStyle = "rgba(255, 255, 255, 0.18)";
    for (let index = 0; index < 12; index += 1) {
      outputCtx.beginPath();
      outputCtx.arc((index * 97) % output.width, (index * 53) % output.height, 48, 0, Math.PI * 2);
      outputCtx.fill();
    }
  }

  if (styleKey === "sticker" || styleKey === "minimal") {
    outputCtx.strokeStyle = styleKey === "sticker" ? "rgba(255, 255, 255, 0.86)" : "rgba(36, 33, 29, 0.22)";
    outputCtx.lineWidth = styleKey === "sticker" ? 26 : 10;
    outputCtx.strokeRect(34, 34, output.width - 68, output.height - 68);
  }

  return output.toDataURL("image/png");
}

async function generateMockImage(payload) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    imageUrl: applyMockEnhancement(canvas, payload.enhancementLevel, payload.stylePreset),
    prompt: payload.prompt,
    payload,
    source: "mock"
  };
}

async function generateRealAIImage(payload) {
  console.log("Ready for real AI API payload:", getSafePayloadLog(payload));
  const response = await fetch(apiUrl("/api/generate-image"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({
    error: "本機 API 回傳格式不正確，請確認 preview-server.js 是否正在執行。"
  }));
  if (!response.ok) {
    throw new Error(data.error || "Real AI API request failed.");
  }

  return {
    imageUrl: data.imageUrl,
    prompt: payload.prompt,
    revisedPrompt: data.revisedPrompt || "",
    payload,
    source: data.source || "openai"
  };
}

async function generateAIImage(payload) {
  return generateRealAIImage(payload);
}

async function downloadCanvas() {
  const filename = `${projectName.value.trim() || "sketch"}-草圖.png`;
  const dataUrl = canvas.toDataURL("image/png");

  if (window.showSaveFilePicker) {
    const savedWithPicker = await saveCanvasWithPicker(filename, dataUrl);
    canvasStatus.textContent = savedWithPicker ? "草圖已儲存" : "已取消或改用手動儲存草圖";
    showDownloadNotice(filename, "草圖", dataUrl, savedWithPicker);
    return;
  }

  const blob = await canvasToBlob(canvas);
  if (!blob) return;
  const savedWithPicker = await saveBlob(blob, filename, dataUrl);
  canvasStatus.textContent = savedWithPicker ? "草圖已儲存" : "已嘗試下載草圖";
  showDownloadNotice(filename, "草圖", dataUrl, savedWithPicker);
}

function dataUrlToBlob(dataUrl) {
  const [meta, content] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] || "image/png";
  const binary = atob(content);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

function canvasToBlob(targetCanvas) {
  return new Promise((resolve) => {
    targetCanvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function saveBlob(blob, filename, dataUrl) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "PNG 圖片",
            accept: { "image/png": [".png"] }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (error) {
      if (error?.name === "AbortError") return false;
      console.warn(error);
    }
  }

  downloadBlob(blob, filename);
  latestDownloadUrl = dataUrl;
  return false;
}

async function saveCanvasWithPicker(filename, dataUrl) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: "PNG 圖片",
          accept: { "image/png": [".png"] }
        }
      ]
    });
    const blob = await canvasToBlob(canvas);
    if (!blob) return false;
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  } catch (error) {
    latestDownloadUrl = dataUrl;
    if (error?.name !== "AbortError") console.warn(error);
    return false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadResult() {
  if (!latestResultUrl) return;
  const blob = dataUrlToBlob(latestResultUrl);
  const filename = `${projectName.value.trim() || "ai-preview"}-結果.png`;
  const savedWithPicker = await saveBlob(blob, filename, latestResultUrl);
  showDownloadNotice(filename, "結果", latestResultUrl, savedWithPicker);
  if (resultNote) {
    resultNote.textContent = savedWithPicker
      ? "結果已儲存到你選擇的位置。"
      : "已嘗試下載結果；如果下載資料夾沒有檔案，請使用上方的「開啟圖片」後手動儲存。";
  }
}

function showDownloadNotice(filename, type, dataUrl, savedWithPicker = false) {
  downloadNotice.hidden = false;
  downloadNoticeTitle.textContent = savedWithPicker ? `已儲存${type}：${filename}` : `已嘗試下載${type}：${filename}`;
  downloadNoticeText.textContent = savedWithPicker
    ? "檔案已儲存在你剛剛選擇的位置。基於瀏覽器安全限制，網頁仍無法讀取並顯示完整資料夾路徑。"
    : "如果下載資料夾沒有看到檔案，可能是瀏覽器擋住自動下載。請按「開啟圖片」，再用右鍵或分享選單儲存圖片。PC 或平板通常在「下載 / Downloads」；手機通常在瀏覽器下載項目、檔案 App，或系統 Downloads。";
  latestDownloadUrl = dataUrl;
  openDownloadImageBtn.hidden = !dataUrl;
  downloadNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function useResultAsSketch() {
  if (!latestResultUrl) return;
  const image = new Image();
  image.onload = () => {
    saveCanvasState();
    paintWhiteBackground();
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvasStatus.textContent = "已將結果套用到畫板，可繼續修改";
  };
  image.src = latestResultUrl;
}

function loadUploadedImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      saveCanvasState();
      paintWhiteBackground();
      const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;
      ctx.drawImage(image, x, y, width, height);
      canvasStatus.textContent = "已載入上傳圖片，可繼續繪製";
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

sourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sourceButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    uploadPanel.hidden = button.dataset.source !== "upload";
  });
});

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTool(button.dataset.tool);
  });
});

canvas.addEventListener("pointerdown", beginDrawing);
canvas.addEventListener("pointermove", continueDrawing);
canvas.addEventListener("pointerup", endDrawing);
canvas.addEventListener("pointercancel", endDrawing);
canvas.addEventListener("pointerleave", endDrawing);

brushSize.addEventListener("input", () => {
  brushSizeValue.textContent = brushSize.value;
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (file) loadUploadedImage(file);
});

undoBtn.addEventListener("click", restoreCanvasState);
clearBtn.addEventListener("click", clearWorkspace);
downloadSketchBtn.addEventListener("click", downloadCanvas);
downloadResultBtn.addEventListener("click", downloadResult);
useResultBtn.addEventListener("click", useResultAsSketch);
saveProjectBtn.addEventListener("click", saveProject);
loadProjectBtn.addEventListener("click", loadProject);
clearProjectBtn.addEventListener("click", clearSavedProject);
exportProjectBtn.addEventListener("click", exportProject);
importProjectInput.addEventListener("change", () => {
  const file = importProjectInput.files?.[0];
  if (file) importProject(file);
});
clearHistoryBtn.addEventListener("click", () => {
  resultHistory = [];
  activeHistoryId = "";
  renderHistory();
});
closeDownloadNotice.addEventListener("click", () => {
  downloadNotice.hidden = true;
});

openDownloadImageBtn.addEventListener("click", () => {
  if (!latestDownloadUrl) return;
  const opened = window.open(latestDownloadUrl, "_blank");
  if (!opened) {
    downloadNoticeText.textContent = "瀏覽器阻擋了新視窗。請允許彈出視窗，或在結果圖片上長按/右鍵後選擇儲存圖片。";
  }
});

flowSteps.forEach((step) => {
  step.addEventListener("click", () => {
    const target = jumpTargets[step.dataset.jumpTarget];
    if (!target) return;
    flowSteps.forEach((item) => item.classList.toggle("is-current", item === step));
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

historyList.addEventListener("click", (event) => {
  const item = event.target.closest(".history-item");
  if (!item) return;
  selectHistoryItem(item.dataset.historyId);
});

resultViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setResultViewMode(button.dataset.resultView);
  });
});

backTopButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".topbar").scrollIntoView({ behavior: "smooth", block: "start" });
    flowSteps.forEach((item) => item.classList.toggle("is-current", item.dataset.jumpTarget === "studio"));
  });
});

[projectName, enhancementLevel, stylePreset, extraPrompt, ...document.querySelectorAll("input[name='sketchMode']")].forEach((input) => {
  input.addEventListener("input", updatePromptPreview);
  input.addEventListener("change", updatePromptPreview);
});

apiModelInput.addEventListener("input", () => {
  aiConfig.model = apiModelInput.value.trim() || "gpt-image-1.5";
});

copyPromptBtn.addEventListener("click", async () => {
  const copied = await copyText(promptText.textContent);
  copyPromptBtn.textContent = copied ? "已複製" : "請手動複製";
  copyPromptBtn.title = copied ? "Prompt 已複製到剪貼簿" : "瀏覽器阻擋自動複製，請選取 Prompt 文字後手動複製";
  setTimeout(() => {
    copyPromptBtn.textContent = "複製";
    copyPromptBtn.title = "";
  }, 1600);
});

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn(error);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    console.warn(error);
  }

  textarea.remove();
  return copied;
}

generateBtn.addEventListener("click", async () => {
  generateBtn.disabled = true;
  generateBtn.textContent = "修飾中...";
  resultPreview.innerHTML = `
    <div class="empty-result is-loading">
      <span aria-hidden="true">◇</span>
      <strong>正在產生預覽</strong>
      <small>目前會先顯示原始草圖，之後可接上真正 AI API。</small>
    </div>
  `;

  try {
    const payload = buildAIRequestPayload();
    console.log("AI request payload:", getSafePayloadLog(payload));
    const result = await generateAIImage(payload);

    renderCurrentResult(result.imageUrl, payload.sketchImageBase64);
    addResultHistoryItem(result, payload);
    if (resultNote) resultNote.textContent = `目前顯示第 ${payload.enhancementLevel} 級 OpenAI 產生結果。`;
    refreshCreditStatus();
  } catch (error) {
    console.error(error);
    let message = "請再按一次開始 AI 修飾，或先清除畫板後重試。";
    if (error.message.includes("Missing OpenAI API key")) {
      message = "真正 AI API 需要 API Key。請在 .env 設定 OPENAI_API_KEY 後重新啟動本機服務。";
    } else {
      message = `真正 AI API 產生失敗：${error.message}`;
    }
    resultPreview.innerHTML = `
      <div class="empty-result">
        <span aria-hidden="true">!</span>
        <strong>產生預覽時發生問題</strong>
        <small>${message}</small>
      </div>
    `;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "開始 AI 修飾";
  }
});

paintWhiteBackground();
saveCanvasState();
updatePromptPreview();
updateApiConfig();
refreshApiStatus();
refreshCreditStatus();
renderHistory();
