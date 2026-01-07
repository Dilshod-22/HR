import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {

  @Prop()
  firstname: number;

  @Prop()
  lastname: number;

  @Prop()
  email: number;

  @Prop()
  phone: number;

  @Prop()
  dateOfBirht: number;

  @Prop()
  gender: number;
}



export const EmployeeSchema = SchemaFactory.createForClass(Employee);
