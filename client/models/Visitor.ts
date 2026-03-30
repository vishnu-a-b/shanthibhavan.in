import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisitor extends Document {
  count: number;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>({
  count: { type: Number, default: 0 },
}, { timestamps: true });

const Visitor: Model<IVisitor> = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;
