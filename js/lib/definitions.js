import audioController from "../utils/audioController.js";

export const houses1 = [
  { x: 500, y: 30, typeHouse: "1" },
  { x: 500, y: 130, typeHouse: "3" },
  { x: 500, y: 230, typeHouse: "2" },
  { x: 650, y: 30, typeHouse: "2" },
  { x: 650, y: 130, typeHouse: "1" },
  { x: 650, y: 230, typeHouse: "3" },
];

export const houses2 = [
  { x: 500, y: 430, typeHouse: "2" },
  { x: 570, y: 530, typeHouse: "3" },
  { x: 500, y: 630, typeHouse: "1" },
  { x: 700, y: 480, typeHouse: "3" },
  { x: 700, y: 630, typeHouse: "2" },
];

export const houses3 = [
  { x: 280, y: 550, typeHouse: "2" },
  { x: 280, y: 660, typeHouse: "1" },
  { x: 280, y: 440, typeHouse: "3" },
];

export const soundType = {
  mainTrack: "mainTrack",
  birds: "birds",
};

export function gameSoundFn(type, num) {
  const path = `../assets/${soundType[type]}${num}.mp3`;
  audioController.updateMusic(path, type);
}
