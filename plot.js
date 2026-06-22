// plot.js: tiny canvas plotting helpers for the demos.
// Canvas drawing-buffer size = the element width/height attributes (no HiDPI scaling).

function clearCanvas(ctx, w, h, bg) {
  ctx.fillStyle = bg || '#ffffff';
  ctx.fillRect(0, 0, w, h);
}

function makePlot(ctx, region, ranges) {
  const r = region, g = ranges;
  const sx = v => r.x + (v - g.xmin) / (g.xmax - g.xmin) * r.w;
  const sy = v => r.y + r.h - (v - g.ymin) / (g.ymax - g.ymin) * r.h;
  return { ctx, region: r, ranges: g, sx, sy };
}

function drawFrame(p, opts) {
  opts = opts || {};
  const ctx = p.ctx, r = p.region;
  ctx.font = '12px system-ui, sans-serif';
  (opts.xticks || []).forEach(t => {
    const x = p.sx(t.v);
    ctx.strokeStyle = '#eef1f4'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, r.y); ctx.lineTo(x, r.y + r.h); ctx.stroke();
    ctx.fillStyle = '#52606d'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(t.label, x, r.y + r.h + 4);
  });
  (opts.yticks || []).forEach(t => {
    const y = p.sy(t.v);
    ctx.strokeStyle = '#eef1f4'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(r.x, y); ctx.lineTo(r.x + r.w, y); ctx.stroke();
    ctx.fillStyle = '#52606d'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(t.label, r.x - 6, y);
  });
  ctx.strokeStyle = '#cbd2d9'; ctx.lineWidth = 1;
  ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w, r.h);
  if (opts.xlabel) {
    ctx.fillStyle = '#1f2933'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(opts.xlabel, r.x + r.w / 2, r.y + r.h + 22);
  }
  if (opts.title) {
    ctx.fillStyle = '#1f2933'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.fillText(opts.title, r.x, r.y - 6);
  }
}

function plotLineXY(p, xs, ys, color, width) {
  const ctx = p.ctx;
  ctx.strokeStyle = color || '#2563eb'; ctx.lineWidth = width || 2;
  ctx.beginPath();
  for (let i = 0; i < xs.length; i++) {
    const X = p.sx(xs[i]), Y = p.sy(ys[i]);
    if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
  }
  ctx.stroke();
}

function plotBars(p, values, color, x0) {
  const ctx = p.ctx; ctx.fillStyle = color || '#2563eb';
  const n = values.length, base = p.sy(0);
  for (let k = 0; k < n; k++) {
    const xc = p.sx((x0 || 0) + k), top = p.sy(values[k]);
    const bw = Math.max(1, (p.region.w / n) * 0.55);
    ctx.fillRect(xc - bw / 2, Math.min(base, top), bw, Math.abs(base - top));
  }
}

function plotPoints(p, xs, ys, color, radius) {
  const ctx = p.ctx; ctx.fillStyle = color || '#ef4444';
  for (let i = 0; i < xs.length; i++) {
    ctx.beginPath(); ctx.arc(p.sx(xs[i]), p.sy(ys[i]), radius || 3, 0, 2 * Math.PI); ctx.fill();
  }
}
