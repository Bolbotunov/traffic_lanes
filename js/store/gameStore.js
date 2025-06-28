const gameStore = {
  trafficLights: [],
  arrFogs: [],
  fogTimeLine: 0,
  trafficLightsState: {
    first: true,
    second: true,
    third: true,
    fourth: true,
  },
  trafficLightsArray: [],
  cars: [],
  pathsLengths: {},
  elapsedTime: 0,
  checkTime: 0,
  isVibrating: false,
  canMove: false,
  isAudioPlayed: null,
  isPaused: false,
  loadEvacuator: false,
  lostLife: null,
};

export default gameStore;
