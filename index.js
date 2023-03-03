const picker = new iro.ColorPicker("#picker", {
    color: '#fff',
});

const colorIndicator = document.querySelector("#color-indicator")
picker.on('color:change', (color) => {
    colorIndicator.style.backgroundColor = color.hexString;
    //add functions to change color system values
    const rgb = [];
    rgb[0] = color.red;
    rgb[1] = color.green;
    rgb[2] = color.blue;

    currentXyzColor = rgbToXyz(rgb);
    currentCmykColor = rgbToCmyk(rgb);
    currentLabColor = rgbToLab(rgb);

    colorIndicator.textContent = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    updateAllValues();
})

let currentRgbColor = [255, 255, 255];
let currentXyzColor = [95.05, 100, 108.89];
let currentCmykColor = [0, 0, 0, 0];
let currentLabColor = [100, 0.0052, -0.010];

const cmykC = document.querySelector('#cmyk-c');
const cmykM = document.querySelector('#cmyk-m');
const cmykY = document.querySelector('#cmyk-y');
const cmykK = document.querySelector('#cmyk-k');

const xyzX = document.querySelector('#xyz-x');
const xyzY = document.querySelector('#xyz-y');
const xyzZ = document.querySelector('#xyz-z');

const labL = document.querySelector('#lab-l');
const labA = document.querySelector('#lab-a');
const labB = document.querySelector('#lab-b');

const rgbToLab = (rgb) => {
    const xyz = rgbToXyz(rgb);
    const lab = xyzToLab(xyz);

    return lab;
}

const rgbToXyz = (rgb) => {
    const rsrgb = rgb[0] / 255;
    const gsrgb = rgb[1] / 255;
    const bsrgb = rgb[2] / 255;

    const rlinear = (rsrgb >= 0.04045) ? Math.pow((rsrgb + 0.055) / 1.055, 2.4) * 100 : rsrgb * 100 / 12.92;
    const glinear = (gsrgb >= 0.04045) ? Math.pow((gsrgb + 0.055) / 1.055, 2.4) * 100 : gsrgb * 100/ 12.92;
    const blinear = (bsrgb >= 0.04045) ? Math.pow((bsrgb + 0.055) / 1.055, 2.4) * 100 : bsrgb * 100/ 12.92;

    let x = rlinear * 0.4124 + glinear * 0.3576 + blinear * 0.1805;
    let y = rlinear * 0.2126 + glinear * 0.7152 + blinear * 0.0722;
    let z = rlinear * 0.0193 + glinear * 0.1192 + blinear * 0.9505;

    return [x, y, z];
}

const rgbToCmyk = (rgb) => {
    const k = Math.min(1 - rgb[0] / 255, 1 - rgb[1] / 255, 1 - rgb[2] / 255);
    const c = (1 - rgb[0] / 255 - k) / (1 - k);
    const m = (1 - rgb[1] / 255 - k) / (1 - k);
    const y = (1 - rgb[2] / 255 - k) / (1 - k);

    return [c * 100, m * 100, y * 100, k * 100];
}

const cmykToRgb = (cmyk) => {
    const k = cmyk[3] / 100;
    const r = 255 * (1 - cmyk[0] / 100) * (1 - k);
    const g = 255 * (1 - cmyk[1] / 100) * (1 - k);
    const b = 255 * (1 - cmyk[2] / 100) * (1 - k);
    return [r, g, b];
}

const cmykToLab = (cmyk) => {
    // Convert CMYK to RGB
  const rgb = cmykToRgb(cmyk);

  // Convert RGB to XYZ
  const xyz = rgbToXyz(rgb);

  // Convert XYZ to Lab
  const lab = xyzToLab(xyz);

  currentLabColor[0] = lab[0];
  currentLabColor[1] = lab[1];
  currentLabColor[2] = lab[2];
}

const cmykToXyz = (cmyk) => {
    const k = cmyk[3];
    const r = 255 * (1 - cmyk[0] / 100) * (1 - k);
    const g = 255 * (1 - cmyk[1] / 100) * (1 - k);
    const b = 255 * (1 - cmyk[2] / 100) * (1 - k);
  
    // Convert RGB to XYZ
    const xyz = rgbToXyz([r, g, b]);

    currentXyzColor[0] = xyz[0];
    currentXyzColor[1] = xyz[1];
    currentXyzColor[2] = xyz[2];

    return xyz;
}

const gammaCorrection = (value) => {
    if (value <= 0.0031308) {
        value *= 12.92;
    } else {
        value = 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    }
    return value;
}

const xyzToRgb = (xyz) => {
    // Convert XYZ to linear RGB

    let r = (3.2406 * xyz[0] - 1.5372 * xyz[1] - 0.4986 * xyz[2]) / 100;
    let g = (-0.9689 * xyz[0] + 1.8758 * xyz[1] + 0.0415 * xyz[2]) / 100;
    let b = (0.0557 * xyz[0] - 0.2040 * xyz[1] + 1.0570 * xyz[2]) / 100;

  // Apply gamma correction
    r = gammaCorrection(r);
    g = gammaCorrection(g);
    b = gammaCorrection(b);
    
  // Convert RGB values to the 0-255 range
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    currentRgbColor[0] = r;
    currentRgbColor[1] = g;
    currentRgbColor[2] = b;

    return [r, g, b];
}

const xyzToCmyk = (xyz) => {
    // Convert XYZ to linear RGB
    const rgb = xyzToRgb(xyz);
    const cmyk = rgbToCmyk(rgb);

    currentCmykColor[0] = cmyk[0] * 100;
    currentCmykColor[1] = cmyk[1] * 100;
    currentCmykColor[2] = cmyk[2] * 100;
    currentCmykColor[3] = cmyk[3] * 100;

    return cmyk;
}

const xyzToLab = (xyz) => {
    let whitePointX = 95.047;
    let whitePointY = 100.0;
    let whitePointZ = 108.883;

    // Convert XYZ to Lab
    let xr = xyz[0] / whitePointX;
    let yr = xyz[1] / whitePointY;
    let zr = xyz[2] / whitePointZ;

    if (xr >= 0.008856) {
        xr = Math.pow(xr, 1 / 3);
    } else {
        xr = (7.787 * xr) + (16 / 116);
    }

    if (yr >= 0.008856) {
        yr = Math.pow(yr, 1 / 3);
    } else {
        yr = (7.787 * yr) + (16 / 116);
    }

    if (zr >= 0.008856) {
        zr = Math.pow(zr, 1 / 3);
    } else {
        zr = (7.787 * zr) + (16 / 116);
    }

    let l = (116 * yr) - 16;
    let a = 500 * (xr - yr);
    let b = 200 * (yr - zr);

    currentLabColor[0] = l;
    currentLabColor[1] = a;
    currentLabColor[2] = b;

    return [l, a, b];
}

const labToRgb = (lab) => {
    // Convert Lab to XYZ
    const xyz = labToXyz(lab);
    // Convert XYZ to RGB
    const rgb = xyzToRgb(xyz);

    currentRgbColor[0] = rgb[0];
    currentRgbColor[1] = rgb[1];
    currentRgbColor[2] = rgb[2];

    return rgb;
}

const labToCmyk = (lab) => {
    // Convert Lab to XYZ
    const xyz = labToXyz(lab);

    //convert xyz to rgb
    const rgb = xyzToRgb(xyz);

    const cmyk = rgbToCmyk(rgb);

    currentCmykColor[0] = cmyk[0] * 100;
    currentCmykColor[1] = cmyk[1] * 100;
    currentCmykColor[2] = cmyk[2] * 100;
    currentCmykColor[3] = cmyk[3] * 100;

    return cmyk;
}

const labToXyz = (lab) => {
    // Convert Lab to XYZ
    let y = (lab[0] + 16) / 116;
    let x = lab[1] / 500 + y;
    let z = y - lab[2] / 200;

    let whitePointX = 95.047;
    let whitePointY = 100.0;
    let whitePointZ = 108.883;

    x = whitePointX * (x * x * x >= 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
    y = whitePointY * (y * y >= 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
    z = whitePointZ * (z * z * z >= 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);
    
    currentXyzColor[0] = x;
    currentXyzColor[1] = y;
    currentXyzColor[2] = z;

    return [x, y, z];
}

const updateAllValues = () => {
    labL.value = currentLabColor[0].toFixed(2);
    labA.value = currentLabColor[1].toFixed(2);
    labB.value = currentLabColor[2].toFixed(2);

    xyzX.value = currentXyzColor[0].toFixed(2);
    xyzY.value = currentXyzColor[1].toFixed(2);
    xyzZ.value = currentXyzColor[2].toFixed(2);

    cmykC.value = currentCmykColor[0].toFixed(2);
    cmykM.value = currentCmykColor[1].toFixed(2);
    cmykY.value = currentCmykColor[2].toFixed(2);
    cmykK.value = currentCmykColor[3].toFixed(2);
}

document.addEventListener("change", (e) => {
    if (e.target.tagName != 'INPUT'){
        return;
    }

    switch(e.target.id){
        case "xyz-x":
            currentXyzColor[0] = parseFloat(xyzX.value);
            currentRgbColor = xyzToRgb(currentXyzColor);
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            xyzToCmyk(currentXyzColor);
            xyzToLab(currentXyzColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "xyz-y":
            currentXyzColor[1] = parseFloat(xyzY.value);
            currentRgbColor = xyzToRgb(currentXyzColor);
            xyzToCmyk(currentXyzColor);
            xyzToLab(currentXyzColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "xyz-z":
            currentXyzColor[2] = parseFloat(xyzZ.value);
            currentRgbColor = xyzToRgb(currentXyzColor);
            xyzToCmyk(currentXyzColor);
            xyzToLab(currentXyzColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "lab-l":
            currentLabColor[0] = parseFloat(labL.value);
            currentRgbColor = labToRgb(currentLabColor);
            labToCmyk(currentLabColor);
            labToXyz(currentLabColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "lab-a":
            currentLabColor[1] = parseFloat(labA.value);
            currentRgbColor = labToRgb(currentLabColor);
            labToCmyk(currentLabColor);
            labToXyz(currentLabColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "lab-b":
            currentLabColor[2] = parseFloat(labB.value);
            currentRgbColor = labToRgb(currentLabColor);
            labToCmyk(currentLabColor);
            labToXyz(currentLabColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "cmyk-c":
            currentCmykColor[0] = parseFloat(cmykC.value);
            currentRgbColor = cmykToRgb(currentCmykColor);
            cmykToLab(currentCmykColor);
            cmykToXyz(currentCmykColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "cmyk-m":
            currentCmykColor[1] = parseFloat(cmykM.value);
            currentRgbColor = cmykToRgb(currentCmykColor);
            cmykToLab(currentCmykColor);
            cmykToXyz(currentCmykColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "cmyk-y":
            currentCmykColor[2] = parseFloat(cmykY.value);
            currentRgbColor = cmykToRgb(currentCmykColor);
            cmykToLab(currentCmykColor);
            cmykToXyz(currentCmykColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
        case "cmyk-k":
            currentCmykColor[3] = parseFloat(cmykK.value);
            currentRgbColor = cmykToRgb(currentCmykColor);
            cmykToLab(currentCmykColor);
            cmykToXyz(currentCmykColor);
            updateAllValues();
            picker.color.rgbString = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            colorIndicator.textContent = `rgb(${currentRgbColor[0]},${currentRgbColor[1]},${currentRgbColor[2]})`;
            break;
    }
})

const pallete = document.querySelector('.color-list');
pallete.addEventListener('click', (e) => {
    switch(e.target.id){
        case "color-1":
            processPalleteColor("#90F1EF");
            break;
        case "color-2":
            processPalleteColor("#ffd6e0");
            break;
        case "color-3":
            processPalleteColor("#ffef9f");
            break;
        case "color-4":
            processPalleteColor("#c1fba4");
            break;
        case "color-5":
            processPalleteColor("#7bf1a8");
            break;
    }
});

const hexToRgb = (hexString) => {
    const r = parseInt(hexString.slice(1, 3), 16);
    const g = parseInt(hexString.slice(3, 5), 16);
    const b = parseInt(hexString.slice(5, 7), 16);

    return [r, g, b];
}

const processPalleteColor = (colorHex) => {
    colorIndicator.style.backgroundColor = colorHex;
    picker.color.hexString = colorHex;

    currentRgbColor = hexToRgb(colorHex);
    currentCmykColor = rgbToCmyk(currentRgbColor);
    currentLabColor = rgbToLab(currentRgbColor);
    currentXyzColor = rgbToXyz(currentRgbColor);

    updateAllValues();
}