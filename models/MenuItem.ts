import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  day: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  items: string[];
  timing: string;
}

const MenuItemSchema: Schema = new Schema({
  day: { type: String, required: true },
  meal: { 
    type: String, 
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] 
  },
  items: [{ type: String, required: true }],
  timing: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
