import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  position: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Position', index: true })
  // position: Position;

  @Prop()
  department: string;

  @Prop({enum: ['full-time', 'parttime', 'contract']})
  employmentType: string;

  @Prop({enum: ['active', 'inactive']})
  employmentStatus: string;

  @Prop()
  hireDate: Date;

  @Prop()
  terminationDate: Date;

  @Prop()
  managerId: string;

  @Prop()
  emergencyContactName: string;

  @Prop()
  emergencyContactPhone: string;

  @Prop()
  emergencyContactRelation: string;

  @Prop()
  profilePhoto: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop()
  notes: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({
  firstname: 'text',
  lastname: 'text',
  email: 'text',
  dateOfBirht: 'text',
  phone: 'text',
  gender: 'text',
});