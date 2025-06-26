import constants from "./constants/constants.js";
import Road from "./classes/Road.js";
import Sand from "./classes/Sand.js";
import House from "./classes/House.js";
import Trees from "./classes/Forest.js";
import Fog from "./classes/Fogs.js";
import { createMap, createFieldSVG, gameField } from "./map/createMap.js";
import { houses1, houses2, houses3 } from "./lib/definitions.js";
const { SVG_NS, stringName } = constants;

document.addEventListener("DOMContentLoaded", function () {
  const serverURL = "https://fe.it-academy.by/AjaxStringStorage2.php";
  const fieldSVG = createFieldSVG();
  let sandInstance = new Sand(fieldSVG);
  sandInstance.createSand(0, 0, 400, 400);
  sandInstance.createSand(400, 0, 400, 400);
  sandInstance.createSand(550, 400, 280, 300);
  sandInstance.createSand(150, 570, 250, 300);
  let houseSample = new House(fieldSVG);
  let createHouses1 = houseSample.fillMapHouses(houses1);
  let createHouses2 = houseSample.fillMapHouses(houses2);
  let createHouses3 = houseSample.fillMapHouses(houses3);
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
  let arrFogs = [];
  let fogTimeLine = 0;

  createMap(fieldSVG);
  let records = document.querySelector(".records");
  let recordsName = document.querySelectorAll(".name");
  let nameValue = document.querySelector(".end-name");
  let recordsRes = document.querySelectorAll(".res");
  const recordsBtn = document.querySelector(".records-btn");
  let saveRecordBtn = document.querySelector(".save-record");
  let recordList = [];

  let updatePassword;
  recordsBtn.addEventListener("click", showRecords);
  saveRecordBtn.addEventListener("click", saveRecord);

  function showRecords() {
    restoreInfo(() => {
      startMenu.style.display = "none";
      gameContainer.style.display = "none";
      warningOrientation.style.display = "none";
      rules.style.display = "none";
      records.style.display = "flex";
      endMenu.style.display = "none";
      history.pushState({ page: "records" }, "Records", "#records");
    });
  }

  function restoreInfo(callback) {
    $.ajax({
      url: serverURL,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "READ", n: stringName },
      success: (callresult) => {
        readReady(callresult, callback);
      },
      error: errorHandler,
    });
  }

  function readReady(callresult, callback) {
    if (callresult.error != undefined) {
    } else if (callresult.result != "") {
      recordList = JSON.parse(callresult.result);
      updateRecordTable();
      if (callback) callback();
    }
  }

  function saveRecord() {
    let newRecord = {
      name: nameValue.value,
      time: resultGame,
    };

    restoreInfo(() => {
      if (
        timeToSeconds(newRecord.time) >
        timeToSeconds(recordList[recordList.length - 1].time)
      ) {
        if (recordList.length >= 5) {
          recordList.pop();
        }
        recordList.push(newRecord);
        recordList.sort(
          (a, b) => timeToSeconds(b.time) - timeToSeconds(a.time)
        );
        storeInfo(() => {
          restoreInfo(() => {
            showRecords();
          });
        });
      } else {
        restoreInfo(() => {
          showRecords();
        });
      }
    });
    showMenu();
    resetGame();
  }

  function timeToSeconds(time) {
    if (time === "--:--") return -1;
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  function storeInfo(callback) {
    updatePassword = Math.random();
    $.ajax({
      url: serverURL,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "LOCKGET", n: stringName, p: updatePassword },
      success: (callresult) => {
        lockGetReady(callresult, callback);
      },
      error: errorHandler,
    });
  }

  function lockGetReady(callresult, callback) {
    if (callresult.error != undefined) {
    } else {
      $.ajax({
        url: serverURL,
        type: "POST",
        cache: false,
        dataType: "json",
        data: {
          f: "UPDATE",
          n: stringName,
          v: JSON.stringify(recordList),
          p: updatePassword,
        },
        success: (callresult) => {
          updateReady(callresult);
          if (callback) callback();
        },
        error: errorHandler,
      });
    }
  }

  function updateReady(callresult) {
    if (callresult.error != undefined) {
    }
  }

  function errorHandler(jqXHR, statusStr, errorStr) {
    // alert(statusStr + ' ' + errorStr);
  }

  function updateRecordTable() {
    recordsRes.forEach((item, index) => {
      item.innerHTML = recordList[index] ? recordList[index].time : "--:--";
    });
    recordsName.forEach((item, index) => {
      item.innerHTML = recordList[index] ? recordList[index].name : "--";
    });
  }
  restoreInfo(() => {
    updateRecordTable();
  });

  // function clearRecordTable() {
  //   recordList = [
  //   { "name": "--", "time": "--:--" },
  // { "name": "--", "time": "--:--" },
  // { "name": "--", "time": "--:--" },
  // { "name": "--", "time": "--:--" },
  // { "name": "--", "time": "--:--" } ];
  // storeInfo(updateRecordTable);
  // }
  // clearRecordTable();

  gameField.style.position = "relative";
  let pathsLengths = {};
  let timer = document.querySelector(".menu-timer");
  let warningOrientation = document.querySelector(".orientation-warning");
  let lives = document.querySelectorAll(".lives img");
  let isVibrating = false;
  let start;
  let pause;
  let isPaused = false;
  let back;
  let backToMenu;
  let resultGame;
  let gameContainer = document.querySelector(".container");
  let startMenu = document.querySelector(".start-menu");
  let endMenu = document.querySelector(".end-game");
  let endScore = document.querySelector(".end-score");
  let rules = document.querySelector(".rules");
  const evacuateBtn = document.querySelector(".evacuate-btn");
  const leftNav = document.querySelector(".left-navigation");
  const rightNav = document.querySelector(".right-navigation");

  let previousOrientation =
    window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  window.addEventListener("resize", function () {
    let currentOrientation =
      window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    if (currentOrientation !== previousOrientation) {
      previousOrientation = currentOrientation;
    }
  });

  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    if (location.hash === "#menu") {
      return;
    } else if (location.hash === "#game") {
      event.returnValue =
        "У вас есть несохраненные изменения. Вы действительно хотите уйти?";
    } else if (location.hash === "#endGame") {
      return;
    }
  });

  // ============ ЗВУКИ ===============
  let isAudioPlayed;
  let birdsSound;
  let backgroundMusic;
  const backgroundTraffic = new Audio("assets/traffic.mp3");
  const tapSound = new Audio("assets/tap.wav");
  const crushSound = new Audio(`assets/crushSound.mp3`);
  const beepSound = new Audio("assets/beepSound.mp3");
  const evacuatorSound = new Audio(`assets/evacuatorSound.mp3`);

  function gameSoundFn() {
    let randomSound = Math.floor(Math.random() * 4) + 1;
    backgroundMusic = new Audio(`assets/mainTrack${randomSound}.mp3`);
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    backgroundMusic.loop = true;
  }

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

  let allBtns = document.querySelectorAll(".menu-btn");
  allBtns.forEach((btns) =>
    btns.addEventListener("click", function tapSoundFn() {
      tapSound.currentTime = 0;
      tapSound.play();
    })
  );

  function birdsSoundFn() {
    let randomSound = Math.floor(Math.random() * 2) + 1;
    birdsSound = new Audio(`assets/birds${randomSound}.mp3`);
    birdsSound.currentTime = 0;
    birdsSound.play();
    birdsSound.volume = 0.4;
  }

  function evacuatorSoundFn() {
    evacuatorSound.currentTime = 0;
    evacuatorSound.play();
  }

  // ============= Навигация в приложении ===========================

  function showMenu() {
    startMenu.style.display = "flex";
    gameContainer.style.display = "none";
    warningOrientation.style.display = "none";
    rules.style.display = "none";
    records.style.display = "none";
    endMenu.style.display = "none";
    history.pushState({ page: "menu" }, "Menu", "#menu");
  }
  showMenu();

  function showRules() {
    startMenu.style.display = "none";
    gameContainer.style.display = "none";
    warningOrientation.style.display = "none";
    rules.style.display = "flex";
    records.style.display = "none";
    history.pushState({ page: "rules" }, "Rules", "#rules");
  }

  function endGame() {
    backgroundTraffic.loop = false;
    startMenu.style.display = "none";
    warningOrientation.style.display = "none";
    rules.style.display = "none";
    gameContainer.style.display = "none";
    records.style.display = "none";
    endMenu.style.display = "flex";
    endScore.innerHTML = `ваше время: ${resultGame}`;
    history.pushState({ page: "endGame" }, "endGame", "#endGame");
  }

  function showWarning() {
    startMenu.style.display = "none";
    gameContainer.style.display = "none";
    warningOrientation.style.display = "block";
    records.style.display = "none";
    history.pushState({ page: "warning" }, "Warning", "#warning");
  }

  function stopGame() {
    window.location.reload();
  }

  function togglePause() {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }

  function pauseGame() {
    isPaused = true;
    pause.style.backgroundColor = "#da7509";
    pause.innerHTML = "играть";
    backgroundTraffic.pause();
    backgroundMusic.pause();
    fieldSVG.style.pointerEvents = "none";
    clearInterval(gameInterval);
  }

  function resumeGame() {
    isPaused = false;
    backgroundTraffic.play();
    backgroundMusic.play();
    pause.innerHTML = "пауза";
    pause.style.backgroundColor = "#daf2b5";
    gameInterval = setInterval(gameTimer, 1000 / 60);
  }
  function resetGame() {
    isPaused = false;
    pause.innerHTML = "пауза";
    backgroundTraffic.pause();
    backgroundMusic.pause();
    clearInterval(gameInterval);
    const carElements = document.querySelectorAll(".allCars");
    carElements.forEach((carElement) => {
      carElement.remove();
    });

    cars = [];
    elapsedTime = 0;
    checkTime = 0;
    timer.innerHTML = "00:00";
    gameInterval = false;
    countEvacuate = 0;
    lives.forEach((item) => {
      item.setAttribute("src", "assets/lifeRemain.png");
    });
    nameValue.value = "";
  }

  back = document.querySelectorAll(".back");
  backToMenu = document.querySelector(".back-to-menu");
  pause = document.querySelector(".pause");
  start = document.querySelector(".start-btn");
  const rulesBtn = document.querySelector(".rules-btn");

  start.addEventListener("click", startGame);
  pause.addEventListener("click", togglePause);

  rulesBtn.addEventListener("click", showRules);
  back.forEach((btn) => {
    btn.addEventListener("click", showMenu);
  });

  backToMenu.addEventListener("click", function () {
    let warningExit = confirm("вы хотите покинуть игру?");
    if (warningExit) {
      showMenu();
      stopGame();
    } else {
      return;
    }
  });

  window.addEventListener("popstate", function (event) {
    if (location.hash === "#game") {
      let warningExit = confirm("вы хотите покинуть игру?");
      if (warningExit) {
        showMenu();
        stopGame();
      }
    } else {
      switch (event.state.page) {
        case "menu":
          window.location.reload();
          break;
        case "game":
          startGame();
          break;
        case "warning":
          showWarning();
          break;
        case "rules":
          showRules();
          break;
        case "records":
          showRecords();
          break;
        case "endGame":
          endGame();
          break;
      }
    }
  });

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

  const roadPath = new Road(fieldSVG);

  roadPath.createPath("route1", "M0 410 L 870 410", "black");
  roadPath.createPath(
    "route2",
    "M0 410 L 380 410 C 400 400, 420 440, 424 480 L 424 740",
    "green"
  );
  roadPath.createPath(
    "route3",
    "M0 410 L 380 410 C 380 409, 450 430, 448 280 L 448 0",
    "red"
  );

  roadPath.createPath("route5", "M900 385 L 0 385", "grey");
  roadPath.createPath(
    "route6",
    "M900 385 L 480 385 C 425 310, 462 340, 444 0 L 444 0",
    "green"
  );
  roadPath.createPath(
    "route4",
    "M900 385 L 480 385 C 440 390, 420 440, 424 480 L 424 840",
    "red"
  );

  roadPath.createPath("route7", "M425 0 L 425 810", "pink");
  roadPath.createPath(
    "route8",
    "M425 0 L 425 300 C 425 300, 425 400, 350 385 L 0 385",
    "green"
  );
  roadPath.createPath(
    "route9",
    "M425 0 L 425 300 C 425 380, 415 390, 450 405 L 870 410",
    "red"
  );

  roadPath.createPath("route10", "M445 810 L 445 0", "black");
  roadPath.createPath(
    "route12",
    "M445 810 L 445 498 C 445 490, 450 428, 490 410 L 870 410",
    "green"
  );
  roadPath.createPath(
    "route11",
    "M445 810 L 445 470 C 450 400, 420 390, 390 385 L 0 385",
    "red"
  );

  // ================Машинки=================================

  let elapsedTime = 0;
  let checkTime = 0;
  let checkSoundTime = 0;
  let gameInterval;
  let cars = [];
  let trafficLightsArray = [];
  let loadEvacuator = false;

  class Auto {
    constructor(route, typeCar, speed, IsTurns, crash, addClass) {
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
      if (whereTurns === "right") {
        posY = 4;
        createIndicators();
      } else if (whereTurns === "left") {
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

      fieldSVG.appendChild(groupImages);
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

  function vibrating(vibro) {
    if ("vibrate" in navigator) {
      if (vibro) {
        navigator.vibrate(400);
      }
    }
  }

  // ======проверка столкновений=============

  let relativeLeft1;
  let relativeRight1;
  let relativeTop1;
  let relativeBottom1;

  let relativeLeft2;
  let relativeRight2;
  let relativeTop2;
  let relativeBottom2;

  function checkCollision(car1, car2) {
    let rect1 = car1.autoElement.getBoundingClientRect();
    let rect2 = car2.autoElement.getBoundingClientRect();

    relativeLeft1 = (rect1.left / window.innerWidth) * 100;
    relativeRight1 = (rect1.right / window.innerWidth) * 100;
    relativeTop1 = (rect1.top / window.innerHeight) * 100;
    relativeBottom1 = (rect1.bottom / window.innerHeight) * 100;

    relativeLeft2 = (rect2.left / window.innerWidth) * 100;
    relativeRight2 = (rect2.right / window.innerWidth) * 100;
    relativeTop2 = (rect2.top / window.innerHeight) * 100;
    relativeBottom2 = (rect2.bottom / window.innerHeight) * 100;

    const margin = 0.8;

    return (
      ((relativeLeft1 > 35 && relativeLeft1 < 65) ||
        (relativeLeft2 > 35 && relativeLeft2 < 65)) &&
      ((relativeTop1 > 35 && relativeTop1 < 65) ||
        (relativeTop2 > 35 && relativeTop2 < 65)) &&
      relativeLeft1 + margin < relativeRight2 &&
      relativeRight1 - margin > relativeLeft2 &&
      relativeTop1 + margin < relativeBottom2 &&
      relativeBottom1 - margin > relativeTop2
    );
  }

  // ===================Светофор==================================

  let trafficLightsState = {
    first: true,
    second: true,
    third: true,
    fourth: true,
  };

  let greenColor = "#98FB98";
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

      fieldSVG.appendChild(trafficLightsSVG);

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

  const TL2 = new TrafficLights(
    "second",
    ["#route1", "#route2", "#route3"],
    ["270", "310", "350"]
  );
  const TL3 = new TrafficLights(
    "third",
    ["#route4", "#route5", "#route6"],
    ["300", "340", "380"]
  );
  const TL1 = new TrafficLights(
    "first",
    ["#route7", "#route8", "#route9"],
    ["230", "270", "310"]
  );
  const TL4 = new TrafficLights(
    "fourth",
    ["#route10", "#route11", "#route12"],
    ["250", "290", "340"]
  );
  TL2.createTrafficLights(353, 424);
  TL3.createTrafficLights(499, 348);
  TL1.createTrafficLights(388, 312);
  TL4.createTrafficLights(464, 456);

  trafficLightsArray.push(TL1, TL2, TL3, TL4);

  function createDivTrafficLight(id, className, text) {
    let divTrafficLight = document.createElement("div");
    divTrafficLight.id = id;
    divTrafficLight.classList.add(className, "duplicate");
    divTrafficLight.style.backgroundColor = trafficLightsState[className]
      ? greenColor
      : "red";
    divTrafficLight.style.color = "#5c490e";
    divTrafficLight.style.userSelect = "none";
    divTrafficLight.style.outline = "none";
    divTrafficLight.innerHTML = text;

    divTrafficLight.addEventListener("click", () => {
      trafficLightsArray.forEach((tl) => {
        if (tl.setClass === className) {
          tl.toggleTrafficLights();
          tl.updateDivTrafficLights();
        }
      });
    });

    if (
      divTrafficLight.classList.contains("first") ||
      divTrafficLight.classList.contains("second")
    ) {
      leftNav.appendChild(divTrafficLight);
    } else {
      rightNav.appendChild(divTrafficLight);
    }
  }

  createDivTrafficLight("first", "first", 1);
  createDivTrafficLight("second", "second", 2);
  createDivTrafficLight("third", "third", 3);
  createDivTrafficLight("fourth", "fourth", 4);

  let allStop = true;
  document.addEventListener("keydown", function (event) {
    let key = event.key;
    if (key === " " && allStop) {
      trafficLightsArray.forEach((item) => {
        item.setRed();
        allStop = false;
      });
    } else if (key === " " && !allStop) {
      trafficLightsArray.forEach((item) => {
        item.setGreen();
        allStop = true;
      });
    }

    trafficLightsArray.forEach((item, index) => {
      if (index + 1 === parseInt(key)) {
        item.toggleTrafficLights();
        item.updateDivTrafficLights();
      }
    });
  });

  let whereTurns;
  let canMove = false;
  // ======================== DRAG EVACUATOR ===============================

  let evacuatorCarImage = document.querySelector(".evacuator-block");

  let startX,
    startY,
    initialX = 0,
    initialY = 0;
  let relativeX;
  let relativeY;
  function handleStart(e) {
    e.preventDefault();
    if (!canMove) {
      evacuatorCarImage.style.cursor = "pointer";
      return;
    }
    evacuatorCarImage.style.cursor = "grab";
    let startTapX = e.touches ? e.touches[0].clientX : e.clientX;
    let startTapY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = startTapX - initialX;
    startY = startTapY - initialY;

    document.addEventListener("mousemove", moveFn);
    document.addEventListener("mouseup", handleEndFn);
    document.addEventListener("touchmove", moveFn);
    document.addEventListener("touchend", handleEndFn);
  }

  let arrow = document.querySelector(".arrow");
  let backTimer = document.querySelector(".backTimer");
  let backTimerFill = document.querySelector(".backTimer span");

  function moveFn(e) {
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    relativeX = (clientX / window.innerWidth) * 100;
    relativeY = (clientY / window.innerHeight) * 100;
    evacuatorCarImage.style.cursor = "grabbing";
    let startTapX = e.touches ? e.touches[0].clientX : e.clientX;
    let startTapY = e.touches ? e.touches[0].clientY : e.clientY;
    let newX = startTapX - startX;
    let newY = startTapY - startY;
    initialX = newX;
    initialY = newY;
    evacuatorCarImage.style.transform = `translate(${newX}px, ${newY}px)`;

    if (relativeX > 45 && relativeX < 55 && relativeY > 43 && relativeY < 53) {
      arrow.style.display = "initial";
    } else {
      arrow.style.display = "none";
    }
  }

  function handleEndFn(e) {
    if (relativeX > 45 && relativeX < 55 && relativeY > 43 && relativeY < 53) {
      if (arrow.style.display !== "none") {
        arrow.style.display = "none";
        evacuatorCarImage.style.cursor = "grab";
        loadEvacuator = true;
      }
      document.removeEventListener("mousemove", moveFn);
      document.removeEventListener("mouseup", handleEndFn);
      document.removeEventListener("touchmove", moveFn);
      document.removeEventListener("touchend", handleEndFn);
    } else {
      document.addEventListener("mousemove", moveFn);
      document.addEventListener("touchmove", moveFn);
    }
  }

  function resetPosition() {
    initialX = 0;
    initialY = 0;
    canMove = false;
    loadEvacuator = false;
    evacuatorCarImage.style.transform = `translate(${initialX}px, ${initialY}px)`;
    backTimer.style.display = "none";
    isAudioPlayed = false;
    cars.forEach((car) => {
      if (car.crash) {
        car.autoElement.remove();
      }
    });
    cars = cars.filter((car) => car.crash !== true);
  }

  let countEvacuate = 0;

  function evacuateCars() {
    countEvacuate += 1;
    isVibrating = false;
    backgroundTraffic.volume = 0.3;
    backgroundTraffic.play();
    evacuatorSoundFn();
    backTimer.style.display = "flex";
    backTimerFill.style.animation = "fillTimer 2500ms forwards";
    backTimerFill.classList.add = "fill-timer";
    let parameters;
    for (let i = 0; i < countEvacuate; i++) {
      parameters = lives[lives.length - countEvacuate];
      lostLife = parameters.setAttribute("src", "assets/lifeLost.png");
    }
    if (countEvacuate === 3) {
      pauseGame();
      endGame();
      backgroundTraffic.loop = false;
    }
    setTimeout(resetPosition, 2500);
  }

  function startGame() {
    history.pushState({ page: "game" }, "Game", "#game");
    if (innerWidth < 500 && window.innerHeight > window.innerWidth) {
      warningOrientation.style.display = "flex";
      gameContainer.style.display = "none";
      startMenu.style.display = "none";
      window.addEventListener("resize", startGame);
    } else if (window.innerHeight < window.innerWidth) {
      fullScreen(document.documentElement);
      launchGame();
    }
  }

  function launchGame() {
    if (!gameInterval) {
      warningOrientation.style.display = "none";
      gameContainer.style.display = "flex";
      startMenu.style.display = "none";
      gameSoundFn();
      backgroundTraffic.play();
      backgroundTraffic.loop = true;
      backgroundTraffic.volume = 0.4;
      gameInterval = setInterval(gameTimer, 1000 / 60);
      checkTime = 0;
    }
  }

  function gameTimer() {
    if (innerWidth < 500 && window.innerHeight > window.innerWidth) {
      warningOrientation.style.display = "flex";
      gameContainer.style.display = "none";
      startMenu.style.display = "none";
      pauseGame();
      window.addEventListener("resize", resumeGame);
    } else {
      warningOrientation.style.display = "none";
      gameContainer.style.display = "flex";
      startMenu.style.display = "none";
    }
    elapsedTime += 1 / 60;
    const carsImg = 4;
    cars.forEach((car) => {
      car.move();
    });

    if (loadEvacuator) {
      evacuateBtn.disabled = false;
      evacuateBtn.addEventListener("click", evacuateCars);
    } else {
      evacuateBtn.disabled = true;
    }

    arrFogs = arrFogs.filter((fog) => {
      if (fog.isOffscreen()) {
        fog.remove();
        return false;
      }
      return true;
    });

    if (elapsedTime - fogTimeLine >= 15 && arrFogs.length < 3) {
      let randomY = Math.floor(Math.random() * 300);
      let randomWidth = Math.floor(Math.random() * 700) + 100;
      let randomHeight = Math.floor(Math.random() * 700) + 100;
      let newFog = new Fog(
        fieldSVG,
        "assets/fogTest.png",
        0.8,
        randomWidth * -1
      ).createFog(randomWidth, randomHeight, randomY, 0.9);
      fogTimeLine = elapsedTime;
      arrFogs.push(newFog);
    }

    arrFogs.forEach((item) => item.fogMove());

    evacuatorCarImage.addEventListener("mousedown", handleStart);
    evacuatorCarImage.addEventListener("touchstart", handleStart);

    resultGame = showTime(elapsedTime);
    function showTime(elapsedTime) {
      let gameTime = Math.floor(elapsedTime);
      let minutes = Math.floor(gameTime / 60);
      let seconds = gameTime % 60;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;

      timer.innerHTML = `${minutes}:${seconds}`;
      return `${minutes}:${seconds}`;
    }
    showTime(elapsedTime);

    if (elapsedTime - checkSoundTime > 20) {
      birdsSoundFn();
      checkSoundTime = elapsedTime;
    }

    if (elapsedTime - checkTime >= 1) {
      let randomImg = Math.floor(Math.random() * carsImg) + 1;
      let randomRoute = Math.floor(Math.random() * 12) + 1;
      const toStreight = "streight";
      const toLeft = "left";
      const toRight = "right";
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
      };
      whereTurns = turnDirection[randomRoute];
      if (cars.length > 60) {
        return;
      } else {
        let newAuto = new Auto(
          `#route${randomRoute}`,
          `assets/car${randomImg}.png`,
          2.5,
          whereTurns,
          false,
          "allCars"
        ).createAuto();
        cars.push(newAuto);
      }

      checkTime = elapsedTime;
    }
  }
});
