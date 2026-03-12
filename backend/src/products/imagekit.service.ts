import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import ImageKit, { toFile } from '@imagekit/nodejs';

@Injectable()
export class ImageKitService {
  private imagekit: ImageKit | null = null;
  private readonly configured: boolean;

  constructor() {
    const privateKey = "private_TSz93gxCDXt8uvllKTuxKwJL7a4=";
    this.configured = !!privateKey;
    if (this.configured) {
      this.imagekit = new ImageKit({ privateKey: privateKey! });
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  async upload(
    buffer: Buffer,
    fileName: string,
    folder: string,
  ): Promise<{ url: string; fileId: string }> {
    if (!this.configured || !this.imagekit) {
      throw new ServiceUnavailableException(
        'ImageKit sozlanmagan. .env da IMAGEKIT_PRIVATE_KEY ni to‘ldiring (imagekit.io dashboard).',
      );
    }
    const file = await toFile(buffer, `${Date.now()}-${fileName}`);
    const result = await this.imagekit.files.upload({
      file,
      fileName: file.name || `${Date.now()}-${fileName}`,
      folder: `/crud_full/${folder}`,
    });
    return {
      url: result.url || '',
      fileId: result.fileId || '',
    };
  }

  async delete(fileId: string): Promise<void> {
    if (!this.configured || !this.imagekit || !fileId) return;
    try {
      await this.imagekit.files.delete(fileId);
    } catch {
      // Eski fayl bo‘lmasa ham xato bermaslik
    }
  }
}
