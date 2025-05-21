// تنظیمات اولیه
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

// ساختار گره
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walkable = true;
    this.g = Infinity; // هزینه طی مسیر از شروع تا این گره
    this.h = 0; // تخمین فاصله تا هدف (Heuristic)
    this.f = Infinity; // مجموع g + h
    this.parent = null;
    this.closed = false;
  }
}

let grid = [];
let startNode = null;
let endNode = null;
let closedSeq = [];
let placing = "start";

// تابع راه‌اندازی گرید
function initGrid() {
  grid = [];
  closedSeq = [];
  startNode = null;
  endNode = null;
  placing = "start";
  document.getElementById("runBtn").disabled = true;
  document.getElementById("info").innerHTML = "";
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push(new Node(x, y));
    }
    grid.push(row);
  }
  drawGrid();
}

// رسم گرید و گره‌های شروع/پایان
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach((row) => {
    row.forEach((node) => {
      ctx.fillStyle = node.walkable ? "#eee" : "#333";
      ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
    });
  });
  if (startNode) drawCircle(startNode, "green");
  if (endNode) drawCircle(endNode, "red");
}

// رسم دایره رنگی روی گره
function drawCircle(node, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    node.x * tileSize + tileSize / 2,
    node.y * tileSize + tileSize / 2,
    tileSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// مدیریت کلیک روی بوم
canvas.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / tileSize);
  const y = Math.floor(e.offsetY / tileSize);
  const node = grid[y][x];
  if (placing === "start") {
    startNode = node;
    placing = "end";
  } else if (placing === "end") {
    endNode = node;
    placing = "wall";
    document.getElementById("runBtn").disabled = false;
  } else if (node !== startNode && node !== endNode) {
    node.walkable = !node.walkable;
  }
  drawGrid();
});

// دکمه بازنشانی
document.getElementById("resetBtn").addEventListener("click", initGrid);

// دکمه ساخت نقشه تصادفی
document.getElementById("randomBtn").addEventListener("click", () => {
  if (!startNode || !endNode) {
    alert("ابتدا نقطهٔ شروع و پایان را مشخص کنید.");
    return;
  }
  grid.forEach((row) => {
    row.forEach((node) => {
      node.walkable =
        node === startNode || node === endNode ? true : Math.random() < 0.7;
    });
  });
  closedSeq = [];
  document.getElementById("info").innerHTML = "";
  drawGrid();
});

// دکمه اجرا: اجرای A*
document.getElementById("runBtn").addEventListener("click", () => {
  resetNodes();
  closedSeq = [];
  const path = astar(startNode, endNode);
  drawGrid();
  drawClosed();
  drawPath(path);
  showInfo(path);
});

// نمایش جدول اطلاعات
function showInfo(path) {
  const researchPath = closedSeq.map((n) => `(${n.x},${n.y})`).join(" → ");
  const solutionPath = path.map((n) => `(${n.x},${n.y})`).join(" → ");
  const cost = endNode.g || 0;

  const completeness = "Yes";
  const optimization = "Yes";

  const depth = path.length > 0 ? path.length - 1 : 0;
  const nodesVisited = closedSeq.length;

  // محاسبه branching factor واقعی بر اساس تعداد میانگین همسایه‌های walkable در مسیر جستجو
  let totalNeighbors = 0;
  closedSeq.forEach((node) => {
    totalNeighbors += getNeighbors(node).length;
  });
  const realBranchingFactor =
    closedSeq.length > 0 ? (totalNeighbors / closedSeq.length).toFixed(2) : 0;

  const timeComplexity = `O(b^m), b ≈ ${realBranchingFactor}, m = ${depth} → ≈ ${nodesVisited} گره`;
  const spaceComplexity = `O(b^m), b ≈ ${realBranchingFactor}, m = ${depth} → ≈ ${nodesVisited} گره`;

  document.getElementById("info").innerHTML = `
        <table>
          <tr><th class="th-a">شرح</th><th class="th-b">مقدار</th></tr>
          <tr><td>مسیر جستجو</td><td>${researchPath}</td></tr>
          <tr><td>مسیر راه‌حل</td><td>${solutionPath}</td></tr>
          <tr><td>هزینه مسیر</td><td>${cost}</td></tr>
          <tr><td>کامل بودن</td><td>${completeness}</td></tr>
          <tr><td>بهینه‌سازی</td><td>${optimization}</td></tr>
          <tr><td>پیچیدگی زمانی</td><td>${timeComplexity}</td></tr>
          <tr><td>پیچیدگی مکانی</td><td>${spaceComplexity}</td></tr>
        </table>
      `;
}

// رسم گره‌های بسته شده به رنگ آبی
function drawClosed() {
  closedSeq.forEach((node) => {
    if (node !== startNode && node !== endNode) {
      ctx.fillStyle = "rgba(0,0,255,0.3)";
      ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
    }
  });
}

// بازنشانی اطلاعات گره‌ها
function resetNodes() {
  grid.flat().forEach((node) => {
    node.g = Infinity;
    node.h = 0;
    node.f = Infinity;
    node.parent = null;
    node.closed = false;
  });
}

// تابع هوریستیک Manhattan
function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// گرفتن همسایه‌های چهارجهت
function getNeighbors(node) {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  return dirs
    .map((d) => grid[node.y + d[1]]?.[node.x + d[0]])
    .filter((n) => n && n.walkable);
}

// پیاده‌سازی الگوریتم A*
function astar(start, goal) {
  const openList = [];
  start.g = 0;
  start.h = heuristic(start, goal);
  start.f = start.h;
  openList.push(start);

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift();
    if (current === goal) {
      return reconstructPath(goal);
    }
    current.closed = true;
    closedSeq.push(current);
    getNeighbors(current).forEach((neighbor) => {
      if (neighbor.closed) return;
      const tentativeG = current.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        }
      }
    });
  }
  return [];
}

// بازسازی مسیر از هدف تا شروع
function reconstructPath(goal) {
  const path = [];
  let current = goal;
  while (current) {
    path.push(current);
    current = current.parent;
  }
  return path.reverse();
}

// رسم مسیر نهایی به رنگ سبز
function drawPath(path) {
  path.forEach((node) => {
    ctx.fillStyle = "rgba(0,255,0,0.5)";
    ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
  });
}

// اجرای اولیه گرید
initGrid();
