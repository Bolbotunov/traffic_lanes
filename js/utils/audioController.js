export const crushSound = new Audio("assets/crushSound.mp3");
export const beepSound = new Audio("assets/beepSound.mp3");
export const backgroundTraffic = new Audio("assets/traffic.mp3");
export const tapSound = new Audio("assets/tap.wav");
export const evacuatorSound = new Audio(`assets/evacuatorSound.mp3`);

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
      s?.pause?.();
      s.currentTime = 0;
    });
  },

  updateMusic(src, type) {
    const music = new Audio(src);
    if (type === "mainTrack") {
      music.loop = true;
    }
    music.play();
    this.sounds.backgroundMusic = music;
  },
};

export default audioController;
