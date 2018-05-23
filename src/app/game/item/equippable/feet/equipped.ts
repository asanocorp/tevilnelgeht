export function equipped(item, frameData: string[], frameSockets: { [index: string]: Phaser.Geom.Rectangle[]; }): string[] {
  const rightFoot = frameSockets.rightFoot;
  const leftFoot = frameSockets.leftFoot;
  const color = item.equippedColorPaletteIndex;

  fillFrameSocket(rightFoot, frameData, color);
  fillFrameSocket(leftFoot, frameData, color);

  return frameData;
}

function fillFrameSocket(socket: Phaser.Geom.Rectangle[], data: string[], color: string): void {
  socket.forEach(rect => {
    for (let y = rect.y, len = rect.bottom; y < len; ++y) {
      const row = data[y];
      data[y] = row.substr(0, rect.x) + color.repeat(rect.width) + row.substr(rect.right);
    }
  });
}
