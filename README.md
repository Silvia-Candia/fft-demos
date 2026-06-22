# FFT interactive demos

A set of self-contained, browser-based demos illustrating how the Fast Fourier Transform works:

- signal to spectrum (a signal is a sum of sines)
- the N^2 vs N log N cost gap
- radix trade-offs and the operation-count U-shape
- the butterfly and log2 N stages
- aliasing and the Nyquist limit
- real vs complex (I/Q) spectra
- the 2D FFT and the corner turn
- a hardware-implementation explorer

Open `index.html` for a navigator that browses all of them, or open any demo file directly (each is self-contained, which is how they embed).

Live: https://silvia-candia.github.io/fft-demos/

## Shared files

- `fft.js` - radix-2 FFT/IFFT, verified against a brute-force DFT
- `plot.js` - small canvas plotting helpers
- `style.css` - shared styling
