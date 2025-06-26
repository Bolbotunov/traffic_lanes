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
  backgroundMusic: null,
  isAudioPlayed: null,
};

export default gameStore;
