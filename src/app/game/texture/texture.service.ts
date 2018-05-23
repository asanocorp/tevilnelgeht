import { Injectable } from '@angular/core';
import GenerateTexture from 'phaser/src/create/GenerateTexture';

@Injectable({
  providedIn: 'root'
})
export class TextureService {
  private static readonly shadowBlur = 5;

  private static readonly imageDataStep = 4;

  private static readonly imageDataAlphaChannelOffset = 3;

  public generateCanvas(data: string[], pixelWidth: number, pixelHeight: number, shadowColor?: string): HTMLCanvasElement {
    const outputTextureCanvas = GenerateTexture({ data, pixelWidth, pixelHeight });

    if (!shadowColor) {
      return outputTextureCanvas;
    }

    const outputTextureContext = outputTextureCanvas.getContext('2d');
    const outputTextureData = outputTextureContext.getImageData(0, 0, outputTextureCanvas.width, outputTextureCanvas.height);
    const outputTextureDataData = outputTextureData.data;
    const outputTextureDataWidth = outputTextureData.width;

    outputTextureContext.shadowBlur = TextureService.shadowBlur;
    outputTextureContext.shadowColor = shadowColor;

    const step = TextureService.imageDataStep;

    for (let i = 0, len = outputTextureData.data.length; i < len; i += step) {
      const alpha = outputTextureDataData[i + TextureService.imageDataAlphaChannelOffset];

      if (alpha) {
        const index = Math.floor(i / step);
        const x = index % outputTextureDataWidth;
        const y = Math.floor(index / outputTextureDataWidth);

        outputTextureContext.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
        outputTextureContext.fillRect(x, y, 1, 1);
      }
    }

    outputTextureContext.drawImage(GenerateTexture({ data, pixelWidth, pixelHeight }), 0, 0);

    return outputTextureCanvas;
  }

  public loadTextures(scene: Phaser.Scene, textures: any[], pixelWidth: number, pixelHeight: number): void {
    textures.forEach(
      texture => scene.textures.addCanvas(
        texture.key,
        this.generateCanvas(texture.data, pixelWidth, pixelHeight, texture.shadowColor)
      )
    );
  }

  public loadAnimations(scene: Phaser.Scene, animations: any[]): void {
    animations.forEach(animation => scene.anims.create(animation));
  }
}
