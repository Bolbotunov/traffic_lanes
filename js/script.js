const body = document.body;
const gameField = document.querySelector('.field')
gameField.style.position = 'relative'
let start = document.querySelector('.start')
let pathsLengths = {}
let sizeFieldH = 600
let sizeFieldW = 750
start.addEventListener('click', startGame)

class Road {
  constructor(fieldSVG, offsetX = 0, offsetY = 0, angle) {
    this.fieldSVG = fieldSVG;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.angle = angle
    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.group.setAttribute('transform', `translate(${this.offsetX}, ${this.offsetY}) rotate(${this.angle})`);
    this.fieldSVG.appendChild(this.group);
  }

  createRect(x, y, width, height, transform, fill) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('transform', transform, `rotate(${this.angle})`);
    rect.setAttribute('fill', fill);
    this.group.appendChild(rect);
  }

  createPathSVG(d, fill, stroke, strokeWidth) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', strokeWidth);
    this.group.appendChild(path);
  } 

  createPath(id, pathCoordinates, stroke) {
    let route = document.createElementNS("http://www.w3.org/2000/svg", "path");
    route.setAttribute('id', id);
    route.setAttribute('d', pathCoordinates);
    route.setAttribute('stroke', stroke);
    route.setAttribute('fill', 'transparent');
    fieldSVG.appendChild(route);
    let pathLength = route.getTotalLength();
    pathsLengths[`#${id}`] = { length: pathLength, element: route }
  }

  draw() {
    this.createRect('100', '100', '100', '50', 'rotate(-180 100 100)', '#D9D9D9');
    this.createRect('50', '52', '2', '10', 'rotate(-90 75 52)', 'white');
    this.createRect('0', '52', '2', '10', 'rotate(-90 25 52)', 'white');
    this.createRect('25', '52', '2', '10', 'rotate(-90 50 52)', 'white');
    this.createRect('-25', '52', '2', '10', 'rotate(-90 0 52)', 'white');
    this.createRect('-48', '4', '2', '100', 'rotate(-90 0 4)', '#E5AE09');
    this.createRect('2', '-4', '2', '100', 'rotate(90 0 96)', '#E5AE09');
  }

  drawCrossroads() {
    this.createPathSVG("M43.5588 40.059L54.5588 24.059L57.5588 5.05896H104.559L109.059 24.059L118.559 40.059L135.559 52.059L156.059 56.559V104.059L135.559 108.559L118.059 120.559L108.059 136.559L105.059 155.059H57.0588L54.0588 138.059L43.5588 120.559L27.5588 108.059L6.05884 104.059V56.059L27.0588 52.059L43.5588 40.059Z", "#D9D9D9", "none", "0");
    this.createPathSVG("M105.059 155.059C105.059 126.019 126.702 105.559 156.559 104.059", "none", "#E5AE09", "2");
    this.createPathSVG("M156.059 56.0588C127.019 56.0587 106.559 34.4154 105.059 4.55893", "none", "#E5AE09", "2");
    this.createPathSVG("M57.0587 5.05893C57.0586 34.0989 35.9153 54.5592 6.05884 56.059", "none", "#E5AE09", "2");
    this.createPath("M6.05877 104.059C35.0987 104.059 55.5591 125.702 57.0588 155.559", "none", "#E5AE09", "2");
    this.createRect("6", "81", "4", "22", "", "white");
    this.createRect("152", "57", "4", "22", "", "white");
    this.createRect("58", "9", "4", "22", "rotate(-90 58 9)", "white");
    this.createRect("82", "155", "4", "22", "rotate(-90 82 155)", "white");
  }
}

let fieldSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
fieldSVG.style.backgroundColor = '#8fe577';
fieldSVG.setAttribute('width', `${sizeFieldW}`);
fieldSVG.setAttribute('height', `${sizeFieldH}`);
fieldSVG.setAttribute('viewBox', '0 50 870 690');
fieldSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
fieldSVG.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
gameField.appendChild(fieldSVG);


function createMap() {
  let n = 4;
  offsetX = -38;
  offsetY = 20
  for (let i = 0; i < n; i++) {
    const roadPart = new Road(fieldSVG, offsetX, 320, 0);
    roadPart.draw();
    offsetX += 100;
  }
  let crossroads = new Road(fieldSVG, 355, 315, 0);
  crossroads.drawCrossroads();
  offsetX = 510
  for (let i = 0; i < n; i++) {
    const roadPart = new Road(fieldSVG, offsetX, 320, 0);
    roadPart.draw();
    offsetX += 100;
  }
  n = 3
  for (let i = 0; i < n; i++) {
    offsetX = 511
    const roadPart = new Road(fieldSVG, offsetX, offsetY, 90);
    roadPart.draw();
    offsetY += 100;
  }
  offsetY = 470
  for (let i = 0; i < n; i++) {
    offsetX = 511
    const roadPart = new Road(fieldSVG, offsetX, offsetY, 90);
    roadPart.draw();
    offsetY += 100;
  }
}
createMap()


const roadPath = new Road(fieldSVG); // создание пути для автомобилей
roadPath.createPath('route1', 'M0 410 L 870 410', 'black');
roadPath.createPath('route2', 'M0 410 L 340 410 C 440 410, 420 440, 424 480 L 424 740', 'blue');
// route 3


roadPath.createPath('route3', 'M870 385 L 0 385', 'grey');
// route 5
// route 6

// roadPath.createPath('route7', 'M425 0 L 425 810', 'red');
// // route 8
// // route 9

// roadPath.createPath('route10', 'M445 810 L 445 0', 'black');
// roadPath.createPath('route11', 'M450 760 L 455 470 C 450 420, 460 390, 360 390 L 0 385', 'green');
// // route 12



let elapsedTime = 0;
let elapsedTimeTraffic = 0
let checkTimeTraffic = 0
let checkTime = 0;
let waitingTime = 5
let newWaitingTime = 0
let timeOfCrazyRide = 2
let gameInterval;
let cars = []; // Массив для хранения всех созданных машинок

class Auto {
  constructor(route, coordY, typeCar, speed, R) {
    this.R = R
    this.coordY = coordY
    this.route = route;
    this.typeCar = typeCar;
    this.animateMotion = null;
    this.rotateCar = 0
    this.speed = speed || 3;
    this.position = 0; 
    this.originalSpeed = this.speed;
    this.prevPoint = { x: 0, y: 0 };
  }

 createAuto() {
    const auto = document.createElementNS("http://www.w3.org/2000/svg", "image");
    auto.setAttribute('href', this.typeCar);
    auto.setAttribute('width', '35');
    auto.setAttribute('x', '0');
    auto.setAttribute('y', this.coordY);
    auto.setAttribute('height', '35');
    auto.setAttribute('transform', 'translate(0, 0)');
    auto.setAttribute('id', this.route);
    this.autoElement = auto;
    fieldSVG.appendChild(auto);
    return this;
  }

  move() {
    const pathInfo = pathsLengths[this.route];
    let safeDistance = 45;
    let firstCarStop = false;
    let positionFirstCar;
    let positionForwardCar;
  
    trafficLightsArray.forEach(tl => {
      if (!tl.trafficLightsOn) {
        console.log(`выключен ${tl.id}`);
        cars.forEach((item, index) => {
          if (tl.routesControl.includes(item.route) && item.position >= tl.stopAreaPosition[0] && item.position <= tl.stopAreaPosition[1]) {
            item.speed = 0.9;
            positionFirstCar = item.position;
          } else if (tl.routesControl.includes(item.route) && item.position > tl.stopAreaPosition[1] && item.position <= tl.stopAreaPosition[2]) {
            item.speed = 0;
            positionFirstCar = item.position;
            firstCarStop = true;
            positionForwardCar = positionFirstCar;
          } else if (tl.routesControl.includes(item.route) && firstCarStop) {
            let previousCar = cars[index];
            if (tl.routesControl.includes(item.route) && positionFirstCar - previousCar.position < safeDistance * 1.5 && positionFirstCar - previousCar.position >= safeDistance) {
              previousCar.speed = 0.7;
              positionFirstCar = previousCar.position;
            } else if (tl.routesControl.includes(item.route) && positionFirstCar - previousCar.position <= safeDistance) {
              previousCar.speed = 0;
              positionFirstCar = previousCar.position;
            }
          }
        });
      }
    });
  
    if (this.position < pathInfo.length) {
      this.position += this.speed * 0.5;
      const point = pathInfo.element.getPointAtLength(this.position);
      const nextPoint = pathInfo.element.getPointAtLength(this.position + this.speed * 0.5);
      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;
      if (dx !== 0 || dy !== 0) {
        this.rotateCar = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      this.autoElement.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${this.rotateCar})`);
    }
  
    if (this.position >= pathInfo.length) {
      this.autoElement.remove();
      cars = cars.filter(car => car !== this);
    }
  }
}  
// ===================Светофор==================================
class TrafficLights {
  constructor(id, routesControl, stopAreaPosition) {
    this.id = id;
    this.colorTrafficLights = '#24AB12';
    this.trafficLightsOn = true;
    this.routesControl = routesControl;
    this.stopAreaPosition = stopAreaPosition;
    this.routeStopped = {}
  }

  createTrafficLights(coordinatesX, coordinatesY) {
    let trafficLightsSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    trafficLightsSVG.setAttribute('transform', `translate(${coordinatesX}, ${coordinatesY})`);

    let colorTrafficLights = document.createElementNS("http://www.w3.org/2000/svg", "path");
    colorTrafficLights.setAttribute("d", "M24.5 12.5C24.5 19.1274 19.1274 24.5 12.5 24.5C5.87258 24.5 0.5 19.1274 0.5 12.5C0.5 5.87258 5.87258 0.5 12.5 0.5C19.1274 0.5 24.5 5.87258 24.5 12.5Z");
    colorTrafficLights.setAttribute("fill", "#24AB12");
    colorTrafficLights.setAttribute('id', `${this.id}`);
    colorTrafficLights.setAttribute("stroke", this.colorTrafficLights);

    let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", "20");
    icon.setAttribute("height", "20");
    icon.setAttribute("viewBox", "0 0 25 25");
    icon.setAttribute("fill", "none");
    icon.appendChild(colorTrafficLights);
    trafficLightsSVG.appendChild(icon);
    
    fieldSVG.appendChild(trafficLightsSVG);

    colorTrafficLights.addEventListener('click', () => {
      if (this.trafficLightsOn) {
        this.trafficLightsOn = false;
        colorTrafficLights.setAttribute('fill', 'red');
        elapsedTimeTraffic = elapsedTime;
        cars.forEach(item => {
          if (this.routesControl.includes(item.route) && item.position >= this.stopAreaPosition[0] && item.position <= this.stopAreaPosition[1]) {
            item.speed = 0;
          }
        });
      } else {
        this.trafficLightsOn = true;
        colorTrafficLights.setAttribute('fill', '#24AB12');
        cars.forEach(item => {
          if (this.routesControl.includes(item.route)) {
            item.speed = item.originalSpeed;
          }
        });
      }
    });
    return colorTrafficLights;
  }
}

// // let TL3 = new TrafficLights('third').createTrafficLights('413', '326')
// // let TL4 = new TrafficLights('fourth').createTrafficLights('438', '444')

let trafficLightsArray = [];

const TL1 = new TrafficLights('first', ['#route1', '#route2'], ['280', '295', '310']);
const TL2 = new TrafficLights('second', ['#route3'], ['250', '265', '280']);
TL1.createTrafficLights(353, 420);
TL2.createTrafficLights(499, 348);

trafficLightsArray.push(TL1, TL2);

function startGame() {
  if (!gameInterval) {
    gameInterval = setInterval(gameTimer, 1000 / 60);
  }
}

function gameTimer() {
  elapsedTime += 1 / 60;
  const carsImg = 3;
  cars.forEach(car => car.move());

  if (elapsedTime - checkTime >= 1) {
    let randomImg = Math.floor(Math.random() * carsImg) + 1;
    let randomRoute = Math.floor(Math.random() * 3) + 1;
    let coordY = '-19'
    let newAuto = new Auto(`#route${randomRoute}`, `${coordY}`, `assets/car${randomImg}.png`, 3, 0).createAuto();
    cars.push(newAuto);
    checkTime = elapsedTime;
  }
}

