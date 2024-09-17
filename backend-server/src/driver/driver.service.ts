import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver } from './driver.schema';
import { DriverInput } from './driver.input';
import { FileUpload } from 'src/upload/graphql-upload';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class DriverService {
  private readonly uploadPath = join(__dirname, '../../uploads');

  constructor(@InjectModel(Driver.name) private driverModel: Model<Driver>) {}

  async findAll(): Promise<Driver[]> {
    return this.driverModel.find().exec();
  }

  async findById(id_driver: string): Promise<Driver | null> {
    return this.driverModel.findOne({ id_driver }).exec();
  }

  async create(driverInput: DriverInput): Promise<Driver> {
    const createdDriver = new this.driverModel(driverInput);
    return createdDriver.save();
  }

  async update(id_driver: string, driverInput: DriverInput): Promise<Driver | null> {
    return this.driverModel.findOneAndUpdate({ id_driver }, driverInput, { new: true }).exec();
  }

  async delete(id_driver: string): Promise<Driver | null> {
    return this.driverModel.findOneAndDelete({ id_driver }).exec();
  }

  // Méthode pour gérer le fichier uploadé
  async handleFileUpload(file: FileUpload): Promise<string> {
    const { createReadStream, filename } = file;
    const stream = createReadStream();
    const filePath = join(this.uploadPath, filename);

    await new Promise((resolve, reject) => {
      stream
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject);
    });
  
    // Retourner l'URL ou le chemin du fichier
    return `http://localhost:3000/uploads/${filename}`;
  }
  async count(): Promise<number> {
    return this.driverModel.countDocuments().exec();
  }
}
