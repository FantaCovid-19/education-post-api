import fs from 'fs/promises';
import path from 'path';
import { loggerUtils } from './logger.util';

export async function getAllFiles(relativeDirPath: string, extensions: string[] = ['.js', '.ts']): Promise<string[]> {
  const srcDirPath = path.join(__dirname, '..');
  const dirPath = path.join(srcDirPath, relativeDirPath);
  const files = [];

  try {
    const filesInDirectory = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of filesInDirectory) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        const filesInSubDir = await getAllFiles(fullPath, extensions);
        files.push(...filesInSubDir);
      } else if (extensions.some((ext) => fullPath.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    loggerUtils.error(`Error while reading files in directory ${dirPath}: ${err}`);
  }

  return files;
}
