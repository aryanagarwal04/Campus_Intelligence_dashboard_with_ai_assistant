import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  availability: 'Available' | 'Checked Out' | 'Reserved';
  shelf: string;
  isbn?: string;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  availability: { 
    type: String, 
    required: true,
    enum: ['Available', 'Checked Out', 'Reserved'] 
  },
  shelf: { type: String, required: true },
  isbn: { type: String }
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
