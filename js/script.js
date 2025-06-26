import constants from "./constants/constants.js";
import Road from "./classes/Road.js";
import Sand from "./classes/Sand.js";
import House from "./classes/House.js";
import Trees from "./classes/Forest.js";
import Fog from "./classes/Fogs.js";
import Auto from "./classes/Auto.js";
import gameStore from "./store/gameStore.js";
import TrafficLights from "./classes/TrafficLights.js";
import { createMap, createFieldSVG, gameField } from "./map/createMap.js";
import {
  houses1,
  houses2,
  houses3,
  backgroundTraffic,
  tapSound,
  evacuatorSound,
  soundType,
  gameSoundFn,
} from "./lib/definitions.js";
import getRandomNum from "./utils/getRandomNum.js";
const { stringName, greenColor, numberBirdTracks, numberMainTracks } =
  constants;
let {
  trafficLightsState,
  arrFogs,
  fogTimeLine,
  trafficLightsArray,
  cars,
  pathsLengths,
  elapsedTime,
  checkTime,
  isVibrating,
  canMove,
  backgroundMusic,
  isAudioPlayed,
} = gameStore;

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

  const roadPath = new Road(fieldSVG, 0, 0, 0, pathsLengths);

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

  const TL2 = new TrafficLights(
    "second",
    ["#route1", "#route2", "#route3"],
    ["270", "310", "350"],
    fieldSVG
  );
  const TL3 = new TrafficLights(
    "third",
    ["#route4", "#route5", "#route6"],
    ["300", "340", "380"],
    fieldSVG
  );
  const TL1 = new TrafficLights(
    "first",
    ["#route7", "#route8", "#route9"],
    ["230", "270", "310"],
    fieldSVG
  );
  const TL4 = new TrafficLights(
    "fourth",
    ["#route10", "#route11", "#route12"],
    ["250", "290", "340"],
    fieldSVG
  );
  TL2.createTrafficLights(353, 424);
  TL3.createTrafficLights(499, 348);
  TL1.createTrafficLights(388, 312);
  TL4.createTrafficLights(464, 456);

  trafficLightsArray.push(TL1, TL2, TL3, TL4);

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
  let timer = document.querySelector(".menu-timer");
  let warningOrientation = document.querySelector(".orientation-warning");
  let lives = document.querySelectorAll(".lives img");
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
  let birdsSound;

  let allBtns = document.querySelectorAll(".menu-btn");
  allBtns.forEach((btns) =>
    btns.addEventListener("click", function tapSoundFn() {
      tapSound.currentTime = 0;
      tapSound.play();
    })
  );

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

  // ================Машинки=================================

  let checkSoundTime = 0;
  let gameInterval;
  let loadEvacuator = false;

  // ======проверка столкновений=============

  // ===================Светофор==================================

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
      gameSoundFn(soundType.mainTrack, getRandomNum(numberMainTracks));
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
      gameSoundFn(soundType.birds, getRandomNum(numberBirdTracks));
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
