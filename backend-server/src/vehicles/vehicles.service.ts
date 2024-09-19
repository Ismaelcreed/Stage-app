import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicles } from './vehicles.schema';
import { VehiclesInput } from './vehicles.input';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicles.name) private readonly vehiclesModel: Model<Vehicles>
  ) {}

  async findAll(): Promise<Vehicles[]> {
    return this.vehiclesModel.find().exec();
  }

  async findOne(id_vehicles: string): Promise<Vehicles | null> {
    return this.vehiclesModel.findOne({ id_vehicles }).exec();
  }

  async create(input: VehiclesInput): Promise<Vehicles> {
    const createdVehicle = new this.vehiclesModel(input);
    return createdVehicle.save();
  }

  async update(id_vehicles: string, input: VehiclesInput): Promise<Vehicles | null> {
    return this.vehiclesModel.findOneAndUpdate({ id_vehicles }, input, { new: true }).exec();
  }

  async delete(id_vehicles: string): Promise<Vehicles | null> {
    return this.vehiclesModel.findOneAndDelete({ id_vehicles }).exec();
  }

  async count(): Promise<number> {
    return this.vehiclesModel.countDocuments().exec();
  }
}
