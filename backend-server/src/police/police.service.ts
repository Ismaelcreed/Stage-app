import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Police } from './police.schema';
import { PoliceInput } from './police.input';

@Injectable()
export class PoliceService {
  constructor(
    @InjectModel(Police.name) private policeModel: Model<Police>,
  ) {}

  async findAll(): Promise<Police[]> {
    return this.policeModel.find().exec();
  }

  async findOne(badge_number: string): Promise<Police | null> {
    return this.policeModel.findOne({ badge_number }).exec();
  }

  async create(policeData: PoliceInput): Promise<Police> {
    try {
      const newPolice = new this.policeModel(policeData);
      return await newPolice.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Un numéro de badge unique est requis.');
      }
      throw error;
    }
  }

  async update(badge_number: string, policeData: PoliceInput): Promise<Police | null> {
    return this.policeModel.findOneAndUpdate({ badge_number }, policeData, { new: true }).exec();
  }

  async delete(badge_number: string): Promise<Police | null> {
    return this.policeModel.findOneAndDelete({ badge_number }).exec();
  }
}
