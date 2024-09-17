// vehicles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicles } from './vehicles.schema';
import { VehiclesInput } from './vehicles.input';
import { Driver } from '../driver/driver.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicles.name) private readonly vehiclesModel: Model<Vehicles>,
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>
  ) {}

  async findAll(): Promise<Vehicles[]> {
    return this.vehiclesModel.find().populate('owner_id').exec();
  }

  async findOne(id_vehicles: string): Promise<Vehicles | null> {
    return this.vehiclesModel.findOne({ id_vehicles }).populate('owner_id').exec();
  }

  async create(input: VehiclesInput): Promise<Vehicles> {
    const createdVehicle = new this.vehiclesModel(input);
    return createdVehicle.save();
  }

  async update(id_vehicles: string, input: VehiclesInput): Promise<Vehicles | null> {
    return this.vehiclesModel.findOneAndUpdate({ id_vehicles }, input, { new: true }).populate('owner_id').exec();
  }

  async delete(id_vehicles: string): Promise<Vehicles | null> {
    return this.vehiclesModel.findOneAndDelete({ id_vehicles }).populate('owner_id').exec();
  }
  async count(): Promise<number> {
    return this.vehiclesModel.countDocuments().exec();
  }
}
