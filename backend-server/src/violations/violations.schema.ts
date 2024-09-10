import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Vehicles } from 'src/vehicles/vehicles.schema';
import { Police } from 'src/police/police.schema';
import { Driver } from 'src/driver/driver.schema';

@Schema()
@ObjectType()
export class Violations extends Document {
  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  id_violations: string;

  @Field(() => Driver, { nullable: true })
  @Prop({ type: String, ref: 'Driver', required: false })
  driver_id?: string;

  @Field(() => Police, { nullable: true })
  @Prop({ type: String, ref: 'Police', required: false })
  officer_id?: string;

  @Field(() => Vehicles, { nullable: true })
  @Prop({ type: String, ref: 'Vehicles', required: false })
  vehicle_id?: string;

  @Field()
  @Prop({ required: true })
  violation_type: string;

  @Field()
  @Prop({ required: true })
  desc: string;

  @Field()
  @Prop({ required: true })
  date: Date;

  @Field()
  @Prop({ required: true })
  localisation: string;
}
export const ViolationsSchema = SchemaFactory.createForClass(Violations);