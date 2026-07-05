import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademic extends Document {
  type: 'Exam' | 'Holiday' | 'Faculty';
  title: string;
  date?: Date;
  details: string;
  department?: string;
}

const AcademicSchema: Schema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['Exam', 'Holiday', 'Faculty'] 
  },
  title: { type: String, required: true },
  date: { type: Date },
  details: { type: String, required: true },
  department: { type: String }
}, { timestamps: true });

export default mongoose.models.Academic || mongoose.model<IAcademic>('Academic', AcademicSchema);
