import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Violations } from './violations.schema';
import { ViolationsInput } from './violations.input';

@Injectable()
export class ViolationsService {
  constructor(
    @InjectModel(Violations.name) private readonly violationsModel: Model<Violations>,
  ) {}

  // Trouver toutes les violations
  async findAll(): Promise<Violations[]> {
    return this.violationsModel.find().exec();
  }

  // Trouver une violation spécifique
  async findOne(id_violations: string): Promise<Violations | null> {
    const violation = await this.violationsModel.findOne({ id_violations }).exec();

    if (!violation) {
      throw new NotFoundException(`Violation with ID ${id_violations} not found`);
    }

    return violation;
  }

  // Créer une nouvelle violation
  async create(input: ViolationsInput): Promise<Violations> {
    const newViolation = new this.violationsModel(input);
    return newViolation.save();
  }

  // Mettre à jour une violation existante
  async update(id_violations: string, input: ViolationsInput): Promise<Violations | null> {
    const existingViolation = await this.violationsModel
      .findOneAndUpdate({ id_violations }, input, { new: true })
      .exec();

    if (!existingViolation) {
      throw new NotFoundException(`Violation with ID ${id_violations} not found`);
    }

    return existingViolation;
  }

  // Supprimer une violation
  async delete(id_violations: string): Promise<Violations | null> {
    const deletedViolation = await this.violationsModel
      .findOneAndDelete({ id_violations })
      .exec();

    if (!deletedViolation) {
      throw new NotFoundException(`Violation with ID ${id_violations} not found`);
    }

    return deletedViolation;
  }

  // Compter le nombre de violations
  async count(): Promise<number> {
    return this.violationsModel.countDocuments().exec();
  }
}
