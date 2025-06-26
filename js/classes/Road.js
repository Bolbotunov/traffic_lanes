import constants from "../constants/constants.js";
const { SVG_NS } = constants;

export default class Road {
  constructor(fieldSVG, offsetX = 0, offsetY = 0, angle = 0, pathsLengths) {
    this.fieldSVG = fieldSVG;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.angle = angle;
    this.pathsLengths = pathsLengths;

    this.group = document.createElementNS(SVG_NS, "g");
    this.group.setAttribute(
      "transform",
      `translate(${this.offsetX}, ${this.offsetY}) rotate(${this.angle})`
    );
    this.fieldSVG.appendChild(this.group);
  }

  createRect(x, y, width, height, transform, fill, id = null) {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("transform", transform);
    rect.setAttribute("fill", fill);
    if (id) rect.setAttribute("id", id);
    this.group.appendChild(rect);
  }

  createPathSVG(d, fill, stroke, strokeWidth) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", fill);
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", strokeWidth);
    this.group.appendChild(path);
  }

  createPath(id, pathCoordinates) {
    const route = document.createElementNS(SVG_NS, "path");
    route.setAttribute("id", id);
    route.setAttribute("d", pathCoordinates);
    route.setAttribute("fill", "transparent");
    this.fieldSVG.appendChild(route);

    const length = route.getTotalLength();
    if (this.pathsLengths) {
      this.pathsLengths[`#${id}`] = { length, element: route };
    }
  }

  draw() {
    this.createRect(
      "100",
      "100",
      "100",
      "50",
      "rotate(-180 100 100)",
      "#D9D9D9"
    );
    this.createRect("50", "52", "2", "10", "rotate(-90 75 52)", "white");
    this.createRect("0", "52", "2", "10", "rotate(-90 25 52)", "white");
    this.createRect("25", "52", "2", "10", "rotate(-90 50 52)", "white");
    this.createRect("-25", "52", "2", "10", "rotate(-90 0 52)", "white");
    this.createRect("-48", "4", "2", "100", "rotate(-90 0 4)", "#E5AE09");
    this.createRect("2", "-4", "2", "100", "rotate(90 0 96)", "#E5AE09");
  }

  drawCrossroads() {
    const coords = [
      [
        "M43.5588 40.059L54.5588 24.059L57.5588 5.05896H104.559L109.059 24.059L118.559 40.059L135.559 52.059L156.059 56.559V104.059L135.559 108.559L118.059 120.559L108.059 136.559L105.059 155.059H57.0588L54.0588 138.059L43.5588 120.559L27.5588 108.059L6.05884 104.059V56.059L27.0588 52.059L43.5588 40.059Z",
        "#D9D9D9",
        "none",
        "0",
      ],
      [
        "M105.059 155.059C105.059 126.019 126.702 105.559 156.559 104.059",
        "none",
        "#E5AE09",
        "2",
      ],
      [
        "M156.059 56.0588C127.019 56.0587 106.559 34.4154 105.059 4.55893",
        "none",
        "#E5AE09",
        "2",
      ],
      [
        "M57.0587 5.05893C57.0586 34.0989 35.9153 54.5592 6.05884 56.059",
        "none",
        "#E5AE09",
        "2",
      ],
      [
        "M6.05877 104.059C35.0987 104.059 55.5591 125.702 57.0588 155.559",
        "none",
        "#E5AE09",
        "2",
      ],
    ];

    coords.forEach(([d, fill, stroke, width]) =>
      this.createPathSVG(d, fill, stroke, width)
    );

    this.createRect("6", "81", "4", "22", "", "white");
    this.createRect("152", "57", "4", "22", "", "white");
    this.createRect("58", "9", "4", "22", "rotate(-90 58 9)", "white");
    this.createRect("82", "155", "4", "22", "rotate(-90 82 155)", "white");
  }
}
