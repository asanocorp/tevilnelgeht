import { Injectable } from '@angular/core';
import GenerateTexture from 'phaser/src/create/GenerateTexture';

/**
 * Texture service. Provides functionality for generating game textures on the fly.
 */
@Injectable({
  providedIn: 'root'
})
export class TextureService {
  /**
   * Texture background shadow blur magnitude.
   */
  private static readonly shadowBlur = 5;

  /**
   * Image data step magnitude.
   */
  private static readonly imageDataStep = 4;

  /**
   * Image data alpha channel offset magnitude.
   */
  private static readonly imageDataAlphaChannelOffset = 3;

  /**
   * Generate source canvas for specified texture data.
   *
   * @param data ach character represents a pixel & indexes into some color palette. Pixel coordinates derived from
   * array position (y) & character position (x).
   * @param pixelWidth Pixel width scale factor.
   * @param pixelHeight Pixel height scale factor.
   * @param shadowColor Texture background shadow color.
   */
  public generateCanvas(data: string[], pixelWidth: number, pixelHeight: number, shadowColor?: string): HTMLCanvasElement {
    const outputTextureCanvas = GenerateTexture({ data, pixelWidth, pixelHeight });

    if (!shadowColor) {
      return outputTextureCanvas;
    }

    // Generate texture background shadow.

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

    // Draw texture over top of shadow texture.
    outputTextureContext.drawImage(GenerateTexture({ data, pixelWidth, pixelHeight }), 0, 0);

    return outputTextureCanvas;
  }

  /**
   * Generate & load specified textures.
   *
   * @param scene Phaser scene with which the generated textures are loaded & cached.
   * @param textures Array of texture data.
   * @param pixelWidth Pixel width scale factor.
   * @param pixelHeight Pixel height scale factor.
   */
  public loadTextures(scene: Phaser.Scene, textures: any[], pixelWidth: number, pixelHeight: number): void {
    textures.forEach(texture => {
      if (!scene.textures.checkKey(texture.key)) {
        return;
      }

      scene.textures.addCanvas(
        texture.key,
        this.generateCanvas(texture.data, pixelWidth, pixelHeight, texture.shadowColor)
      );
    });
  }

  /**
   * Load provided animations.
   *
   * @param scene Phaser scene with which the animations are loaded & cached.
   * @param animations Array of animation configurations.
   */
  public loadAnimations(scene: Phaser.Scene, animations: any[]): void {
    animations.forEach(animation => scene.anims.create(animation));
  }
}
