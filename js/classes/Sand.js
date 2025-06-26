import constants from "../constants/constants.js";
const { SVG_NS } = constants;

export default class Sand {
  constructor(fieldSVG) {
    this.fieldSVG = fieldSVG;
  }
  createSand(x, y, width, height) {
    const sand = document.createElementNS(SVG_NS, "image");
    sand.setAttribute("href", "assets/sand.png");
    sand.setAttribute("width", width);
    sand.setAttribute("height", height);

    const sandGroup = document.createElementNS(SVG_NS, "g");
    sandGroup.setAttribute("class", "sand");
    sandGroup.setAttribute("transform", `translate(${x}, ${y})`);
    sandGroup.appendChild(sand);
    this.fieldSVG.appendChild(sandGroup);
  }
}
