import { Injectable } from '@nestjs/common';
import { FileUpload} from 'graphql-upload/GraphQLUpload.mjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async saveFile(file: FileUpload): Promise<string> {
    const { createReadStream, filename } = file;
    const stream = createReadStream();
    const filePath = path.join(__dirname, '..', '/uploads', filename);
    const writeStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    });
  }
}
