import constants from "../constants/constants.js";
const { SVG_NS } = constants;

export default class Fog {
  constructor(fieldSVG, href, fogSpeed, x) {
    this.fieldSVG = fieldSVG;
    this.href = href;
    this.fogSpeed = fogSpeed;
    this.x = x;
    this.fog = null;
  }
  createFog(width, height, y, opacity) {
    let fog = document.createElementNS(SVG_NS, "image");
    fog.setAttribute("width", width);
    fog.setAttribute("height", height);
    fog.setAttribute("x", this.x);
    fog.setAttribute("y", y);
    fog.setAttribute("href", this.href);
    fog.setAttribute("opacity", opacity);
    fog.style.pointerEvents = "none";
    this.fieldSVG.appendChild(fog);
    this.fog = fog;
    return this;
  }
  fogMove() {
    this.x += this.fogSpeed;
    if (!this.fog) return;
    this.fog.setAttribute("x", this.x);
  }
  isOffscreen() {
    const width = parseFloat(this.fieldSVG.getAttribute("width"));
    return this.x >= width;
  }
  remove() {
    if (this.fog) this.fog.remove();
  }
}
