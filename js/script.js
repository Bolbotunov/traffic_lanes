const body = document.body;
const gameField = document.querySelector('.field')
gameField.style.position = 'relative'
let start = document.querySelector('.start-btn')
let gameContainer = document.querySelector('.container')
let startMenu = document.querySelector('.start-menu')
let restart = document.querySelector('.restart')
let evacuateBtn = document.querySelector('.evacuate-btn')
let leftNav = document.querySelector('.left-navigation')
let rightNav = document.querySelector('.right-navigation')
let pathsLengths = {}
let sizeFieldH = 600
let sizeFieldW = 700
let timer = document.querySelector('.menu-timer')
let timeFromStart = 0
let night = document.querySelector('.layout')
let gameOrientation = window.screen.orientation;
let warningOrientation = document.querySelector('.orientation-warning')
console.log(gameOrientation)

if (gameOrientation.type === 'portrait-primary') {
  warningOrientation.style.display = 'none'
  startMenu.style.display = 'flex'
} 

// else if (gameOrientation.type === 'portrait-primary' && gameInterval) {
//   warningOrientation.style.display = 'flex'
// }

start.addEventListener('click', startGame)

// restart.addEventListener('click', restartGame)

function restartGame() {
  location.reload();
  fullScreen(document.documentElement);
}



function updateHeight() {
  const fieldHeight = window.innerHeight * 0.75;
  gameField.style.setProperty('--field-height', `${fieldHeight}px`);
}

updateHeight();
window.addEventListener('resize', updateHeight);



function fullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function getViewportSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  console.log(`Ширина видимой области: ${width}px`);
  console.log(`Высота видимой области: ${height}px`);
}

function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  console.log(`Ширина видимой области после изменения: ${width}px`);
  console.log(`Высота видимой области после изменения: ${height}px`);
}

getViewportSize();
window.addEventListener('resize', handleResize);

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

  createRect(x, y, width, height, transform, fill, id = null) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('transform', transform);
    rect.setAttribute('fill', fill);
    if (id) rect.setAttribute('id', id);
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
    this.createPathSVG("M6.05877 104.059C35.0987 104.059 55.5591 125.702 57.0588 155.559", "none", "#E5AE09", "2");
    this.createRect("6", "81", "4", "22", "", "white");
    this.createRect("152", "57", "4", "22", "", "white");
    this.createRect("58", "9", "4", "22", "rotate(-90 58 9)", "white");
    this.createRect("82", "155", "4", "22", "rotate(-90 82 155)", "white");
  }
  // drawPlatform() {
  //   this.createRect('62.311', '75.9492', '21', '80.0999', 'rotate(-141.176 62.311 75.9492)', '#D4BC74');
  //   this.createRect('-2.46187', '89.9216', '51.3934', '60.3702', 'rotate(-51.0494 -2.46187 89.9216)', '#E5AE09', 'activeArea');
  // }
  
}

let fieldSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
fieldSVG.style.backgroundImage = 'url(assets/t1.png)';
fieldSVG.setAttribute('width', `${sizeFieldW}`);
fieldSVG.setAttribute('height', `${sizeFieldH}`);
fieldSVG.setAttribute('class', 'mainSVG');
fieldSVG.setAttribute('viewBox', '0 50 870 690');
fieldSVG.setAttribute('preserveAspectRatio', 'xMidYMid meet');
fieldSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
fieldSVG.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
fieldSVG.style.width = '100%';
fieldSVG.style.height = '100%';
gameField.appendChild(fieldSVG);


// ======== Песок ==============

class Sand {
  constructor(fieldSVG) {
    this.fieldSVG = fieldSVG;
  }
  createSand(x, y, width, height) {
    const sand = document.createElementNS("http://www.w3.org/2000/svg", "image");
    sand.setAttribute('href', 'assets/sand.png');
    sand.setAttribute('width', width);
    sand.setAttribute('height', height);

    const sandGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    sandGroup.setAttribute('class', 'sand');
    sandGroup.setAttribute('transform', `translate(${x}, ${y})`);
    sandGroup.appendChild(sand);
    this.fieldSVG.appendChild(sandGroup);
  }
}

let sandInstance = new Sand(fieldSVG);
sandInstance.createSand(0, 0, 400, 400)
sandInstance.createSand(400, 0, 400, 400);
sandInstance.createSand(550, 400, 280, 300);
sandInstance.createSand(150, 570, 250, 300);


// =================== ДОМА =============================

class House {
  constructor(fieldSVG) {
    this.fieldSVG = fieldSVG;
  }
  createHouse(x, y, typeHouse) {
    const houseGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    houseGroup.setAttribute('transform', `translate(${x}, ${y})`);
    const house = document.createElementNS("http://www.w3.org/2000/svg", "image");
    house.setAttribute('href', `assets/house${typeHouse}.png`);
    house.setAttribute('width', '100');
    house.setAttribute('height', '100');
    houseGroup.appendChild(house);
    fieldSVG.appendChild(houseGroup);
    return houseGroup
  }
  fillMapHouses(houses) {
    houses.forEach((house) => {
      this.createHouse(house.x, house.y, house.typeHouse, fieldSVG)
    })
  }
}

const houses1 = [
  {x: 500, y: 30, typeHouse: '1'},
  {x: 500, y: 130, typeHouse: '3'},
  {x: 500, y: 230, typeHouse: '2'},
  {x: 650, y: 30, typeHouse: '2'},
  {x: 650, y: 130, typeHouse: '1'},
  {x: 650, y: 230, typeHouse: '3'},
]

const houses2 = [
  {x: 500, y: 430, typeHouse: '2'},
  {x: 570, y: 530, typeHouse: '3'},
  {x: 500, y: 630, typeHouse: '1'},
  {x: 700, y: 480, typeHouse: '3'},
  {x: 700, y: 630, typeHouse: '2'},
]

const houses3 = [
  {x: 280, y: 550, typeHouse: '2'},
  {x: 280, y: 660, typeHouse: '1'},
  {x: 280, y: 440, typeHouse: '3'},
]


let houseSample = new House(fieldSVG)
let createHouses1 =  houseSample.fillMapHouses(houses1);
let createHouses2 =  houseSample.fillMapHouses(houses2);
let createHouses3 =  houseSample.fillMapHouses(houses3);


function createMap() {
  let n = 5;
  offsetX = -88;
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
  offsetX = 294
  offsetY = 419
  // const evacuatePlatform = new Road(fieldSVG, offsetX, offsetY, 5)
  // evacuatePlatform.drawPlatform()
}
createMap()


const roadPath = new Road(fieldSVG)
roadPath.createPath('route1', 'M0 410 L 870 410', 'black');
roadPath.createPath('route2', 'M0 410 L 380 410 C 400 400, 420 440, 424 480 L 424 740', 'green');
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


// ================Машинки=================================

let elapsedTime = 0;
let elapsedTimeTraffic = 0
let checkTimeTraffic = 0
let checkTime = 0;
let indicatorTime = 0;
let waitingTime = 10
let newWaitingTime = 0
let timeOfCrazyRide = 1
let gameInterval;
let cars = []
let trafficLightsArray = [];
let loadEvacuator = false
let loadingEvacuator = false


class Auto {
  constructor(route, typeCar, speed, IsTurns, crash) {
    this.route = route;
    this.typeCar = typeCar;
    this.rotateCar = 0
    this.speed = speed || 3;
    this.position = 0;
    this.originalSpeed = this.speed;
    this.IsTurns = IsTurns
    this.prevPoint = { x: 0, y: 0 };
    this.crash = crash
  }

  createAuto() {
    const groupImages = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const auto = document.createElementNS("http://www.w3.org/2000/svg", "image");
    auto.setAttribute('href', this.typeCar);
    auto.setAttribute('width', '30');
    auto.setAttribute('x', '0');
    auto.setAttribute('y', '-6');
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
      this.crash = true;
      otherCar.crash = true;
      this.speed = 0;
      otherCar.speed = 0;
  
      trafficLightsArray.forEach((item) => {
        item.setRed();
      });
  
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
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

let trafficLightsState = {
  first: true,
  second: true,
  third: true,
  fourth: true
};

let greenColor = '#98FB98'
class TrafficLights {
  constructor(setClass, routesControl, stopAreaPosition) {
    this.setClass = setClass;
    this.colorTrafficLights = greenColor;
    this.trafficLightsOn = trafficLightsState[this.setClass];
    this.routesControl = routesControl;
    this.stopAreaPosition = stopAreaPosition;
    this.routeStopped = {};
  }

  createTrafficLights(coordinatesX, coordinatesY) {
    let trafficLightsSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    trafficLightsSVG.setAttribute('transform', `translate(${coordinatesX}, ${coordinatesY})`);

    let colorTrafficLights = document.createElementNS("http://www.w3.org/2000/svg", "path");
    colorTrafficLights.setAttribute("d", "M24.5 12.5C24.5 19.1274 19.1274 24.5 12.5 24.5C5.87258 24.5 0.5 19.1274 0.5 12.5C0.5 5.87258 5.87258 0.5 12.5 0.5C19.1274 0.5 24.5 5.87258 24.5 12.5Z");
    colorTrafficLights.setAttribute("fill", this.trafficLightsOn ? greenColor : "red");
    colorTrafficLights.setAttribute('class', `${this.setClass}`);
    colorTrafficLights.setAttribute("stroke", this.trafficLightsOn ? greenColor : 'red');
    this.colorTrafficLights = colorTrafficLights;

    let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", "20");
    icon.setAttribute("height", "20");
    icon.setAttribute("viewBox", "0 0 25 25");
    icon.setAttribute("fill", "none");
    icon.appendChild(colorTrafficLights);
    trafficLightsSVG.appendChild(icon);
    
    fieldSVG.appendChild(trafficLightsSVG);

    colorTrafficLights.addEventListener('click', () => {
      this.toggleTrafficLights();
      this.updateDivTrafficLights();
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
      elapsedTimeTraffic = elapsedTime
    });

    return colorTrafficLights;
  }

  toggleTrafficLights() {
    this.trafficLightsOn = !this.trafficLightsOn;
    trafficLightsState[this.setClass] = this.trafficLightsOn;
    this.colorTrafficLights.setAttribute('fill', this.trafficLightsOn ? greenColor : 'red');
    this.updateDivTrafficLights();
  }

  updateDivTrafficLights() {
    document.querySelectorAll(`.${this.setClass}`).forEach(light => {
      light.style.backgroundColor = this.trafficLightsOn ? greenColor : 'red';
    });
  }

  setRed() {
    this.trafficLightsOn = false;
    trafficLightsState[this.setClass] = this.trafficLightsOn;
    this.colorTrafficLights.setAttribute('fill', 'red');
    this.updateDivTrafficLights();
  }
}


const TL2 = new TrafficLights('second', ['#route1', '#route2', '#route3'], ['270', '310', '350']);
const TL3 = new TrafficLights('third', ['#route4', '#route5', '#route6'], ['270', '310', '350']);
const TL1 = new TrafficLights('first', ['#route7', '#route8', '#route9'], ['230', '270', '310']);
const TL4 = new TrafficLights('fourth', ['#route10', '#route11', '#route12'], ['250', '290', '340']);
TL2.createTrafficLights(353, 424);
TL3.createTrafficLights(499, 348);
TL1.createTrafficLights(388, 312);
TL4.createTrafficLights(464, 456);

trafficLightsArray.push(TL1, TL2, TL3, TL4);

function createDivTrafficLight(id, className, text) {
  let divTrafficLight = document.createElement('div');
  divTrafficLight.id = id;
  divTrafficLight.classList.add(className, 'duplicate');
  divTrafficLight.style.backgroundColor = trafficLightsState[className] ? greenColor : 'red';
  divTrafficLight.style.color = '#5c490e';
  divTrafficLight.style.userSelect = 'none';
  divTrafficLight.style.outline = 'none';
  divTrafficLight.innerHTML = text;
  divTrafficLight.addEventListener('click', () => {
    trafficLightsArray.forEach(tl => {
      if (tl.setClass === className) {
        tl.toggleTrafficLights();
        tl.updateDivTrafficLights();
      }
    });
  });

  if (divTrafficLight.classList.contains('first') || divTrafficLight.classList.contains('second')) {
    leftNav.appendChild(divTrafficLight);
  } else {
    rightNav.appendChild(divTrafficLight);
  }
}

createDivTrafficLight('first', 'first', 1);
createDivTrafficLight('second', 'second', 2);
createDivTrafficLight('third', 'third', 3);
createDivTrafficLight('fourth', 'fourth', 4);


// ======проверка столкновений=============

let rect1
let rect2
    function checkCollision(car1, car2) {
  rect1 = car1.autoElement.getBoundingClientRect();
  rect2 = car2.autoElement.getBoundingClientRect();
  return (
    rect1.left + 6 < rect2.right &&
    rect1.right > rect2.left + 6 &&
    rect1.top + 6 < rect2.bottom &&
    rect1.bottom > rect2.top + 6
  )
}


let whereTurns
// ============== ЛЕС ===================================
class Trees {
  constructor(fieldSVG) {
    this.fieldSVG = fieldSVG;
  }

  createTree(x, y, randomTree, randomMotion) {
    const trees = document.createElementNS("http://www.w3.org/2000/svg", "image");
    trees.setAttribute('href', `assets/tree${randomTree}.png`);
    trees.setAttribute('width', '100');
    trees.setAttribute('height', '100');
    trees.setAttribute('class', `motionTrees${randomMotion}`);
    const treesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    treesGroup.setAttribute('transform', `translate(${x}, ${y})`);
    treesGroup.appendChild(trees);
    this.fieldSVG.appendChild(treesGroup);
  }
  createForest(count, startCoordinatesX, finishCoordinatesX, startCoordinatesY, finishCoordinatesY, step) {
    for (let i = 0; i < count; i++) {
      let randomMotion = Math.floor(Math.random() * 3) + 1;
      let randomTree = Math.floor(Math.random() * 4) + 1;
      let randomTreeX = Math.floor(Math.random() * ((finishCoordinatesX - startCoordinatesX / step) + 1)) + startCoordinatesX
      let randomTreeY = Math.floor(Math.random() * ((finishCoordinatesY - startCoordinatesY / step) + 1)) + startCoordinatesY
      this.createTree(randomTreeX, randomTreeY, randomTree, randomMotion);
    }
  }
}

let createTree = new Trees(fieldSVG);
createTree.createForest(50, 5, 320, 5, 275, 5);
createTree.createForest(1, 750, 755, 5, 10, 1);
createTree.createForest(1, 750, 755, 55, 60, 1);
createTree.createForest(1, 750, 755, 105, 110, 1);
createTree.createForest(1, 750, 755, 155, 160, 1);
createTree.createForest(1, 750, 755, 205, 210, 1);
createTree.createForest(1, 750, 755, 255, 260, 1);
createTree.createForest(1, 550, 555, 255, 260, 1);
createTree.createForest(1, 550, 555, 100, 105, 1);
createTree.createForest(1, 550, 555, 600, 605, 1);
createTree.createForest(1, 550, 555, 475, 480, 1);
createTree.createForest(1, 625, 630, 475, 480, 1);
createTree.createForest(1, 680, 685, 525, 530, 1);
createTree.createForest(1, 450, 455, 535, 540, 1);
createTree.createForest(25, 0, 210, 400, 451, 5);



// ======================== DRAG EVACUATOR ===============================

// let evacuator = new Auto(`#routeEvacuator`, `assets/evacuator.png`, 3).createAuto();
// let evacuatorCarGroup = document.getElementById('#routeEvacuator');
// roadPath.createPath('routeEvacuator', 'M315 520 L 430 400', 'black');
let evacuatorCarImage = document.querySelector('.evacuator-block');
evacuatorCarImage.style.cursor = 'grab';

let startX, startY, initialX = 0, initialY = 0;
let relativeX;
let relativeY;

function handleStart(e) {
  e.preventDefault();
  let startTapX = e.touches ? e.touches[0].clientX : e.clientX;
  let startTapY = e.touches ? e.touches[0].clientY : e.clientY;
  startX = startTapX - initialX;
  startY = startTapY - initialY;

  document.addEventListener('mousemove', moveFn);
  document.addEventListener('mouseup', handleEndFn);
  document.addEventListener('touchmove', moveFn);
  document.addEventListener('touchend', handleEndFn);
}

let arrow = document.querySelector('.arrow');
let backTimer = document.querySelector('.backTimer');
let backTimerFill = document.querySelector('.backTimer span');

function moveFn(e) {
  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;
  relativeX = (clientX / window.innerWidth) * 100;
  relativeY = (clientY / window.innerHeight) * 100;
  evacuatorCarImage.style.cursor = 'grabbing';
  let startTapX = e.touches ? e.touches[0].clientX : e.clientX;
  let startTapY = e.touches ? e.touches[0].clientY : e.clientY;
  let newX = startTapX - startX;
  let newY = startTapY - startY;
  initialX = newX;
  initialY = newY;
  evacuatorCarImage.style.transform = `translate(${newX}px, ${newY}px)`;

  if (relativeX > 45 && relativeX < 55 && relativeY > 43 && relativeY < 53) {
    arrow.style.display = 'initial';
  } else {
    arrow.style.display = 'none';
  }
}

function handleEndFn(e) {
  if (relativeX > 45 && relativeX < 55 && relativeY > 43 && relativeY < 53) {
    if (arrow.style.display !== 'none') {
      arrow.style.display = 'none';
      evacuatorCarImage.style.cursor = 'grab';
      loadEvacuator = true;
    }
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('mouseup', handleEndFn);
    document.removeEventListener('touchmove', moveFn);
    document.removeEventListener('touchend', handleEndFn);
  } else {
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('touchmove', moveFn);
  }
  
}

function resetPosition() {
  initialX = 0;
  initialY = 0;
  evacuatorCarImage.style.transform = `translate(${initialX}px, ${initialY}px)`;
  backTimer.style.display = 'none'
  cars.forEach(car => {
    if (car.crash) {
      car.autoElement.remove();
    }
  });
  cars = cars.filter(car => car.crash !== true);
}


function evacuateCars() {
  loadingEvacuator = true
  backTimer.style.display = 'flex'
  backTimerFill.style.animation = 'fillTimer 2500ms forwards';
  backTimerFill.classList.add = 'fill-timer'
  setTimeout(resetPosition, 2500)
}


// ======= Облака =============

let arrFogs = []
class Fog {
  constructor(fieldSVG, href, fogSpeed, x) {
    this.fieldSVG = fieldSVG
    this.href = href
    this.fogSpeed = fogSpeed
    this.x = x

  }
  createFog(width, height, y, opacity) {
    let fog = document.createElementNS("http://www.w3.org/2000/svg", "image");
    fog.setAttribute('width', width);
    fog.setAttribute('height', height);
    fog.setAttribute('x', this.x);
    fog.setAttribute('y', y);
    fog.setAttribute('href', this.href);
    fog.setAttribute('opacity', opacity);
    fog.style.pointerEvents = 'none'
    fieldSVG.appendChild(fog)
    this.fog = fog
    return this
  }
   fogMove() {
    this.x += this.fogSpeed
    this.fog.setAttribute('x', this.x);
    if (this.x >= fieldSVG.getAttribute('width')) {
      this.fog.remove();
      arrFogs = arrFogs.filter(item => item !== this);
      console.log(arrFogs)
   }
}

}
let fogTimeLine = 0
let setOpacity = 0
let newTime = 0
function startGame() {
  if (!gameInterval) {
    fullScreen(document.documentElement);
    gameContainer.style.display = 'flex'
    startMenu.style.display = 'none'
    gameInterval = setInterval(gameTimer, 1000 / 60);
  }
}



function gameTimer() {
  elapsedTime += 1 / 60;
  const carsImg = 4;
  cars.forEach(car => {
    car.move()
  });



  if (elapsedTime - fogTimeLine >= 15 && arrFogs.length < 3) {
    let randomY = Math.floor(Math.random() * 300);
    let randomWidth = Math.floor(Math.random() * 700) + 100;
    let randomHeight = Math.floor(Math.random() * 700) + 100;
    let newFog = new Fog(fieldSVG, 'assets/fogTest.png', 0.7, randomWidth * -1).createFog(randomWidth, randomHeight, randomY , 0.9)
     fogTimeLine = elapsedTime
     arrFogs.push(newFog)
  }


arrFogs.forEach((item)=> item.fogMove())



evacuatorCarImage.addEventListener('mousedown', handleStart);
evacuatorCarImage.addEventListener('touchstart', handleStart);
  if (loadEvacuator) {
    evacuateBtn.addEventListener('click', evacuateCars);
  }


function showTime() {
  let gameTime = Math.floor(elapsedTime);
  let minutes = Math.floor(gameTime / 60);
  let seconds = gameTime % 60;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  timer.innerHTML = `${minutes}:${seconds}`
}
showTime() 


// function darkening() {
//   if (elapsedTime - newTime > 3) {
//     setOpacity += 0.1
//     night.style.opacity = `${setOpacity}`
//     newTime = elapsedTime
//   }
//   return setOpacity
// }

// darkening()

  if (elapsedTime - checkTime >= 1) {
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
    let newAuto = new Auto(`#route${randomRoute}`, `assets/car${randomImg}.png`, 3, whereTurns, false).createAuto()
    cars.push(newAuto);
    checkTime = elapsedTime;
    
  }
}


