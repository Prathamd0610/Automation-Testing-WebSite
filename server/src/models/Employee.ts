import { Schema, model, type HydratedDocument } from 'mongoose';

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface IEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  status: EmployeeStatus;
  hireDate: Date;
  managerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EmployeeDocument = HydratedDocument<IEmployee>;

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    department: { type: String, required: true, index: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'terminated'],
      default: 'active',
      index: true,
    },
    hireDate: { type: Date, required: true },
    managerName: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Employee = model<IEmployee>('Employee', employeeSchema);
