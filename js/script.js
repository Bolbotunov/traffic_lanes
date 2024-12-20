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
    // route.setAttribute('stroke', stroke);
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
    this.createPathSVG("M6.05877 104.059C35.0987 104.059 55.5591 125.702 57.0588 155.559", "none", "#E5AE09", "2");
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


const roadPath = new Road(fieldSVG)
roadPath.createPath('route1', 'M0 410 L 870 410', 'black');
roadPath.createPath('route2', 'M0 410 L 360 410 C 400 400, 420 440, 424 480 L 424 740', 'green');
roadPath.createPath('route3', 'M0 410 L 380 410 C 380 400, 455 445, 448 280 L 448 0', 'red');


roadPath.createPath('route5', 'M870 385 L 0 385', 'grey');
roadPath.createPath('route6', 'M870 385 L 480 385 C 430 320, 465 340, 444 0 L 364 0', 'green');
roadPath.createPath('route4', 'M870 385 L 480 385 C 440 410, 420 440, 424 480 L 424 840', 'red');


roadPath.createPath('route7', 'M425 0 L 425 810', 'pink');
roadPath.createPath('route8', 'M425 0 L 425 300 C 425 300, 425 400, 350 385 L 0 385', 'green');
roadPath.createPath('route9', 'M425 0 L 425 300 C 425 380, 415 390, 450 405 L 870 410', 'red');

roadPath.createPath('route10', 'M445 810 L 445 0', 'black');
roadPath.createPath('route12', 'M445 810 L 445 490 C 455 430, 470 418, 480 410 L 870 410', 'green');
roadPath.createPath('route11', 'M445 810 L 445 470 C 450 400, 420 390, 390 385 L 0 385', 'red');




let elapsedTime = 0;
let elapsedTimeTraffic = 0
let checkTimeTraffic = 0
let checkTime = 0;
let indicatorTime = 0;
let waitingTime = 7
let newWaitingTime = 0
let timeOfCrazyRide = 1
let gameInterval;
let cars = []

class Auto {
  constructor(route, coordY, typeCar, speed, IsTurns) {
    this.coordY = coordY
    this.route = route;
    this.typeCar = typeCar;
    this.rotateCar = 0
    this.speed = speed || 3;
    this.position = 0;
    this.originalSpeed = this.speed;
    this.IsTurns = IsTurns
    this.prevPoint = { x: 0, y: 0 };
  }

  createAuto() {
    const groupImages = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const auto = document.createElementNS("http://www.w3.org/2000/svg", "image");
    auto.setAttribute('href', this.typeCar);
    auto.setAttribute('width', '30');
    auto.setAttribute('x', '0');
    auto.setAttribute('y', this.coordY);
    auto.setAttribute('height', '15');
    auto.setAttribute('transform', 'translate(0, 0)');
    groupImages.appendChild(auto);
    let posY
    if (whereTurns === 'right') {
      posY = 4
      createIndicators()
    } else if (whereTurns === 'left') {
      posY = -4
      createIndicators()
    }

    function createIndicators() {
      const indicatorBack = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      indicatorBack.setAttribute('x', '0');
      indicatorBack.setAttribute('y', posY);
      indicatorBack.setAttribute('width', '3');
      indicatorBack.setAttribute('height', '4');
      indicatorBack.setAttribute('fill', '#fefe18');
      indicatorBack.setAttribute('class', 'blinker glow');
  
      const indicatorForward = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      indicatorForward.setAttribute('x', '26');
      indicatorForward.setAttribute('y', posY);
      indicatorForward.setAttribute('width', '2');
      indicatorForward.setAttribute('height', '4');
      indicatorForward.setAttribute('fill', '#fefe18');
      indicatorForward.setAttribute('class', 'blinker glow');
      const cx = 26 + 0.5;
      const cy = 4 + 1.5;
      indicatorForward.setAttribute('transform', `rotate(35, ${cx}, ${cy})`)
  
  
      groupImages.appendChild(indicatorBack);
      groupImages.appendChild(indicatorForward);
    }
   
    groupImages.setAttribute('id', this.route);

    fieldSVG.appendChild(groupImages);
    this.autoElement = groupImages;


    return this;
  }

  move() {
    const pathInfo = pathsLengths[this.route];
    const safeDistance = 45;
    const slowDistance = safeDistance * 1.5
    let car = this.autoElement
    let carPosition = this.position


const group = document.querySelector(`g[id="${this.route}"]`);
const rects = group.querySelectorAll('rect');



// rects.forEach(rect => {
//     if (elapsedTime - indicatorTime < 0.5 && IsTurns) {
//       rect.setAttribute('fill-opacity', `1`)
//       console.log(rect.getAttribute('fill-opacity'))
//     } else if (elapsedTime - indicatorTime >= 0.5 && elapsedTime - checkTime <= 1  && IsTurns) {
//       rect.setAttribute('fill-opacity', '0');
//       console.log(rect.getAttribute('fill-opacity'))
//       indicatorTime = elapsedTime;
//     }
// });

    trafficLightsArray.forEach((tl) => {
      if (tl.routesControl.includes(car.id)) {
        if (!tl.trafficLightsOn) {
          if (elapsedTime - elapsedTimeTraffic <= waitingTime) {
            if (carPosition > tl.stopAreaPosition[0] && carPosition <= tl.stopAreaPosition[1]) {
              this.speed = 0.9;
            }
            if (carPosition > tl.stopAreaPosition[1] && carPosition <= tl.stopAreaPosition[2]) {
              this.speed = 0;
            }
          } else if (elapsedTime - elapsedTimeTraffic >= waitingTime && newWaitingTime <= timeOfCrazyRide) {
            newWaitingTime = elapsedTime - elapsedTimeTraffic - waitingTime;
            this.speed = this.originalSpeed;
          } else if (newWaitingTime >= timeOfCrazyRide) {
            elapsedTimeTraffic = elapsedTime;
            newWaitingTime = 0;
            if (carPosition <= tl.stopAreaPosition[2]) {
              this.speed = 0;
            }
          }
        } else {
          this.speed = this.originalSpeed;
        }
      }

    let carsOnSameRoute = cars.filter(car => {
      return trafficLightsArray.some(tl => tl.routesControl.includes(car.route) && tl.routesControl.includes(this.route));
    });

    carsOnSameRoute.sort((a, b) => a.position - b.position);
    let currentCarIndex = carsOnSameRoute.indexOf(this);
  
    if (currentCarIndex < carsOnSameRoute.length - 1) {
      let nextCar = carsOnSameRoute[currentCarIndex + 1];
      let distance = nextCar.position - this.position;
  
    if (distance <= slowDistance) {
      this.speed = 0.9
    }
    if (distance <= safeDistance) {
      this.speed = 0
    }
    }

  })


    cars.forEach(otherCar => {
      if (otherCar !== this && checkCollision(this, otherCar)) {
        this.speed = 0;
        otherCar.speed = 0;
      }
    });


// ====================================

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


    function checkCollision(car1, car2) {
  const rect1 = car1.autoElement.getBoundingClientRect();
  const rect2 = car2.autoElement.getBoundingClientRect();
  return (
    rect1.left + 6 < rect2.right &&
    rect1.right > rect2.left + 6 &&
    rect1.top + 6 < rect2.bottom &&
    rect1.bottom > rect2.top + 6
  )
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
        elapsedTimeTraffic = elapsedTime
        this.trafficLightsOn = false;
        colorTrafficLights.setAttribute('fill', 'red');
        elapsedTimeTraffic = elapsedTime;
      } else {
        this.trafficLightsOn = true;
        colorTrafficLights.setAttribute('fill', '#24AB12');
      }
    });
    return colorTrafficLights;
  }
}


let trafficLightsArray = [];

const TL1 = new TrafficLights('first', ['#route1', '#route2', '#route3'], ['270', '310', '350']);
const TL2 = new TrafficLights('second', ['#route4', '#route5', '#route6'], ['270', '310', '350']);
const TL3 = new TrafficLights('third', ['#route7', '#route8', '#route9'], ['230', '270', '310'])
const TL4 = new TrafficLights('forth', ['#route10', '#route11', '#route12'], ['250', '290', '340'])
TL1.createTrafficLights(353, 424);
TL2.createTrafficLights(499, 348);
TL3.createTrafficLights(388, 312);
TL4.createTrafficLights(464, 456);

trafficLightsArray.push(TL1, TL2, TL3, TL4);




function startGame() {
  if (!gameInterval) {
    gameInterval = setInterval(gameTimer, 1000 / 60);
  }
}

let whereTurns
function gameTimer() {
  elapsedTime += 1 / 60;
  const carsImg = 4;
  cars.forEach(car => {
    car.move()
  });

  if (elapsedTime - checkTime >= 0.7) {
    let randomImg = Math.floor(Math.random() * carsImg) + 1;
    let randomRoute = Math.floor(Math.random() * 12) + 1;
    const toStreight = 'streight'
    const toLeft = 'left'
    const toRight = 'right'
    const turnDirection = {
      1: toStreight,
      2: toRight,
      3: toLeft,
      4: toLeft,
      5: toStreight,
      6: toRight,
      7: toStreight,
      8: toRight,
      9: toLeft,
      10: toStreight,
      11: toLeft,
      12: toRight,
    }
    whereTurns = turnDirection[randomRoute];
    console.log(whereTurns)
    let newAuto = new Auto(`#route${randomRoute}`, -6, `assets/car${randomImg}.png`, 3, whereTurns).createAuto()
    cars.push(newAuto);
    checkTime = elapsedTime;
  }
}











    // cars.forEach(otherCar => {
    //   if (otherCar !== this && checkCollision(this, otherCar)) {
    //     this.speed = 0;
    //     otherCar.speed = 0;
    //     console.log('collision')
    //   }
    // });


    // function checkCollision(car1, car2) {
//   const rect1 = car1.autoElement.getBoundingClientRect();
//   const rect2 = car2.autoElement.getBoundingClientRect();
// console.log(rect1.left, rect1.right, rect1.top, rect1.bottom)
// console.log(rect2.left, rect2.right, rect2.top, rect2.bottom)
//   return (
//     rect1.left < rect2.right &&
//     rect1.right > rect2.left &&
//     rect1.top < rect2.bottom &&
//     rect1.bottom > rect2.top
//   )
// }

