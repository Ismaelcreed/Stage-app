import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field , ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Police extends Document{
    @Field(() => String)
    @Prop({ required: true })
    police_name: string;

    @Field(() => String)
    @Prop({ required: true , unique: true , type : String})
    badge_number: string;

    @Field(() => String)
    @Prop({ required: true })
    rank: string;
    
}
export const PoliceSchema = SchemaFactory.createForClass(Police);
