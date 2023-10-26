import fs from 'fs';
import path from 'path';

export function getAllFiles(dirPath: string, files: string[] = []): string[] {
  const filesInDirectory = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of filesInDirectory) {
    const fullPath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (file.isFile() && fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}
