import constants from "../constants/constants.js";
const { SVG_NS } = constants;

export default class Trees {
  constructor(fieldSVG) {
    this.fieldSVG = fieldSVG;
  }

  createTree(x, y, randomTree, randomMotion) {
    const trees = document.createElementNS(SVG_NS, "image");
    trees.setAttribute("href", `assets/tree${randomTree}.png`);
    trees.setAttribute("width", "100");
    trees.setAttribute("height", "100");
    trees.setAttribute("class", `motionTrees${randomMotion}`);
    const treesGroup = document.createElementNS(SVG_NS, "g");
    treesGroup.setAttribute("transform", `translate(${x}, ${y})`);
    treesGroup.appendChild(trees);
    this.fieldSVG.appendChild(treesGroup);
  }
  createForest(
    count,
    startCoordinatesX,
    finishCoordinatesX,
    startCoordinatesY,
    finishCoordinatesY,
    step
  ) {
    for (let i = 0; i < count; i++) {
      let randomMotion = Math.floor(Math.random() * 3) + 1;
      let randomTree = Math.floor(Math.random() * 4) + 1;
      let randomTreeX =
        Math.floor(
          Math.random() * (finishCoordinatesX - startCoordinatesX / step + 1)
        ) + startCoordinatesX;
      let randomTreeY =
        Math.floor(
          Math.random() * (finishCoordinatesY - startCoordinatesY / step + 1)
        ) + startCoordinatesY;
      this.createTree(randomTreeX, randomTreeY, randomTree, randomMotion);
    }
  }
}
