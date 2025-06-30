import constants from "../constants/constants.js";
const { SVG_NS } = constants;

export default class House {
  constructor(fieldSVG) {
    this.fieldSVG = fieldSVG;
  }
  createHouse(x, y, typeHouse) {
    const houseGroup = document.createElementNS(SVG_NS, "g");
    houseGroup.setAttribute("transform", `translate(${x}, ${y})`);
    const house = document.createElementNS(SVG_NS, "image");
    house.setAttribute("href", `assets/house${typeHouse}.png`);
    house.setAttribute("width", "100");
    house.setAttribute("height", "100");
    houseGroup.appendChild(house);
    this.fieldSVG.appendChild(houseGroup);
    return houseGroup;
  }
  fillMapHouses(houses) {
    houses.forEach((house) => {
      this.createHouse(house.x, house.y, house.typeHouse, this.fieldSVG);
    });
  }
}
