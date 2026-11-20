// Berkas penggambaran prosedural Canvas 2D untuk sembilan jajanan Nusantara sesuai bentuk asli makanannya.

import { GAME_CONFIG, getSnackTier } from '../config';

export interface MergeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  lifeMs: number;
  maxLifeMs: number;
}

export interface FloatingScore {
  x: number;
  y: number;
  text: string;
  color: string;
  lifeMs: number;
  maxLifeMs: number;
}

function drawOuterRim(ctx: CanvasRenderingContext2D, r: number, stroke = 'rgba(62, 39, 35, 0.35)'): void {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1.2, r * 0.04);
  ctx.beginPath();
  ctx.arc(0, 0, r - ctx.lineWidth * 0.5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCoasterPlate(ctx: CanvasRenderingContext2D, r: number, fill = '#FFFDF8', ringColor = '#E7D8C5'): void {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = ringColor;
  ctx.lineWidth = Math.max(1.2, r * 0.05);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
  ctx.stroke();
}

function drawKlepon(ctx: CanvasRenderingContext2D, r: number): void {
  // Bola ketan pandan hijau dengan gradasi lembut
  const grad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#4CAF50');
  grad.addColorStop(0.65, '#2E7D32');
  grad.addColorStop(1, '#1B5E20');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.94, 0, Math.PI * 2);
  ctx.fill();

  // Serpihan parutan kelapa putih di sekeliling tepi bola
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(r * 0.86, 0, r * 0.14, r * 0.09, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Serpihan kelapa parut di permukaan
  const flakes = [
    [-0.36, -0.25, 0.4],
    [0.26, -0.35, 1.2],
    [-0.08, 0.05, 0.7],
    [0.36, 0.18, 2.1],
    [-0.38, 0.28, 1.7],
    [0.1, 0.42, 0.2],
    [0.02, -0.52, 2.5],
  ];
  ctx.fillStyle = '#F9FAFB';
  flakes.forEach(([fx, fy, rot]) => {
    ctx.save();
    ctx.translate(fx * r, fy * r);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.roundRect(-r * 0.14, -r * 0.045, r * 0.28, r * 0.09, r * 0.04);
    ctx.fill();
    ctx.restore();
  });

  // Helai kecil daun pandan di atas
  ctx.fillStyle = '#1B5E20';
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.65, r * 0.2, r * 0.08, -0.2, 0, Math.PI * 2);
  ctx.fill();

  drawOuterRim(ctx, r, 'rgba(27, 94, 32, 0.35)');
}

function drawOndeOnde(ctx: CanvasRenderingContext2D, r: number): void {
  // Bola goreng kecokelatan hangat
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#E8BE8E');
  grad.addColorStop(0.65, '#D4A373');
  grad.addColorStop(1, '#A66F3A');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Biji wijen krem tersebar merata
  const seeds = [
    [0, 0, 0.3],
    [-0.38, -0.18, 0.9],
    [0.32, -0.26, 2.1],
    [-0.14, -0.45, 1.5],
    [0.18, 0.36, 0.5],
    [-0.32, 0.32, 2.6],
    [0.44, 0.12, 1.1],
    [-0.58, 0.05, 0.2],
    [0.08, -0.7, 2.0],
    [-0.48, -0.52, 1.2],
    [0.52, -0.45, 0.4],
    [0.54, 0.45, 2.3],
    [-0.1, 0.68, 1.7],
    [-0.58, 0.48, 0.8],
  ];
  seeds.forEach(([sx, sy, rot]) => {
    ctx.save();
    ctx.translate(sx * r, sy * r);
    ctx.rotate(rot);
    ctx.fillStyle = 'rgba(120, 72, 24, 0.35)';
    ctx.beginPath();
    ctx.ellipse(r * 0.02, r * 0.02, r * 0.1, r * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.1, r * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  drawOuterRim(ctx, r, 'rgba(110, 65, 25, 0.4)');
}

function drawLemper(ctx: CanvasRenderingContext2D, r: number): void {
  drawCoasterPlate(ctx, r, '#F7FBF4', '#C8E6C9');

  ctx.save();
  ctx.rotate(-0.35);

  // Lidi penyemat di kedua ujung daun pisang
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = Math.max(1.2, r * 0.05);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.78, -r * 0.14);
  ctx.lineTo(-r * 0.58, r * 0.16);
  ctx.moveTo(r * 0.6, -r * 0.16);
  ctx.lineTo(r * 0.78, r * 0.14);
  ctx.stroke();

  // Ujung lipatan daun pisang kiri & kanan
  ctx.fillStyle = '#388E3C';
  ctx.beginPath();
  ctx.moveTo(-r * 0.52, -r * 0.25);
  ctx.lineTo(-r * 0.82, 0);
  ctx.lineTo(-r * 0.52, r * 0.25);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(r * 0.52, -r * 0.25);
  ctx.lineTo(r * 0.82, 0);
  ctx.lineTo(r * 0.52, r * 0.25);
  ctx.closePath();
  ctx.fill();

  // Badan gulungan lemper daun pisang
  const bodyGrad = ctx.createLinearGradient(0, -r * 0.34, 0, r * 0.34);
  bodyGrad.addColorStop(0, '#81C784');
  bodyGrad.addColorStop(0.5, '#66BB6A');
  bodyGrad.addColorStop(1, '#2E7D32');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-r * 0.62, -r * 0.32, r * 1.24, r * 0.64, r * 0.16);
  ctx.fill();
  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = Math.max(1, r * 0.04);
  ctx.stroke();

  // Jendela terbuka menampilkan ketan putih & suwiran ayam
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.26, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.12, r * 0.08, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Ikatan hitam di kedua sisi lemper
  ctx.fillStyle = '#263238';
  ctx.fillRect(-r * 0.52, -r * 0.33, r * 0.09, r * 0.66);
  ctx.fillRect(r * 0.43, -r * 0.33, r * 0.09, r * 0.66);

  ctx.restore();
  drawOuterRim(ctx, r, 'rgba(46, 125, 50, 0.35)');
}

function drawKueLapis(ctx: CanvasRenderingContext2D, r: number): void {
  drawCoasterPlate(ctx, r, '#FFF8FA', '#F8BBD0');

  // Bayangan lembut potongan kue di atas piring
  ctx.fillStyle = 'rgba(136, 14, 79, 0.12)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.42, r * 0.62, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Potongan kue lapis perspektif isometrik (5 lapis pink & putih)
  const layers = ['#D81B60', '#FFFFFF', '#EC407A', '#FFFFFF', '#F48FB1'];
  const totalH = r * 0.68;
  const layerH = totalH / layers.length;
  const startY = r * 0.38;

  // Sisi depan kiri (berlapis)
  layers.forEach((col, i) => {
    const yBottom = startY - i * layerH;
    const yTop = yBottom - layerH;

    // Wajah kiri
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(-r * 0.56, yBottom - r * 0.14);
    ctx.lineTo(-r * 0.02, yBottom + r * 0.04);
    ctx.lineTo(-r * 0.02, yTop + r * 0.04);
    ctx.lineTo(-r * 0.56, yTop - r * 0.14);
    ctx.closePath();
    ctx.fill();

    // Wajah kanan (sedikit lebih gelap untuk efek 3D)
    ctx.fillStyle = col === '#FFFFFF' ? '#F3F4F6' : col;
    ctx.beginPath();
    ctx.moveTo(-r * 0.02, yBottom + r * 0.04);
    ctx.lineTo(r * 0.56, yBottom - r * 0.16);
    ctx.lineTo(r * 0.56, yTop - r * 0.16);
    ctx.lineTo(-r * 0.02, yTop + r * 0.04);
    ctx.closePath();
    ctx.fill();

    if (col !== '#FFFFFF') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fill();
    }
  });

  // Permukaan atas kue lapis berwarna merah muda mengilap
  const topY = startY - totalH;
  ctx.fillStyle = '#EC407A';
  ctx.beginPath();
  ctx.moveTo(-r * 0.02, topY + r * 0.04);
  ctx.lineTo(r * 0.56, topY - r * 0.16);
  ctx.lineTo(r * 0.02, topY - r * 0.34);
  ctx.lineTo(-r * 0.56, topY - r * 0.14);
  ctx.closePath();
  ctx.fill();

  // Garis tepi potongan kue agar tajam
  ctx.strokeStyle = 'rgba(136, 14, 79, 0.35)';
  ctx.lineWidth = Math.max(1, r * 0.03);
  ctx.stroke();

  drawOuterRim(ctx, r, 'rgba(236, 64, 122, 0.35)');
}

function drawMartabakManis(ctx: CanvasRenderingContext2D, r: number): void {
  // Kulit luar martabak panggang cokelat keemasan
  ctx.fillStyle = '#8D5524';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Adonan dalam kuning keemasan berpori
  ctx.fillStyle = '#FBC02D';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
  ctx.fill();

  // Pori-pori sarang martabak
  ctx.fillStyle = 'rgba(180, 110, 10, 0.25)';
  for (let i = 0; i < 16; i += 1) {
    const ang = (i / 16) * Math.PI * 2;
    const dist = (0.25 + (i % 3) * 0.22) * r;
    ctx.beginPath();
    ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, r * 0.035, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sisi kiri: taburan meses cokelat + kacang
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.84, Math.PI * 0.5, Math.PI * 1.5);
  ctx.clip();

  const meses = [
    [-0.25, -0.5, 0.4],
    [-0.52, -0.28, 1.3],
    [-0.22, -0.18, 2.2],
    [-0.6, 0.04, 0.8],
    [-0.32, 0.16, 1.9],
    [-0.5, 0.42, 0.2],
    [-0.2, 0.52, 1.5],
    [-0.12, -0.35, 2.6],
    [-0.38, -0.02, 0.6],
  ];
  ctx.fillStyle = '#3E2723';
  meses.forEach(([mx, my, rot]) => {
    ctx.save();
    ctx.translate(mx * r, my * r);
    ctx.rotate(rot);
    ctx.fillRect(-r * 0.11, -r * 0.035, r * 0.22, r * 0.07);
    ctx.restore();
  });
  ctx.restore();

  // Sisi kanan: keju parut kuning pucat & susu kental manis
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.84, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.clip();

  const cheese = [
    [0.24, -0.52, 0.2],
    [0.52, -0.26, 1.4],
    [0.2, -0.15, 2.1],
    [0.58, 0.08, 0.6],
    [0.32, 0.22, 1.8],
    [0.46, 0.46, 0.4],
    [0.18, 0.52, 2.5],
    [0.38, -0.04, 1.0],
    [0.15, -0.36, 0.7],
  ];
  ctx.fillStyle = '#FFF9C4';
  cheese.forEach(([cx, cy, rot]) => {
    ctx.save();
    ctx.translate(cx * r, cy * r);
    ctx.rotate(rot);
    ctx.fillRect(-r * 0.13, -r * 0.03, r * 0.26, r * 0.06);
    ctx.restore();
  });

  // Garis susu kental manis putih
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.lineWidth = r * 0.035;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(r * 0.1, -r * 0.6);
  ctx.quadraticCurveTo(r * 0.5, -r * 0.2, r * 0.18, r * 0.15);
  ctx.quadraticCurveTo(r * 0.55, r * 0.35, r * 0.2, r * 0.62);
  ctx.stroke();
  ctx.restore();

  // Garis potongan kotak-kotak khas martabak manis
  ctx.strokeStyle = 'rgba(93, 64, 55, 0.5)';
  ctx.lineWidth = Math.max(1.2, r * 0.03);
  [-0.35, 0, 0.35].forEach((pos) => {
    ctx.beginPath();
    ctx.moveTo(pos * r, -r * 0.88);
    ctx.lineTo(pos * r, r * 0.88);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-r * 0.88, pos * r);
    ctx.lineTo(r * 0.88, pos * r);
    ctx.stroke();
  });

  drawOuterRim(ctx, r, 'rgba(93, 64, 55, 0.45)');
}

function drawEsCendol(ctx: CanvasRenderingContext2D, r: number): void {
  drawCoasterPlate(ctx, r, '#FAF3EA', '#D7CCC8');

  // Sedotan bergaris merah-putih keluar dari gelas
  ctx.save();
  ctx.translate(r * 0.18, -r * 0.48);
  ctx.rotate(0.28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-r * 0.05, -r * 0.32, r * 0.1, r * 0.48);
  ctx.fillStyle = '#E53935';
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(-r * 0.05, -r * 0.3 + i * r * 0.11, r * 0.1, r * 0.05);
  }
  ctx.strokeStyle = 'rgba(62, 39, 35, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-r * 0.05, -r * 0.32, r * 0.1, r * 0.48);
  ctx.restore();

  // Bentuk gelas mengerucut ke bawah
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-r * 0.46, -r * 0.44);
  ctx.lineTo(r * 0.46, -r * 0.44);
  ctx.lineTo(r * 0.33, r * 0.6);
  ctx.quadraticCurveTo(0, r * 0.68, -r * 0.33, r * 0.6);
  ctx.closePath();
  ctx.save();
  ctx.clip();

  // Lapisan atas: santan putih krem
  ctx.fillStyle = '#FFFDF7';
  ctx.fillRect(-r * 0.5, -r * 0.45, r, r * 1.15);

  // Lapisan bawah: gula aren cokelat pekat
  const palmGrad = ctx.createLinearGradient(0, r * 0.1, 0, r * 0.65);
  palmGrad.addColorStop(0, '#A1887F');
  palmGrad.addColorStop(0.35, '#8D6E63');
  palmGrad.addColorStop(1, '#5D4037');
  ctx.fillStyle = palmGrad;
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, r * 0.16);
  ctx.quadraticCurveTo(0, r * 0.05, r * 0.5, r * 0.2);
  ctx.lineTo(r * 0.5, r * 0.7);
  ctx.lineTo(-r * 0.5, r * 0.7);
  ctx.closePath();
  ctx.fill();

  // Butiran cendol hijau melengkung
  const cendols = [
    [-0.22, -0.05, 0.4],
    [0.14, -0.1, 1.6],
    [-0.04, 0.06, 2.3],
    [0.24, 0.12, 0.8],
    [-0.2, 0.2, 1.9],
    [0.05, 0.28, 0.2],
    [-0.12, -0.22, 1.1],
    [0.18, -0.26, 2.7],
  ];
  ctx.fillStyle = '#43A047';
  cendols.forEach(([cx, cy, rot]) => {
    ctx.save();
    ctx.translate(cx * r, cy * r);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.roundRect(-r * 0.11, -r * 0.04, r * 0.22, r * 0.08, r * 0.04);
    ctx.fill();
    ctx.restore();
  });

  // Es batu bening di permukaan atas
  ctx.fillStyle = 'rgba(224, 247, 250, 0.85)';
  ctx.strokeStyle = 'rgba(128, 222, 234, 0.9)';
  ctx.lineWidth = 1;
  [
    [-0.22, -0.32, -0.2],
    [0.04, -0.35, 0.15],
    [0.24, -0.28, -0.3],
  ].forEach(([ix, iy, rot]) => {
    ctx.save();
    ctx.translate(ix * r, iy * r);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.roundRect(-r * 0.11, -r * 0.08, r * 0.22, r * 0.16, r * 0.03);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();

  // Garis tepi gelas kaca
  ctx.strokeStyle = '#6D4C41';
  ctx.lineWidth = Math.max(1.5, r * 0.04);
  ctx.stroke();

  // Bibir gelas elips atas
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = Math.max(1.2, r * 0.03);
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.44, r * 0.46, r * 0.09, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  drawOuterRim(ctx, r, 'rgba(141, 110, 99, 0.4)');
}

function drawBaksoUrat(ctx: CanvasRenderingContext2D, r: number): void {
  // Mangkuk putih bergaris merah khas tukang bakso
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = r * 0.055;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
  ctx.stroke();

  // Kuah kaldu hangat kecokelatan
  const brothGrad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 0.82);
  brothGrad.addColorStop(0, '#F5E6C8');
  brothGrad.addColorStop(1, '#DFC89F');
  ctx.fillStyle = brothGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.fill();

  // Mie kuning melingkar di bagian bawah-kiri
  ctx.strokeStyle = '#FBC02D';
  ctx.lineWidth = r * 0.05;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(-r * 0.16, r * 0.24, r * (0.28 + i * 0.08), 0.3, 2.5);
    ctx.stroke();
  }

  // Sayur sawi hijau di sisi kanan atas
  ctx.fillStyle = '#43A047';
  ctx.beginPath();
  ctx.ellipse(r * 0.44, -r * 0.26, r * 0.2, r * 0.12, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#81C784';
  ctx.beginPath();
  ctx.ellipse(r * 0.44, -r * 0.26, r * 0.12, r * 0.04, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Sambal cabai merah di tepi kuah
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath();
  ctx.arc(-r * 0.5, -r * 0.28, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Dua bakso kecil pendamping
  [
    [-0.36, 0.34, 0.17],
    [0.42, 0.28, 0.16],
  ].forEach(([bx, by, br]) => {
    ctx.fillStyle = '#8D8D8D';
    ctx.beginPath();
    ctx.arc(bx * r, by * r, br * r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#525252';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Bakso Urat utama besar di tengah dengan belah silang & tekstur urat
  const mainR = r * 0.37;
  const meatGrad = ctx.createRadialGradient(-mainR * 0.25, -mainR * 0.25, mainR * 0.1, 0, -r * 0.04, mainR);
  meatGrad.addColorStop(0, '#9E9E9E');
  meatGrad.addColorStop(0.65, '#757575');
  meatGrad.addColorStop(1, '#525252');
  ctx.fillStyle = meatGrad;
  ctx.beginPath();
  ctx.arc(0, -r * 0.04, mainR, 0, Math.PI * 2);
  ctx.fill();

  // Belah silang bakso urat mekar
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = Math.max(1.5, r * 0.045);
  ctx.beginPath();
  ctx.moveTo(-mainR * 0.55, -r * 0.04);
  ctx.lineTo(mainR * 0.55, -r * 0.04);
  ctx.moveTo(0, -r * 0.04 - mainR * 0.55);
  ctx.lineTo(0, -r * 0.04 + mainR * 0.55);
  ctx.stroke();

  // Bintik urat daging & taburan seledri hijau
  ctx.fillStyle = '#424242';
  [
    [-0.14, -0.18],
    [0.15, -0.16],
    [-0.15, 0.12],
    [0.14, 0.12],
  ].forEach(([ux, uy]) => {
    ctx.beginPath();
    ctx.arc(ux * r, uy * r, r * 0.028, 0, Math.PI * 2);
    ctx.fill();
  });

  // Taburan seledri & bawang goreng di kuah
  ctx.fillStyle = '#2E7D32';
  [
    [-0.25, -0.52],
    [0.14, -0.54],
    [0.12, 0.52],
    [-0.56, 0.08],
  ].forEach(([lx, ly]) => {
    ctx.fillRect(lx * r, ly * r, r * 0.07, r * 0.04);
  });

  drawOuterRim(ctx, r, 'rgba(82, 82, 82, 0.4)');
}

function drawNasiGoreng(ctx: CanvasRenderingContext2D, r: number): void {
  // Piring makan keramik putih
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = r * 0.04;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
  ctx.stroke();

  // Gundukan nasi goreng kecap oranye
  const riceGrad = ctx.createRadialGradient(-r * 0.12, -r * 0.06, r * 0.1, -r * 0.06, r * 0.04, r * 0.65);
  riceGrad.addColorStop(0, '#FB8C00');
  riceGrad.addColorStop(0.7, '#E65100');
  riceGrad.addColorStop(1, '#BF360C');
  ctx.fillStyle = riceGrad;
  ctx.beginPath();
  ctx.arc(-r * 0.06, r * 0.05, r * 0.62, 0, Math.PI * 2);
  ctx.fill();

  // Tekstur butiran nasi goreng
  for (let i = 0; i < 24; i += 1) {
    const ang = (i / 24) * Math.PI * 2;
    const dist = (0.18 + (i % 4) * 0.11) * r;
    ctx.fillStyle = i % 3 === 0 ? '#FFE0B2' : '#9A3412';
    ctx.beginPath();
    ctx.ellipse(
      -r * 0.06 + Math.cos(ang) * dist,
      r * 0.05 + Math.sin(ang) * dist,
      r * 0.038,
      r * 0.02,
      ang,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // Dua keping kerupuk udang di kanan atas piring
  [
    [0.44, -0.34, 0.3],
    [0.52, -0.08, 0.9],
  ].forEach(([kx, ky, rot]) => {
    ctx.save();
    ctx.translate(kx * r, ky * r);
    ctx.rotate(rot);
    ctx.fillStyle = '#FCD5CE';
    ctx.strokeStyle = '#E5989B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.19, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  // Irisan timun & tomat di kiri bawah
  ctx.fillStyle = '#2E7D32';
  ctx.beginPath();
  ctx.arc(-r * 0.48, r * 0.42, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#DCEDC8';
  ctx.beginPath();
  ctx.arc(-r * 0.48, r * 0.42, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E53935';
  ctx.beginPath();
  ctx.arc(-r * 0.24, r * 0.56, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFCDD2';
  ctx.beginPath();
  ctx.arc(-r * 0.24, r * 0.56, r * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Telur mata sapi (ceplok) di atas nasi goreng
  ctx.save();
  ctx.translate(-r * 0.06, -r * 0.04);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = Math.max(1.2, r * 0.022);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.31, r * 0.25, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const yolkGrad = ctx.createRadialGradient(-r * 0.03, -r * 0.03, r * 0.02, 0, 0, r * 0.14);
  yolkGrad.addColorStop(0, '#FFE082');
  yolkGrad.addColorStop(0.5, '#FFB300');
  yolkGrad.addColorStop(1, '#FB8C00');
  ctx.fillStyle = yolkGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawOuterRim(ctx, r, 'rgba(191, 54, 12, 0.35)');
}

function drawTumpengMini(ctx: CanvasRenderingContext2D, r: number): void {
  // Tampah anyaman bambu di tepi paling luar
  ctx.fillStyle = '#C49A6C';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = r * 0.035;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.93, 0, Math.PI * 2);
  ctx.stroke();

  // Alas daun pisang bergerigi di dalam tampah
  ctx.fillStyle = '#2E7D32';
  const leafCount = 16;
  for (let i = 0; i < leafCount; i += 1) {
    const a = (i / leafCount) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(r * 0.72, -r * 0.18);
    ctx.lineTo(r * 0.9, 0);
    ctx.lineTo(r * 0.72, r * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#388E3C';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Lauk-pauk di sekeliling tumpeng: ayam goreng, perkedel, telur rawis, urap
  // Ayam goreng (kiri bawah)
  ctx.fillStyle = '#B45309';
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, r * 0.32, r * 0.18, r * 0.11, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(-r * 0.66, r * 0.4, r * 0.1, r * 0.05);

  // Perkedel kentang (kanan bawah)
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.arc(r * 0.48, r * 0.34, r * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // Telur rawis kuning (atas kiri)
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = r * 0.035;
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-r * 0.56, -r * 0.3 + i * r * 0.045);
    ctx.lineTo(-r * 0.3, -r * 0.38 + i * r * 0.045);
    ctx.stroke();
  }

  // Tempe orek (atas kanan)
  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.roundRect(r * 0.32, -r * 0.46, r * 0.24, r * 0.18, r * 0.04);
  ctx.fill();

  // Timun & selada segar (bawah tengah)
  ctx.fillStyle = '#66BB6A';
  ctx.beginPath();
  ctx.arc(0, r * 0.58, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Kerucut nasi kuning tumpeng di tengah
  const coneGrad = ctx.createRadialGradient(-r * 0.08, -r * 0.14, r * 0.05, 0, 0, r * 0.5);
  coneGrad.addColorStop(0, '#FFF59D');
  coneGrad.addColorStop(0.5, '#FFD54F');
  coneGrad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.48, 0, Math.PI * 2);
  ctx.fill();

  // Cincin kerucut bertingkat
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
  ctx.lineWidth = Math.max(1, r * 0.02);
  [0.34, 0.21].forEach((scale) => {
    ctx.beginPath();
    ctx.arc(0, -r * 0.03, r * scale, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Hiasan cabai merah di puncak kerucut
  ctx.fillStyle = '#D32F2F';
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(a) * r * 0.09,
      -r * 0.04 + Math.sin(a) * r * 0.09,
      r * 0.08,
      r * 0.045,
      a,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath();
  ctx.arc(0, -r * 0.04, r * 0.055, 0, Math.PI * 2);
  ctx.fill();

  drawOuterRim(ctx, r, 'rgba(141, 110, 99, 0.45)');
}

export function drawSnack(
  ctx: CanvasRenderingContext2D,
  tier: number,
  x: number,
  y: number,
  angle: number,
  targetRadius?: number,
): void {
  const config = getSnackTier(tier);
  const r = targetRadius ?? config.radius;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();

  switch (tier) {
    case 1:
      drawKlepon(ctx, r);
      break;
    case 2:
      drawOndeOnde(ctx, r);
      break;
    case 3:
      drawLemper(ctx, r);
      break;
    case 4:
      drawKueLapis(ctx, r);
      break;
    case 5:
      drawMartabakManis(ctx, r);
      break;
    case 6:
      drawEsCendol(ctx, r);
      break;
    case 7:
      drawBaksoUrat(ctx, r);
      break;
    case 8:
      drawNasiGoreng(ctx, r);
      break;
    case 9:
      drawTumpengMini(ctx, r);
      break;
    default:
      drawKlepon(ctx, r);
      break;
  }

  ctx.restore();
}

export function drawDangerLine(
  ctx: CanvasRenderingContext2D,
  isWarning: boolean,
  blinkPhase: number,
  dangerProgress: number,
): void {
  const y = GAME_CONFIG.dangerLineY;
  const width = GAME_CONFIG.containerWidth;

  ctx.save();
  if (isWarning) {
    const pulse = 0.45 + 0.55 * Math.abs(Math.sin(blinkPhase));
    ctx.strokeStyle = `rgba(220, 38, 38, ${pulse.toFixed(2)})`;
    ctx.lineWidth = 2.5;
  } else {
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.45)';
    ctx.lineWidth = 1.5;
  }

  ctx.setLineDash([7, 6]);
  ctx.beginPath();
  ctx.moveTo(8, y);
  ctx.lineTo(width - 8, y);
  ctx.stroke();

  if (isWarning && dangerProgress > 0) {
    ctx.setLineDash([]);
    const barWidth = (width - 16) * Math.min(1, dangerProgress);
    ctx.fillStyle = 'rgba(220, 38, 38, 0.22)';
    ctx.fillRect(8, y - 4, barWidth, 4);
  }
  ctx.restore();
}

export function drawAimingGuide(
  ctx: CanvasRenderingContext2D,
  tier: number,
  x: number,
  y: number,
): void {
  const config = getSnackTier(tier);

  ctx.save();
  ctx.strokeStyle = 'rgba(93, 64, 55, 0.32)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x, y + config.radius + 4);
  ctx.lineTo(x, GAME_CONFIG.containerHeight - 4);
  ctx.stroke();
  ctx.restore();

  drawSnack(ctx, tier, x, y, 0);

  ctx.save();
  ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
  const label = config.name;
  const textWidth = ctx.measureText(label).width;
  const padX = 8;
  const boxW = textWidth + padX * 2;
  const boxH = 20;

  let labelX = x - boxW / 2;
  labelX = Math.max(6, Math.min(GAME_CONFIG.containerWidth - boxW - 6, labelX));
  const labelY = Math.max(4, y - config.radius - boxH - 5);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = 'rgba(93, 64, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(labelX, labelY, boxW, boxH, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#3E2723';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, labelX + boxW / 2, labelY + boxH / 2 + 0.5);
  ctx.restore();
}

export function drawParticlesAndScores(
  ctx: CanvasRenderingContext2D,
  particles: readonly MergeParticle[],
  floatingScores: readonly FloatingScore[],
): void {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  floatingScores.forEach((fs) => {
    const progress = fs.lifeMs / fs.maxLifeMs;
    const alpha = Math.max(0, 1 - progress);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeText(fs.text, fs.x, fs.y);
    ctx.fillStyle = fs.color;
    ctx.fillText(fs.text, fs.x, fs.y);
    ctx.restore();
  });
}
