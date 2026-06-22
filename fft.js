// fft.js: shared FFT helpers for the FFT demos.
// Plain functions, no modules. Load with: <script src="fft.js"></script>

// In-place iterative radix-2 Cooley-Tukey. re, im length N (power of 2).
// sign = -1 forward, +1 inverse.
function fftInPlace(re, im, sign) {
  const n = re.length;
  if (n <= 1) return;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]; re[i] = re[j]; re[j] = tr;
      const ti = im[i]; im[i] = im[j]; im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = sign * 2 * Math.PI / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = i + k + len / 2;
        const xr = re[b] * cr - im[b] * ci;
        const xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr; im[b] = im[a] - xi;
        re[a] += xr;        im[a] += xi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

function fft(re, im) {
  const R = Float64Array.from(re);
  const I = im ? Float64Array.from(im) : new Float64Array(re.length);
  fftInPlace(R, I, -1);
  return { re: R, im: I };
}

function ifft(re, im) {
  const n = re.length;
  const R = Float64Array.from(re);
  const I = Float64Array.from(im);
  fftInPlace(R, I, 1);
  for (let k = 0; k < n; k++) { R[k] /= n; I[k] /= n; }
  return { re: R, im: I };
}

function magnitude(re, im) {
  const m = new Float64Array(re.length);
  for (let k = 0; k < re.length; k++) m[k] = Math.hypot(re[k], im[k]);
  return m;
}

function fftshift(arr) {
  const n = arr.length, h = Math.floor(n / 2);
  const out = new Array(n);
  for (let k = 0; k < n; k++) out[k] = arr[(k + h) % n];
  return out;
}

function dftRef(re, im) {
  const n = re.length;
  im = im || new Float64Array(n);
  const Re = new Float64Array(n), Im = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    let sr = 0, si = 0;
    for (let t = 0; t < n; t++) {
      const a = -2 * Math.PI * k * t / n;
      const c = Math.cos(a), s = Math.sin(a);
      sr += re[t] * c - im[t] * s;
      si += re[t] * s + im[t] * c;
    }
    Re[k] = sr; Im[k] = si;
  }
  return { re: Re, im: Im };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fft, ifft, magnitude, fftshift, dftRef, fftInPlace };
}
