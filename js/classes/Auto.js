import constants from "../constants/constants.js";
const { SVG_NS, SVG_CONTAINER_SEL } = constants;
import gameStore from "../store/gameStore.js";
let {
  trafficLightsArray,
  cars,
  pathsLengths,
  elapsedTime,
  isVibrating,
  canMove,
} = gameStore;
import { checkCollision } from "../utils/checkCollision.js";
import { crushSound, beepSound } from "../lib/definitions.js";

function crushSoundFn() {
  if (isAudioPlayed) {
    return;
  } else {
    crushSound.currentTime = 0;
    crushSound.volume = 0.5;
    crushSound.play();
    isAudioPlayed = true;
    beepSound.volume = 0.5;
    beepSound.play();
    beepSound.currentTime = 0;
  }
}
export default class Auto {
  constructor(route, typeCar, speed, IsTurns, crash, addClass) {
    this.fieldSVG = document.querySelector(SVG_CONTAINER_SEL);
    this.route = route;
    this.typeCar = typeCar;
    this.rotateCar = 0;
    this.speed = speed || 2.5;
    this.position = 0;
    this.originalSpeed = this.speed;
    this.IsTurns = IsTurns;
    this.prevPoint = { x: 0, y: 0 };
    this.crash = crash;
    this.stoppedTime = null;
    this.waitingTime = 14;
    this.addClass = addClass;
    this.autoElement = null;
  }

  createAuto() {
    const groupImages = document.createElementNS(SVG_NS, "g");
    groupImages.classList.add(this.addClass);
    const auto = document.createElementNS(SVG_NS, "image");
    auto.setAttribute("href", this.typeCar);
    auto.setAttribute("width", "30");
    auto.setAttribute("x", "0");
    auto.setAttribute("y", "-6");
    auto.setAttribute("height", "15");
    auto.setAttribute("transform", "translate(0, 0)");
    groupImages.appendChild(auto);
    let posY;
    if (this.IsTurns === "right") {
      posY = 4;
      createIndicators();
    } else if (this.IsTurns === "left") {
      posY = -4;
      createIndicators();
    }

    function createIndicators() {
      const indicatorBack = document.createElementNS(SVG_NS, "rect");
      indicatorBack.setAttribute("x", "0");
      indicatorBack.setAttribute("y", posY);
      indicatorBack.setAttribute("width", "3");
      indicatorBack.setAttribute("height", "4");
      indicatorBack.setAttribute("fill", "#fefe18");
      indicatorBack.setAttribute("class", "blinker glow");

      const indicatorForward = document.createElementNS(SVG_NS, "rect");
      indicatorForward.setAttribute("x", "26");
      indicatorForward.setAttribute("y", posY);
      indicatorForward.setAttribute("width", "2");
      indicatorForward.setAttribute("height", "4");
      indicatorForward.setAttribute("fill", "#fefe18");
      indicatorForward.setAttribute("class", "blinker glow");
      const cx = 26 + 0.5;
      const cy = 4 + 1.5;
      indicatorForward.setAttribute("transform", `rotate(35, ${cx}, ${cy})`);

      groupImages.appendChild(indicatorBack);
      groupImages.appendChild(indicatorForward);
    }

    groupImages.setAttribute("id", this.route);

    this.fieldSVG.appendChild(groupImages);
    this.autoElement = groupImages;

    return this;
  }

  move() {
    const pathInfo = pathsLengths[this.route];
    const safeDistance = 45;
    const slowDistance = safeDistance * 1.25;
    let car = this.autoElement;
    let carPosition = this.position;

    const group = document.querySelector(`g[id="${this.route}"]`);

    trafficLightsArray.forEach((tl) => {
      if (tl.routesControl.includes(car.id)) {
        if (!tl.trafficLightsOn) {
          if (
            carPosition > tl.stopAreaPosition[0] &&
            carPosition <= tl.stopAreaPosition[1]
          ) {
            this.speed = 0.9;
          }
          if (
            carPosition > tl.stopAreaPosition[1] &&
            carPosition <= tl.stopAreaPosition[2]
          ) {
            this.speed = 0;
            if (elapsedTime > 90) {
              this.checkStopTime(this.waitingTime / 1.5);
            } else {
              this.checkStopTime(this.waitingTime);
            }
          }
        } else {
          this.speed = this.originalSpeed;
        }
      }

      let carsOnSameRoute = cars.filter((car) => {
        return trafficLightsArray.some(
          (tl) =>
            tl.routesControl.includes(car.route) &&
            tl.routesControl.includes(this.route)
        );
      });

      carsOnSameRoute.sort((a, b) => a.position - b.position);
      let currentCarIndex = carsOnSameRoute.indexOf(this);

      if (currentCarIndex < carsOnSameRoute.length - 1) {
        let nextCar = carsOnSameRoute[currentCarIndex + 1];
        let distance = nextCar.position - this.position;

        if (distance <= slowDistance) {
          this.speed = 0.9;
        }
        if (distance <= safeDistance) {
          this.speed = 0;
        }
      }
    });

    function vibrating(vibro) {
      if ("vibrate" in navigator) {
        if (vibro) {
          navigator.vibrate(400);
        }
      }
    }

    cars.forEach((otherCar) => {
      if (otherCar !== this && checkCollision(this, otherCar)) {
        if (!isVibrating) {
          vibrating(true);
          isVibrating = true;
        }
        canMove = true;
        this.crash = true;
        otherCar.crash = true;
        this.speed = 0;
        otherCar.speed = 0;
        crushSoundFn();
        trafficLightsArray.forEach((item) => {
          item.setRed();
        });
      }
    });

    if (this.position < pathInfo.length) {
      this.position += this.speed * 0.5;
      const point = pathInfo.element.getPointAtLength(this.position);
      const nextPoint = pathInfo.element.getPointAtLength(
        this.position + this.speed * 0.5
      );
      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;
      if (dx !== 0 || dy !== 0) {
        this.rotateCar = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      this.autoElement.setAttribute(
        "transform",
        `translate(${point.x}, ${point.y}) rotate(${this.rotateCar})`
      );
    }

    if (this.position >= pathInfo.length) {
      this.autoElement.remove();
      cars = cars.filter((car) => car !== this);
    }
  }
  checkStopTime(waitingTime) {
    if (this.speed === 0) {
      this.stoppedTime += 1 / 60;
      if (
        this.stoppedTime >= waitingTime &&
        this.stoppedTime <= waitingTime + 2
      ) {
        this.speed = this.originalSpeed;

        return true;
      }
    }
  }
}
