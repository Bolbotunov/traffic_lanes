import Road from "../classes/Road.js";
import constants from "../constants/constants.js";

const { sizeFieldW, sizeFieldH, SVG_NS, XLINK_NS } = constants;
export const gameField = document.querySelector(".field");

export function createFieldSVG() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", sizeFieldW);
  svg.setAttribute("height", sizeFieldH);
  svg.setAttribute("viewBox", "0 50 870 690");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("class", "mainSVG");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("xmlns:xlink", XLINK_NS);
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.backgroundImage = "url(assets/t1.png)";
  gameField.appendChild(svg);
  return svg;
}

export function createMap(fieldSVG) {
  let offsetX = -88,
    offsetY = 20,
    n = 5;
  for (let i = 0; i < n; i++) {
    const roadPart = new Road(fieldSVG, offsetX, 320, 0);
    roadPart.draw();
    offsetX += 100;
  }
  let crossroads = new Road(fieldSVG, 355, 315, 0);
  crossroads.drawCrossroads();
  offsetX = 510;
  for (let i = 0; i < n; i++) {
    const roadPart = new Road(fieldSVG, offsetX, 320, 0);
    roadPart.draw();
    offsetX += 100;
  }
  n = 3;
  for (let i = 0; i < n; i++) {
    offsetX = 511;
    const roadPart = new Road(fieldSVG, offsetX, offsetY, 90);
    roadPart.draw();
    offsetY += 100;
  }
  offsetY = 470;
  for (let i = 0; i < n; i++) {
    offsetX = 511;
    const roadPart = new Road(fieldSVG, offsetX, offsetY, 90);
    roadPart.draw();
    offsetY += 100;
  }
  offsetX = 294;
  offsetY = 419;
}
