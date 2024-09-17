import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';


@ObjectType()
@Schema()
export class Violations {
  @Field(() => ID)
  @Prop({ type: String, required: true })
  id_violations: string;

  @Field()
  @Prop({ type: String, required: true })
  driver_id: string;

  @Field()
  @Prop({ type: String, required: true })
  officer_id: string;

  @Field()
  @Prop({  type: String, required: true})
  vehicle_id: string;

  @Field(() => [String])
  @Prop({ type: [String], required: true })  
  violation_type: string[];

  @Field()
  @Prop({ type: String, required: true })
  desc: string;

  @Field()
  @Prop({ type: Date, required: true })
  date: Date;

  @Field()
  @Prop({ type: String, required: true })
  localisation: string;

  @Field({nullable : true})  
  @Prop({ type: Number, required: true }) 
  amende: number;
}

export const ViolationsSchema = SchemaFactory.createForClass(Violations);
