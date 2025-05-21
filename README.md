📌 الگوریتم A* در محیط گرافیکی (JavaScript + HTML Canvas)
این پروژه پیاده‌سازی کامل الگوریتم جستجوی A* (ای‌استار) در یک گرید دو‌بعدی است که کاربر می‌تواند گره‌های شروع، پایان و دیوارها را به صورت بصری مشخص کند. این پروژه با استفاده از HTML5 Canvas و زبان JavaScript نوشته شده است.

🎯 اهداف پروژه
آموزش مفاهیم مسیر‌یابی (Pathfinding)

نمایش بصری الگوریتم A*

تمرین عملی با JavaScript و گرافیک Canvas

🧠 الگوریتم A* چیست؟
الگوریتم A* یکی از معروف‌ترین روش‌های یافتن کوتاه‌ترین مسیر بین دو نقطه در گراف است. این الگوریتم از دو تابع استفاده می‌کند:

g(n): هزینه طی مسیر از گره شروع تا گره فعلی

h(n): تخمین هزینه باقی‌مانده از گره فعلی تا مقصد (تابع heuristic)

فرمول:
f(n) = g(n) + h(n)

🧱 ساختار پروژه
1. تنظیمات اولیه برای کار با بوم نقاشی (Canvas)
```sh
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;
canvas: ما یک عنصر در صفحه وب داریم به اسم "mapCanvas" که بهش بوم نقاشی (Canvas) می‌گوییم. اینجا با getElementById آن را می‌گیریم تا بتونیم روی آن نقاشی کنیم.

ctx: این همان چیزی است که می‌گوید چگونه روی بوم نقاشی کنیم (رنگ، خطوط، مستطیل و ...).

tileSize: اندازه هر خانه از جدول یا گرید که می‌خواهیم روی بوم رسم کنیم، اینجا ۲۰ پیکسل تنظیم شده.

rows و cols: تعداد ردیف‌ها و ستون‌های جدول را از اندازه بوم به نسبت اندازه هر خانه حساب می‌کند.
```
2. تعریف کلاس Node (گره یا خانه جدول)
```shclass Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walkable = true;
    this.g = Infinity;
    this.h = 0;
    this.f = Infinity;
    this.parent = null;
    this.closed = false;
  }
}
```
این بخش یک قالب یا مدل برای هر خانه در جدول است که می‌خواهیم استفاده کنیم.

x و y: مختصات این خانه در جدول (مثلاً ردیف و ستون).

walkable: آیا این خانه قابل عبور است یا نه (مثل دیوار یا راه).

g: هزینه مسیر از نقطه شروع تا این خانه (مقداری که اولاً بسیار بزرگ است چون هنوز مقداردهی نشده).

h: تخمینی که می‌زنیم چقدر با نقطه پایان فاصله دارد (این عدد بعداً محاسبه می‌شود).

f: مجموع g و h که نشان‌دهنده بهترین مسیر پیشنهادی است.

parent: خانه‌ای که از آن به این خانه رسیده‌ایم (برای پیدا کردن مسیر نهایی).

closed: آیا این خانه قبلاً بررسی شده یا خیر.

3. متغیرهای اصلی برنامه
```sh
let grid = [];
let startNode = null;
let endNode = null;
let closedSeq = [];
let placing = "start";
```
grid: آرایه‌ای دو بعدی که تمام خانه‌ها (گره‌ها) را نگه می‌دارد.

startNode: خانه‌ای که نقطه شروع است (هنوز انتخاب نشده).

endNode: خانه‌ای که نقطه پایان است (هنوز انتخاب نشده).

closedSeq: لیستی از خانه‌هایی که الگوریتم بررسی کرده و بسته شده‌اند (برای نمایش مراحل جستجو).

placing: حالت انتخاب خانه‌ها (مثلاً ابتدا شروع، سپس پایان، سپس دیوار).

4. تابع initGrid — راه‌اندازی یا بازنشانی جدول
```sh
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
```
توضیح ساده:
این تابع وظیفه دارد که جدول خانه‌ها را از اول بسازد و همه چیز را آماده کند.

اول آرایه‌ی grid را خالی می‌کند. این آرایه بعداً همه‌ی خانه‌ها را ذخیره می‌کند.

لیست closedSeq که خانه‌های بررسی شده را نگه می‌دارد هم پاک می‌شود.

نقاط شروع و پایان (startNode و endNode) را پاک می‌کند، چون هنوز انتخاب نشده‌اند.

حالت قرار دادن خانه‌ها (placing) را روی "start" می‌گذارد، یعنی انتظار دارد کاربر اول نقطه شروع را انتخاب کند.

دکمه اجرای الگوریتم (runBtn) را غیرفعال می‌کند چون هنوز همه چیز آماده نیست.

متن اطلاعات زیر جدول را پاک می‌کند تا جای جدید آماده شود.

سپس یک حلقه دوبله می‌زند:

برای هر ردیف (y) و هر ستون (x) یک خانه جدید از نوع Node می‌سازد و به آرایه ردیف اضافه می‌کند.

بعد از کامل شدن یک ردیف، آن را به جدول اصلی (grid) اضافه می‌کند.

در آخر جدول را رسم می‌کند (تابع drawGrid را صدا می‌زند).

5. تابع drawGrid — رسم جدول روی صفحه
```sh
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
```
توضیح ساده:
این تابع همه‌ی خانه‌ها را روی بوم نقاشی (canvas) رسم می‌کند.

اول کل صفحه را پاک می‌کند (clearRect) تا چیزی روی هم انباشته نشود.

بعد در هر خانه از جدول (grid) به این صورت عمل می‌کند:

اگر خانه قابل عبور باشد (walkable = true)، آن را رنگ روشن خاکستری #eee می‌کند.

اگر غیرقابل عبور (مثل دیوار) باشد، رنگ تیره‌تر خاکستری #333 می‌شود.

بعد از رنگ کردن داخل خانه، دور خانه یک خط با رنگ خاکستری روشن (#ccc) می‌کشد تا خانه‌ها از هم جدا دیده شوند.

در نهایت، اگر نقطه شروع (startNode) وجود داشته باشد، روی آن یک دایره سبز می‌کشد.

اگر نقطه پایان (endNode) مشخص شده باشد، روی آن یک دایره قرمز می‌کشد.

6. تابع drawCircle — رسم دایره رنگی داخل خانه
```sh
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
```
توضیح ساده:
این تابع یک دایره رنگی وسط یک خانه می‌کشد.

پارامتر node خانه‌ای است که باید دایره داخل آن کشیده شود.

پارامتر color رنگ دایره را مشخص می‌کند (مثلاً سبز یا قرمز).

دایره وسط خانه قرار می‌گیرد (با استفاده از مختصات خانه و اندازه خانه).

اندازه دایره حدود یک سوم اندازه خانه است.

با این دایره مشخص می‌شود که خانه شروع یا پایان است.

7. مدیریت کلیک کاربر روی بوم (canvas)
```sh
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
```
توضیح ساده:
این بخش یعنی وقتی کاربر روی بوم کلیک می‌کند، چه اتفاقی بیفتد.

e.offsetX و e.offsetY مختصات کلیک روی بوم را به پیکسل می‌دهد.

با تقسیم این مقدار به اندازه هر خانه (tileSize) و گرفتن قسمت صحیح (Math.floor)، مشخص می‌شود که روی کدام خانه کلیک شده است.

سپس آن خانه از جدول (grid) گرفته می‌شود.

حالا بر اساس مرحله قرار دادن (placing) کاری انجام می‌دهد:

اگر در مرحله انتخاب نقطه شروع ("start") هستیم:

خانه کلیک شده را به عنوان شروع قرار می‌دهد (startNode = node)

سپس حالت را می‌گذارد روی انتخاب پایان (placing = "end").

اگر در مرحله انتخاب پایان هستیم:

خانه کلیک شده را به عنوان پایان قرار می‌دهد (endNode = node)

سپس می‌رود به مرحله ساخت دیوار (placing = "wall")

دکمه اجرای الگوریتم فعال می‌شود چون حالا شروع و پایان مشخص شده.

اگر در مرحله ساخت دیوار هستیم (placing === "wall"):

اگر خانه‌ای کلیک شود که نقطه شروع یا پایان نیست، وضعیت قابل عبور بودن آن خانه تغییر می‌کند. یعنی اگر دیوار بود به راه تبدیل می‌شود و اگر راه بود به دیوار.

بعد از هر کلیک، جدول دوباره رسم می‌شود تا تغییرات دیده شود.

8. دکمه‌های صفحه: بازنشانی، نقشه تصادفی، اجرا
```sh
document.getElementById("resetBtn").addEventListener("click", initGrid);

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

document.getElementById("runBtn").addEventListener("click", () => {
  resetNodes();
  closedSeq = [];
  const path = astar(startNode, endNode);
  drawGrid();
  drawClosed();
  drawPath(path);
  showInfo(path);
});
```
توضیح ساده:
دکمه بازنشانی (resetBtn):

وقتی این دکمه کلیک شود، تابع initGrid اجرا می‌شود.

یعنی همه جدول پاک و از نو ساخته می‌شود.

تمام خانه‌ها قابل عبور می‌شوند و نقاط شروع و پایان حذف می‌شوند.

دکمه نقشه تصادفی (randomBtn):

وقتی کلیک شود، اول چک می‌کند که آیا نقطه شروع و پایان انتخاب شده‌اند یا نه.

اگر نه، به کاربر هشدار می‌دهد که ابتدا باید آن‌ها را انتخاب کند.

اگر انتخاب شده‌اند، در هر خانه غیر از شروع و پایان با احتمال ۷۰٪ خانه‌ها را قابل عبور و ۳۰٪ را دیوار می‌کند.

اطلاعات قبلی پاک شده و جدول دوباره رسم می‌شود.

این کار باعث می‌شود یک نقشه‌ی تصادفی با دیوارهای پراکنده داشته باشیم.

دکمه اجرا (runBtn):

وقتی کلیک شود، ابتدا داده‌های قبلی گره‌ها را بازنشانی می‌کند (resetNodes).

لیست خانه‌های بررسی شده (closedSeq) را پاک می‌کند.

سپس الگوریتم A* را اجرا می‌کند و مسیر را پیدا می‌کند.

بعد جدول را دوباره رسم می‌کند.

خانه‌های بسته شده (بررسی شده) را رنگ می‌کند (drawClosed).

مسیر نهایی پیدا شده را روی جدول نشان می‌دهد (drawPath).

اطلاعات مسیر و نتایج را به کاربر نمایش می‌دهد (showInfo).

9. تابع نمایش اطلاعات مسیر و جستجو: showInfo(path)
```sh
function showInfo(path) {
  const researchPath = closedSeq.map((n) => `(${n.x},${n.y})`).join(" → ");
  const solutionPath = path.map((n) => `(${n.x},${n.y})`).join(" → ");
  const cost = endNode.g || 0;

  const completeness = "Yes";
  const optimization = "Yes";

  const depth = path.length > 0 ? path.length - 1 : 0;
  const nodesVisited = closedSeq.length;

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
```
توضیح خط به خط:
researchPath:
این خط یک متن می‌سازد که نشان می‌دهد الگوریتم در چه خانه‌هایی جستجو کرده است (یعنی تمام خانه‌هایی که باز شده‌اند و بررسی شده‌اند).
کارش این است که آرایه closedSeq (که تمام خانه‌های بسته شده را نگه می‌دارد) را می‌گیرد و برای هر خانه مختصاتش را به شکل (x,y) تبدیل می‌کند و بین آن‌ها فلش → می‌گذارد.

solutionPath:
این متن مسیر نهایی است که الگوریتم پیدا کرده (مسیر راه‌حل). این مسیر شامل خانه‌هایی است که از شروع به پایان می‌رسند.

cost:
هزینه مسیر است که در واقع هزینه کل طی شده از نقطه شروع تا نقطه پایان است. این مقدار در گره پایان (endNode) ذخیره شده.

completeness و optimization:
این دو ثابت تعریف شده‌اند که الگوریتم کامل است (می‌تواند همیشه جواب پیدا کند اگر وجود داشته باشد) و بهینه است (مسیر کم هزینه‌تر را پیدا می‌کند). اینجا فقط مقدار "Yes" ثابت نوشته شده.

depth:
عمق مسیر یعنی تعداد خانه‌هایی که در مسیر راه‌حل وجود دارد منهای ۱ (چون تعداد یال یا حرکت‌ها یکی کمتر از تعداد خانه‌ها است).

nodesVisited:
تعداد کل خانه‌هایی که الگوریتم بررسی کرده (خانه‌هایی که در closedSeq هستند).

محاسبه فاکتور انشعاب واقعی (branching factor):
الگوریتم سعی می‌کند میانگین تعداد همسایه‌های قابل حرکت در خانه‌های بررسی شده را حساب کند:

```sh
let totalNeighbors = 0;
closedSeq.forEach((node) => {
  totalNeighbors += getNeighbors(node).length;
});
```
اینجا برای هر خانه تعداد همسایه‌های قابل عبور را جمع می‌کند.
سپس میانگین را می‌گیرد:

```sh
const realBranchingFactor = closedSeq.length > 0 ? (totalNeighbors / closedSeq.length).toFixed(2) : 0;
```
پیچیدگی زمانی و مکانی:
این پیچیدگی‌ها را به صورت فرمول‌های استاندارد O(b^m) نمایش می‌دهد که در آن:

b فاکتور انشعاب واقعی است (چند مسیر از هر گره می‌تواند باز شود)

m عمق مسیر است
و همچنین تقریب تعداد گره‌های بازدید شده (nodesVisited) را نشان می‌دهد.

در نهایت:
این اطلاعات را به صورت یک جدول داخل صفحه وب نمایش می‌دهد.

10. رسم خانه‌های بسته شده (گره‌های بازدید شده): drawClosed()
```sh
function drawClosed() {
  closedSeq.forEach((node) => {
    if (node !== startNode && node !== endNode) {
      ctx.fillStyle = "rgba(0,0,255,0.3)";
      ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
    }
  });
}
```
این تابع خانه‌هایی که الگوریتم بررسی کرده و بسته شده‌اند را به رنگ آبی شفاف روی جدول می‌کشد.

خانه‌های شروع و پایان را رنگ نمی‌کند.

11. بازنشانی مقادیر گره‌ها: resetNodes()

```sh
function resetNodes() {
  grid.flat().forEach((node) => {
    node.g = Infinity;
    node.h = 0;
    node.f = Infinity;
    node.parent = null;
    node.closed = false;
  });
}
```
این تابع تمام خانه‌ها را به حالت اولیه برمی‌گرداند.

مقدار هزینه‌ها را بسیار بزرگ یا صفر می‌کند.

گره‌ها را باز (closed = false) می‌کند و هیچ خانه‌ای را به عنوان والد نگه نمی‌دارد.

این کار قبل از اجرای الگوریتم انجام می‌شود تا داده‌های قبلی پاک شوند.

12. تابع محاسبه فاصله تخمینی (Heuristic): heuristic(a, b)
```sh
function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
```
این تابع فاصله تقریبی بین دو خانه را حساب می‌کند (فاصله منهتن).

یعنی فاصله افقی به علاوه فاصله عمودی را جمع می‌زند.

این تخمین به الگوریتم کمک می‌کند تا مسیر را بهتر پیدا کند و سریع‌تر به هدف برسد.

13. گرفتن همسایه‌های قابل عبور: getNeighbors(node)
```sh
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
```
برای هر خانه، همسایه‌های بالا، پایین، چپ و راست را بررسی می‌کند.

اگر همسایه وجود داشته باشد و قابل عبور (walkable) باشد، آن را به عنوان همسایه معتبر برمی‌گرداند.

علامت سوال ?. یک بررسی امنیتی است که اگر خانه‌ای خارج از محدوده جدول باشد، کد خطا ندهد.

14. اجرای الگوریتم A* : astar(start, goal)
```sh
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
```
این تابع اصلی الگوریتم A* است.

openList لیستی است که خانه‌هایی که باید بررسی شوند را نگه می‌دارد.

ابتدا خانه شروع را با هزینه ۰ می‌گذارد و به لیست اضافه می‌کند.

تا وقتی که لیست خالی نشده:

خانه‌ای که کمترین f را دارد انتخاب می‌شود (بهترین گزینه فعلی).

اگر همین خانه هدف باشد، مسیر را برمی‌گرداند.

خانه فعلی













🖱️ نحوه استفاده
فایل index.html را در مرورگر باز کنید.

ابتدا گره شروع (سبز) را با کلیک مشخص کنید.

سپس گره پایان (قرمز) را کلیک کنید.

روی گره‌ها کلیک کنید تا به عنوان دیوار (سیاه) علامت‌گذاری شوند.

دکمه "اجرا" را فشار دهید تا الگوریتم اجرا شود.

💡 ویژگی‌ها
رابط کاربری ساده و شهودی

نمایش مسیر بهینه و گره‌های بررسی‌شده

قابلیت ساخت نقشه تصادفی

اطلاعات کامل درباره هزینه و پیچیدگی

📷 تصاویر 
![image](https://github.com/user-attachments/assets/7e469aa2-6ce5-4e08-af9d-d5f3bbff37ea)

حالت اولیه	اجرای الگوریتم

⚙️ اجرا و توسعه
برای اجرا به هیچ کتابخانه یا سرور نیاز نیست. تنها کافی است فایل HTML را در مرورگر باز کنید.

📁 ساختار فایل‌ها
pgsql
Copy
Edit
├── index.html
├── style.css
├── script.js
└── README.md
📝 مجوز
MIT License

