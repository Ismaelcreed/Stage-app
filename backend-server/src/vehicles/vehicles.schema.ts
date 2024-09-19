import { Field, ObjectType ,ID} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Driver } from 'src/driver/driver.schema';

@Schema() 

@ObjectType()
export class Vehicles extends Document {
  @Field(() => String)
  @Prop({ required: true, unique: true , type: String })
  id_vehicles: string;

  @Field(() => String)
  @Prop({ required: true })
  licence_plate: string;

  @Field(() => String)
  @Prop({ required: true })
  mark: string;

  @Field(() => String)
  @Prop({ required: true })
  modele: string;

  @Field(() => String)
  @Prop({ required: true })
  year: string;

  @Field(() => String)
  @Prop({ required: true })
  color: string;

  @Field(() => String)
  @Prop({ required: true })
  owner_id: string;
}

export const VehiclesSchema = SchemaFactory.createForClass(Vehicles);
