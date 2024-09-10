import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Violations } from './violations.schema';
import { Driver } from '../driver/driver.schema';
import { Vehicles } from '../vehicles/vehicles.schema';
import { Police } from '../police/police.schema';
import { ViolationsInput } from './violations.input';

@Injectable()
export class ViolationsService {
  constructor(
    @InjectModel(Violations.name) private readonly violationsModel: Model<Violations>,
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    @InjectModel(Police.name) private readonly policeModel: Model<Police>,
    @InjectModel(Vehicles.name) private readonly vehicleModel: Model<Vehicles>,
  ) {}

  async findAll(): Promise<Violations[]> {
    const violations = await this.violationsModel.find().exec();

    for (const violation of violations) {
      if (violation.driver_id) {
        const driver = await this.driverModel.findOne({ id_driver: violation.driver_id }).exec();
        violation.driver_id = driver ? driver.id_driver : undefined;
      }
      if (violation.officer_id) {
        const officer = await this.policeModel.findOne({ id_officer: violation.officer_id }).exec();
        violation.officer_id = officer ? officer.badge_number : undefined;
      }
      if (violation.vehicle_id) {
        const vehicle = await this.vehicleModel.findOne({ id_vehicle: violation.vehicle_id }).exec();
        violation.vehicle_id = vehicle ? vehicle.licence_plate : undefined;
      }
    }

    return violations;
  }

  async findOne(id_violations: string): Promise<Violations | null> {
    const violation = await this.violationsModel.findOne({ id_violations }).exec();

    if (violation) {
      if (violation.driver_id) {
        const driver = await this.driverModel.findOne({ id_driver: violation.driver_id }).exec();
        violation.driver_id = driver ? driver.id_driver : undefined;
      }
      if (violation.officer_id) {
        const officer = await this.policeModel.findOne({ badge_number: violation.officer_id }).exec();
        violation.officer_id = officer ? officer.badge_number : undefined;
    }
    
    
      if (violation.vehicle_id) {
        const vehicle = await this.vehicleModel.findOne({ id_vehicles: violation.vehicle_id }).exec();
        violation.vehicle_id = vehicle ? vehicle.id_vehicles : undefined;
      }
    }

    return violation;
}


  async create(input: ViolationsInput): Promise<Violations> {
    const newViolation = new this.violationsModel(input);
    return newViolation.save();
  }

  async update(id_violations: string, input: ViolationsInput): Promise<Violations | null> {
    const existingViolation = await this.violationsModel.findOneAndUpdate(
      { id_violations },
      input,
      { new: true },
    ).exec();

    if (!existingViolation) {
      throw new NotFoundException(`Violation with ID ${id_violations} not found`);
    }

    if (existingViolation.driver_id) {
      const driver = await this.driverModel.findOne({ id_driver: existingViolation.driver_id }).exec();
      existingViolation.driver_id = driver ? driver.id_driver : undefined;
    }
    if (existingViolation.officer_id) {
      const officer = await this.policeModel.findOne({ id_officer: existingViolation.officer_id }).exec();
      existingViolation.officer_id = officer ? officer.badge_number : undefined;
    }
    if (existingViolation.vehicle_id) {
      const vehicle = await this.vehicleModel.findOne({ id_vehicle: existingViolation.vehicle_id }).exec();
      existingViolation.vehicle_id = vehicle ? vehicle.licence_plate : undefined;
    }

    return existingViolation;
  }

  async delete(id_violations: string): Promise<Violations | null> {
    const deletedViolation = await this.violationsModel.findOneAndDelete({ id_violations }).exec();

    if (!deletedViolation) {
      throw new NotFoundException(`Violation with ID ${id_violations} not found`);
    }

    return deletedViolation;
  }
  async findDriverById(id: string): Promise<Driver | null> {
    return this.driverModel.findOne({ id_driver: id }).exec();
  }

  async findOfficerById(id: string): Promise<Police | null> {
    return this.policeModel.findOne({  badge_number: id }).exec();
  }

  async findVehicleById(id: string): Promise<Vehicles | null> {
    return this.vehicleModel.findOne({ id_vehicles: id }).exec();
  }
}
