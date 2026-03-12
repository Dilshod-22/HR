import { memoryStorage } from 'multer';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export const multerMemory = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
};
