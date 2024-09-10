import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Driver extends Document {
  @Field(() => String)
  @Prop({ type: String, required: true  , unique : true})
  id_driver: string;

  @Field(() => String)
  @Prop({ required: true })
  licence_number: string;

  @Field(() => String)
  @Prop({ required: true })
  driver_name: string;

  @Field(() => String)
  @Prop({ required: true })
  sex: string;

  @Field(() => Int)  
  @Prop({ required: true })
  age: number; 
  @Field(() => String)
  @Prop({ required: true })
  address: string;

  @Field(() => String)
  @Prop({ required: true })
  phone: string;

  @Field(() => String, { nullable: true })  
  @Prop({ type: String, default: null })
  profile?: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
