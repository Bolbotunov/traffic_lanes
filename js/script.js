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
roadPath.createPath('route3', 'M0 410 L 870 410', 'black');
roadPath.createPath('route2', 'M870 385 L 0 385', 'grey');
roadPath.createPath('route1', 'M0 410 L 340 410 C 440 410, 420 440, 424 480 L 424 740', 'blue');
roadPath.createPath('route5', 'M425 0 L 425 810', 'red');
roadPath.createPath('route4', 'M445 810 L 445 0', 'black');
roadPath.createPath('route6', 'M450 760 L 455 470 C 450 420, 460 390, 360 390 L 0 385', 'green');
let elapsedTime = 0;
let elapsedTimeTraffic = 0
let checkTimeTraffic = 0
let checkTime = 0;
let waitingTime = 5
let newWaitingTime = 0
let timeOfCrazyRide = 2
let gameInterval;
let cars = []; // Массив для хранения всех созданных машинок
let trafficLightsOn = true; // Состояние светофора

class Auto {
  constructor(route, coordY, duration, typeCar, speed, R, carsArr) {
    this.carsArr = []
    this.R = R
    this.coordY = coordY
    this.route = route;
    this.duration = duration;
    this.typeCar = typeCar;
    this.animateMotion = null;
    this.rotateCar = 0
    this.speed = speed || 3;
    this.position = 0; // Изначальная позиция машинки
    this.originalSpeed = this.speed;
    this.prevPoint = { x: 0, y: 0 };
  }

 createAuto() {
    const auto = document.createElementNS("http://www.w3.org/2000/svg", "image");
    auto.setAttribute('href', this.typeCar);
    auto.setAttribute('width', '35');
    auto.setAttribute('x', '-25');
    auto.setAttribute('y', this.coordY);
    auto.setAttribute('height', '35');
    auto.setAttribute('transform', 'translate(0, -18)');
    auto.setAttribute('id', this.route);
    this.autoElement = auto;
    fieldSVG.appendChild(auto);
    return this;
  }

  move() {
    const pathInfo = pathsLengths[this.route];
    let index = cars.indexOf(this);
    let safeDistance = 45;
    // поворот на 376
    // if(this.position > 390 ) {
    //   this.rotateCar = 90
    // }

    if (!trafficLightsOn && elapsedTime - elapsedTimeTraffic >= waitingTime &&  newWaitingTime < timeOfCrazyRide) {
      newWaitingTime = elapsedTime - elapsedTimeTraffic - waitingTime
      this.speed = this.originalSpeed
    }
    
    if (!trafficLightsOn && newWaitingTime >= timeOfCrazyRide) {
      elapsedTimeTraffic = elapsedTime
      newWaitingTime = 0
      this.speed = 0
    }

    if (!trafficLightsOn && this.position >= 280 && this.position < 310 && elapsedTime - elapsedTimeTraffic < waitingTime) {
      this.speed = 0;
    } else {
      if (index > 0) {
        let previousCar = cars[index - 1];
        if (previousCar.position - this.position < safeDistance * 2 && previousCar.position - this.position > safeDistance) {
          this.speed = 0.9;
        } else if (previousCar.position - this.position <= safeDistance) {
          this.speed = 0;
        } else {
          this.speed = this.originalSpeed;
        }
      } else {
          this.speed = this.originalSpeed;
        }
      }

    if (this.position < pathInfo.length) {
      this.position += this.speed * 0.5;
      const point = pathInfo.element.getPointAtLength(this.position);
      // this.autoElement.setAttribute('transform', `translate(${point.x}, ${point.y - 18}), rotate(${this.rotateCar})`)
      const nextPoint = pathInfo.element.getPointAtLength(this.position + this.speed * 0.5);
      const dx = nextPoint.x - point.x;
       const dy = nextPoint.y - point.y;
        this.rotateCar = Math.atan2(dy, dx) * (180 / Math.PI)
      // this.prevPoint = point
      this.autoElement.setAttribute('transform', `translate(${point.x + 18}, ${point.y - 18}), rotate(${this.rotateCar})`)
    }
    if (this.position >= pathInfo.length) {
      this.autoElement.remove();
      cars = cars.filter(car => car !== this)
    }
  }
}
// ===================Светофор==================================


class TrafficLights {
  constructor(id) {
    this.id = id
    this.colorTrafficLights = '#24AB12'
  }
  createTrafficLights(coordinatesX, coordinatesY) {
    let trafficLightsSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    trafficLightsSVG.setAttribute('transform', `translate(${coordinatesX}, ${coordinatesY})`);
    trafficLightsSVG.setAttribute('id', `${this.id}`);

    let colorTrafficLights = document.createElementNS("http://www.w3.org/2000/svg", "path");
    colorTrafficLights.setAttribute("d", "M24.5 12.5C24.5 19.1274 19.1274 24.5 12.5 24.5C5.87258 24.5 0.5 19.1274 0.5 12.5C0.5 5.87258 5.87258 0.5 12.5 0.5C19.1274 0.5 24.5 5.87258 24.5 12.5Z");
    colorTrafficLights.setAttribute("fill", "#24AB12");
    colorTrafficLights.setAttribute("stroke", this.colorTrafficLights);

    let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", "20");
    icon.setAttribute("height", "20");
    icon.setAttribute("viewBox", "0 0 25 25");
    icon.setAttribute("fill", "none");
    icon.appendChild(colorTrafficLights);
    trafficLightsSVG.appendChild(icon);
    fieldSVG.appendChild(trafficLightsSVG);
    return colorTrafficLights
  }
}

let TL1 = new TrafficLights('first').createTrafficLights('370', '398')
let TL2 = new TrafficLights('second').createTrafficLights('485', '372')

let trafficLightsArray = [TL1, TL2]
console.log(trafficLightsArray)

trafficLightsArray.forEach((item) => {
  item.addEventListener('click', function(e) {
    if (trafficLightsOn) {
      trafficLightsOn = false;
      item.setAttribute('fill', 'red')
      elapsedTimeTraffic = elapsedTime
      cars.forEach(item => {
        if (item.position >= 280 && item.position < 310) {
          console.log(item.position)
          item.speed = 0;
        }
      });
    } else {
      item.setAttribute('fill', '#24AB12')
      trafficLightsOn = true;
      cars.forEach(item => {
        item.speed = item.originalSpeed;
      });
    }
  })
})


// TL1.addEventListener('click' , function() {
//   if (trafficLightsOn) {
//     trafficLightsOn = false;
//     TL1.setAttribute('fill', 'red')
//     elapsedTimeTraffic = elapsedTime
//     cars.forEach(item => {
//       if (item.position >= 280 && item.position < 310) {
//         console.log(item.position)
//         item.speed = 0;
//       }
//     });
//   } else {
//     TL1.setAttribute('fill', '#24AB12')
//     trafficLightsOn = true;
//     cars.forEach(item => {
//       item.speed = item.originalSpeed;
//     });
//   }
// })


// trafficLights.addEventListener('click', function() {
//   if (trafficLightsOn) {
//     trafficLightsOn = false;

//     trafficLights.style.backgroundColor = 'red';
//     elapsedTimeTraffic = elapsedTime
//     cars.forEach(item => {
//       if (item.position >= 430 && item.position < 450) {
//         item.speed = 0;
//       }
//     });
//   } else {
//     trafficLights.style.backgroundColor = 'green';
//     trafficLightsOn = true;
//     console.log('greenOn');
//     cars.forEach(item => {
//       item.speed = item.originalSpeed; // Возвращаем оригинальную скорость машинкам
//     });
//   }
// });

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
    let randomRoute = Math.floor(Math.random() * 6) + 1;
    let coordY
    if(randomRoute % 2 === 0) {
      coordY = '-35'
    } else {
    coordY = '0'
    }
    let newAuto = new Auto(`#route${randomRoute}`, `${coordY}`, '1s', `assets/car${randomImg}.png`, 3, 0).createAuto();
    // let newAuto2 = new Auto('#route2', '5s', `assets/car${randomImg}.png`, 3, 180).createAuto();
    cars.push(newAuto); // Добавляем новую машинку в массив
    // cars.push(newAuto2); // Добавляем новую машинку в массив
    checkTime = elapsedTime;
  }
}








// let TL1 = new TrafficLights('first').createTrafficLights('340', '400', [90, 357.5, 407.5], [10,0], 'clip1')
// let TL2 = new TrafficLights('second').createTrafficLights('510', '375', [90, 0, 0], [10,0], 'clip2')


    // const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    // clipPath.setAttribute('id', `${clipId}`);

    // const viewArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    // viewArea.setAttribute('width', '18');
    // viewArea.setAttribute('height', '16');
    // viewArea.setAttribute('x', `${viewAreaX}`);
    // viewArea.setAttribute('y', `${viewAreaY}`);
    // viewArea.setAttribute('fill', 'none');
    // clipPath.appendChild(viewArea);

    // const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    // defs.appendChild(clipPath);
    // fieldSVG.appendChild(defs);

    
    // trafficLightsGroup.setAttribute('clip-path', `url(#${clipId})`);

    // const trafficLightsImg = document.createElementNS("http://www.w3.org/2000/svg", "image");
    // trafficLightsImg.setAttribute('href', '../assets/trafficLights.png');
    // trafficLightsImg.setAttribute('id', `${this.id}`);
    // trafficLightsImg.setAttribute('width', '32');
    // trafficLightsImg.setAttribute('height', '32');
    // trafficLightsImg.setAttribute('x', `${viewAreaX}`);
    // trafficLightsImg.setAttribute('y', `${viewAreaY}`);
    // trafficLightsImg.setAttribute('transform', `rotate(${rotateImg}) translate(${translateImg})`);
    // trafficLightsGroup.appendChild(trafficLightsImg);

    // fieldSVG.appendChild(trafficLightsGroup);
    // return trafficLightsImg