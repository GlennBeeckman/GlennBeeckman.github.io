const colorPicker = document.getElementById("color-picker");
const hexInput = document.getElementById("hex-input");
const rgbInput = document.getElementById("rgb-input");
const hslInput = document.getElementById("hsl-input");
const colorPreview = document.getElementById("color-preview");
const colorStatus = document.getElementById("color-status");

function setColorStatus(message) {
  if (colorStatus) {
    colorStatus.textContent = message;
    colorStatus.style.color = "#225463";
    setTimeout(() => colorStatus.textContent = "", 2000);
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function updateFromHex(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  
  rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  colorPreview.style.backgroundColor = hex;
  colorPicker.value = hex;
}

function updateFromRgb(rgb) {
  const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
  if (!match) return;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  const hex = rgbToHex(r, g, b);
  hexInput.value = hex;
  
  const hsl = rgbToHsl(r, g, b);
  hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  
  colorPreview.style.backgroundColor = rgb;
  colorPicker.value = hex;
}

function updateFromHsl(hsl) {
  const match = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(hsl);
  if (!match) return;
  
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  
  hexInput.value = hex;
  rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  colorPreview.style.backgroundColor = hex;
  colorPicker.value = hex;
}

colorPicker.addEventListener("change", (e) => {
  updateFromHex(e.target.value);
});

hexInput.addEventListener("input", (e) => {
  if (e.target.value.length === 7) {
    updateFromHex(e.target.value);
  }
});

rgbInput.addEventListener("input", (e) => {
  if (e.target.value.includes("rgb")) {
    updateFromRgb(e.target.value);
  }
});

hslInput.addEventListener("input", (e) => {
  if (e.target.value.includes("hsl")) {
    updateFromHsl(e.target.value);
  }
});

document.getElementById("hex-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(hexInput.value);
  setColorStatus("HEX copied!");
});

document.getElementById("rgb-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(rgbInput.value);
  setColorStatus("RGB copied!");
});

document.getElementById("hsl-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(hslInput.value);
  setColorStatus("HSL copied!");
});

// Initialize
updateFromHex("#0066CC");
