// --- 全域變數 ---
let seaweeds = [];
let fishes = [];
let bubbles = []; 
let iframe;

// 選單清單
const menuItems = [
  { name: "回主頁", url: "" }, 
  { name: "第一二週_色塊魚", url: "https://zhiiyuuu.github.io/uglyfish/" }, 
  { name: "第三週_點點們", url: "https://zhiiyuuu.github.io/dotdot/" },
  { name: "第五週_教科in海底", url: "https://zhiiyuuu.github.io/waterweed/" },
  { name: "第六週_電流急急棒", url: "https://zhiiyuuu.github.io/20260330/" },
  { name: "第七週_雷達找顏色", url: "https://zhiiyuuu.github.io/20260331/" },
  { name: "期末作品", url: "final/index.html" }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 1. 初始化 iframe (觀測窗)
  iframe = createElement('iframe');
  iframe.style('width', '90%');
  iframe.style('height', '72%');
  iframe.style('position', 'absolute');
  iframe.style('left', '5%');   
  iframe.style('top', '20vh');  
  iframe.style('background', 'rgba(255, 255, 255, 0.15)');
  iframe.style('backdrop-filter', 'blur(12px)');
  iframe.style('-webkit-backdrop-filter', 'blur(12px)');
  iframe.style('border', '2px solid rgba(255, 255, 255, 0.4)');
  iframe.style('border-radius', '15px');
  iframe.style('box-shadow', '0 10px 50px rgba(0, 0, 0, 0.2)');
  
  // *** 重點：初始狀態直接隱藏，不顯示中間那塊 ***
  iframe.hide();

  // 2. 生成背景生態
  for (let i = 0; i < 75; i++) {
    seaweeds.push(new Seaweed(random(width), height, random(100, 350)));
  }
  for (let i = 0; i < 25; i++) {
    fishes.push(new Fish(floor(random(3))));
  }

  // 3. 生成選單泡泡
  for (let i = 0; i < menuItems.length; i++) {
    let x = (width / (menuItems.length + 1)) * (i + 1);
    let y = 80; 
    let isHome = (menuItems[i].name === "回主頁");
    bubbles.push(new MenuBubble(x, y, isHome ? 75 : 85, menuItems[i].name, menuItems[i].url, isHome));
  }
}

function draw() {
  drawClearSeaBackground(); 

  // 繪製背景生態
  for (let s of seaweeds) { s.sway(); s.display(); }
  for (let f of fishes) { f.update(); f.display(); }
  
  // 繪製 UI 泡泡
  for (let b of bubbles) { b.update(); b.display(); }

  // 裝飾氣泡
  if (frameCount % 20 === 0) {
    noStroke();
    fill(255, 255, 255, 30);
    circle(random(width), height + 10, random(5, 15));
  }
}

function mousePressed() {
  for (let b of bubbles) {
    if (b.isClicked(mouseX, mouseY)) {
      b.onClick();
      break; 
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawClearSeaBackground() {
  let c1 = color(195, 245, 255); 
  let c2 = color(120, 200, 240);  
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    stroke(lerpColor(c1, c2, inter));
    line(0, y, width, y);
  }
}

// --- Class 定義 ---

class Seaweed {
  constructor(x, y, maxH) {
    this.x = x; this.y = y; this.maxH = maxH;
    this.angleOff = random(1000);
    this.color = color(random(40, 80), random(170, 230), random(120, 180), 130);
    this.segments = floor(random(10, 18));
  }
  sway() { this.angleOff += 0.005; }
  display() {
    push(); translate(this.x, this.y); stroke(this.color); noFill();
    beginShape(); vertex(0, 0);
    for (let i = 0; i < this.segments; i++) {
      let x = (noise(this.angleOff + i * 0.1) - 0.5) * map(i, 0, this.segments, 0, 40);
      strokeWeight(map(i, 0, this.segments, 6, 0.5));
      curveVertex(x, -i * (this.maxH / this.segments));
    }
    endShape(); pop();
  }
}

class MenuBubble {
  constructor(x, y, size, label, url, isHome) {
    this.baseX = x; this.baseY = y;
    this.x = x; this.y = y;
    this.size = size; this.label = label; this.url = url;
    this.isHome = isHome;
    this.noiseOff = random(1000);
  }
  update() {
    this.noiseOff += 0.005;
    this.x = this.baseX + (noise(this.noiseOff) - 0.5) * 30;
    this.y = this.baseY + (noise(this.noiseOff + 100) - 0.5) * 15;
    this.isHovered = dist(mouseX, mouseY, this.x, this.y) < this.size/2;
  }
  display() {
    push(); translate(this.x, this.y);
    if (this.isHome) {
      fill(255, this.isHovered ? 250 : 210); // 實心亮白
      stroke(255);
    } else {
      noFill();
      stroke(this.isHovered ? 255 : color(255, 160));
    }
    strokeWeight(2.5); ellipse(0, 0, this.size);
    fill(255, this.isHome ? 60 : 80); noStroke();
    ellipse(-this.size/5, -this.size/5, this.size/4, this.size/8);
    fill(this.isHome ? color(0, 50, 100) : (this.isHovered ? color(0, 70, 140) : 60));
    textAlign(CENTER, CENTER);
    let tSize = this.label.length > 7 ? 9 : 11;
    if (this.isHome) tSize = 13; 
    textSize(this.label === "期末作品" ? 16 : tSize);
    textStyle((this.label === "期末作品" || this.isHome) ? BOLD : NORMAL);
    text(this.label, 0, 0); pop();
  }
  isClicked(mx, my) { return dist(mx, my, this.x, this.y) < this.size/2; }
  onClick() {
    if (this.isHome) {
      // *** 點點擊「回主頁」，視窗直接消失 ***
      iframe.hide();
    } else {
      // 點點擊其他週次，顯示視窗並載入網址
      iframe.attribute('src', this.url);
      iframe.show();
    }
  }
}

class Fish {
  constructor(type) {
    this.x = random(width); this.y = random(height * 0.3, height * 0.9);
    this.dir = random() > 0.5 ? 1 : -1;
    this.speed = random(1.2, 3.5);
    this.col = [color(255, 200, 120, 180), color(140, 240, 255, 180), color(240, 180, 255, 180)][type];
    this.size = type === 1 ? 38 : 26;
  }
  update() {
    this.x += this.speed * this.dir;
    this.y += sin(frameCount * 0.08) * 0.4;
    if (this.x > width + 60 || this.x < -60) this.x = this.dir === 1 ? -60 : width + 60;
  }
  display() {
    push(); translate(this.x, this.y); if (this.dir === -1) scale(-1, 1);
    fill(this.col); noStroke();
    ellipse(0, 0, this.size, this.size*0.5);
    triangle(-this.size/2, 0, -this.size*0.8, -this.size/3, -this.size*0.8, this.size/3);
    fill(255); ellipse(this.size/4, 0, 3, 3); pop();
  }
}