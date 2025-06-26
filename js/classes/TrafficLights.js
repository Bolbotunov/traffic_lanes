import constants from "../constants/constants.js";
import gameStore from "../store/gameStore.js";
const { SVG_NS, greenColor } = constants;
const { trafficLightsState, arrFogs, fogTimeLine, trafficLightsArray } =
  gameStore;

export default class TrafficLights {
  constructor(setClass, routesControl, stopAreaPosition, fieldSVG) {
    this.setClass = setClass;
    this.fieldSVG = fieldSVG;
    this.colorTrafficLights = greenColor;
    this.trafficLightsOn = trafficLightsState[this.setClass];
    this.routesControl = routesControl;
    this.stopAreaPosition = stopAreaPosition;
    this.routeStopped = {};
  }

  createTrafficLights(coordinatesX, coordinatesY) {
    let trafficLightsSVG = document.createElementNS(SVG_NS, "g");
    trafficLightsSVG.setAttribute(
      "transform",
      `translate(${coordinatesX}, ${coordinatesY})`
    );

    let colorTrafficLights = document.createElementNS(SVG_NS, "path");
    colorTrafficLights.setAttribute(
      "d",
      "M24.5 12.5C24.5 19.1274 19.1274 24.5 12.5 24.5C5.87258 24.5 0.5 19.1274 0.5 12.5C0.5 5.87258 5.87258 0.5 12.5 0.5C19.1274 0.5 24.5 5.87258 24.5 12.5Z"
    );
    colorTrafficLights.setAttribute(
      "fill",
      this.trafficLightsOn ? greenColor : "red"
    );
    colorTrafficLights.setAttribute("class", `${this.setClass}`);
    colorTrafficLights.setAttribute(
      "stroke",
      this.trafficLightsOn ? greenColor : "red"
    );
    this.colorTrafficLights = colorTrafficLights;

    let icon = document.createElementNS(SVG_NS, "svg");
    icon.setAttribute("width", "20");
    icon.setAttribute("height", "20");
    icon.setAttribute("viewBox", "0 0 25 25");
    icon.setAttribute("fill", "none");
    icon.appendChild(colorTrafficLights);
    trafficLightsSVG.appendChild(icon);

    this.fieldSVG.appendChild(trafficLightsSVG);

    colorTrafficLights.addEventListener("click", () => {
      this.toggleTrafficLights();
      this.updateDivTrafficLights();
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    });

    return colorTrafficLights;
  }

  toggleTrafficLights() {
    this.trafficLightsOn = !this.trafficLightsOn;
    trafficLightsState[this.setClass] = this.trafficLightsOn;
    this.colorTrafficLights.setAttribute(
      "fill",
      this.trafficLightsOn ? greenColor : "red"
    );
    this.updateDivTrafficLights();
  }

  updateDivTrafficLights() {
    document.querySelectorAll(`.${this.setClass}`).forEach((light) => {
      light.style.backgroundColor = this.trafficLightsOn ? greenColor : "red";
    });
  }

  setRed() {
    this.trafficLightsOn = false;
    trafficLightsState[this.setClass] = this.trafficLightsOn;
    this.colorTrafficLights.setAttribute("fill", "red");
    this.updateDivTrafficLights();
  }
  setGreen() {
    this.trafficLightsOn = true;
    trafficLightsState[this.setClass] = this.trafficLightsOn;
    this.colorTrafficLights.setAttribute("fill", greenColor);
    this.updateDivTrafficLights();
  }
}
