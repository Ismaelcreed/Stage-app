// src/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Police } from './police/police.schema'; 
import { Driver } from './driver/driver.schema';
import { Vehicles } from './vehicles/vehicles.schema';
import { Violations } from './violations/violations.schema';
import { PipelineStage } from 'mongoose'; 

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Police.name) private readonly agentModel: Model<Police>,
    @InjectModel(Driver.name) private readonly conducteurModel: Model<Driver>,
    @InjectModel(Vehicles.name) private readonly vehicleModel: Model<Vehicles>,
    @InjectModel(Violations.name) private readonly violationModel: Model<Violations>,
  ) {}

  async countAgents(): Promise<number> {
    return this.agentModel.countDocuments().exec();
  }

  async countConducteurs(): Promise<number> {
    return this.conducteurModel.countDocuments().exec();
  }

  async countVehicles(): Promise<number> {
    return this.vehicleModel.countDocuments().exec();
  }

  async countViolations(): Promise<number> {
    return this.violationModel.countDocuments().exec();
  }

  // Les types d'infraction
  async countExcessSpeedInfractions(): Promise<number> {
    return this.violationModel.countDocuments({ violation_type: 'Excès de Vitesse' }).exec();
  }

  async countIllegalParkingInfractions(): Promise<number> {
    return this.violationModel.countDocuments({ violation_type: 'Stationnement Illégal' }).exec();
  }

  async countSignalViolationInfractions(): Promise<number> {
    return this.violationModel.countDocuments({ violation_type: 'Non-respect des Signaux' }).exec();
  }

  async countDrivingUnderInfluenceInfractions(): Promise<number> {
    return this.violationModel.countDocuments({ violation_type: 'Conduite Sous Influence' }).exec();
  }

  async countSpecificInfractions(): Promise<number> {
    return this.violationModel.countDocuments({ violation_type: 'Infractions-spécifiques' }).exec();
  }

  async countVehicleRelatedInfractions(): Promise<number> {
    return this.violationModel.countDocuments({ violation_type: 'Infractions liées au véhicule' }).exec();
  }


  async getMonthlyInfractions(): Promise<any[]> {
    const result = await this.violationModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]).exec();

    return result.map(item => ({
      month: item._id.month,
      year: item._id.year,
      total: item.total
    }));
  }


}
