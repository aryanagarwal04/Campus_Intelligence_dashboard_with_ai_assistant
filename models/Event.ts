import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Workshop' | 'Other';
  date: Date;
  venue: string;
  organizer: string;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Tech', 'Cultural', 'Sports', 'Workshop', 'Other'] 
  },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  organizer: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
