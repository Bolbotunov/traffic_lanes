export const crushSound = new Audio("../assets/crushSound.mp3");
export const beepSound = new Audio("../assets/beepSound.mp3");
export const backgroundTraffic = new Audio("../assets/traffic.mp3");
export const tapSound = new Audio("../assets/tap.wav");
export const evacuatorSound = new Audio(`../assets/evacuatorSound.mp3`);

const audioController = {
  sounds: {
    backgroundMusic: null,
    birdsSound: null,
    backgroundTraffic,
    crushSound,
    beepSound,
    tapSound,
    evacuatorSound,
  },
  updateMusic(src, type) {
    const key = type === "mainTrack" ? "mainTrack" : "birdsSound";
    const old = this.sounds[key];
    if (old) {
      old.pause();
      old.currentTime = 0;
    }

    const music = new Audio(src);
    if (type === "mainTrack") {
      music.loop = true;
      this.sounds[key] = music;
    }
  },
  play(name) {
    const sound = this.sounds[name];
    if (sound?.play) sound.play();
  },

  pause(name) {
    const sound = this.sounds[name];
    if (sound?.pause) sound.pause();
  },

  reset(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause?.();
      sound.currentTime = 0;
    }
  },

  playAll() {
    Object.values(this.sounds).forEach((s) => s?.play?.());
  },

  pauseAll() {
    Object.values(this.sounds).forEach((s) => s?.pause?.());
  },

  resetAll() {
    Object.values(this.sounds).forEach((s) => {
      if (s?.pause) {
        s.pause();
        s.currentTime = 0;
      }
    });
  },
};

export default audioController;
