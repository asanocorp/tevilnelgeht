export const animations = {
  idle: {
    frameRate: 1,
    frames: [
      { key: 'idle0' },
      { key: 'idle1' }
    ],
    repeat: -1
  },
  walkRight: {
    frameRate: 4,
    frames: [
      { key: 'walk1' },
      { key: 'walk2' },
      { key: 'walk3' },
      { key: 'walk0' }
    ],
    repeat: 0
  },
  walkLeft: {
    frameRate: 4,
    frames: [
      { key: 'walk3' },
      { key: 'walk2' },
      { key: 'walk1' },
      { key: 'walk0' }
    ],
    repeat: 0
  }
};
