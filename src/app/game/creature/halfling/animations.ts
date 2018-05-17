export const animations = {
  idle: {
    frameRate: 2,
    frames: [
      { key: 'idle0' },
      { key: 'idle1' }
    ],
    repeat: -1
  },
  walkRight: {
    frameRate: 4,
    frames: [
      { key: 'walk0' },
      { key: 'walk1' },
      { key: 'walk2' },
      { key: 'walk3' }
    ],
    repeat: -1
  },
  walkLeft: {
    frameRate: 4,
    frames: [
      { key: 'walk0' },
      { key: 'walk3' },
      { key: 'walk2' },
      { key: 'walk1' }
    ],
    repeat: -1
  }
};
