import mongoose, { Document, Model, Schema } from 'mongoose';
import { EventStatus } from './event.interface';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  userId: mongoose.Types.ObjectId; 
  eventStatus: EventStatus; 

}


const eventSchema: Schema<IEvent> = new mongoose.Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventStatus: { 
        type: String, 
        enum: Object.values(EventStatus), 
        default: EventStatus.DRAFT, 
        required: true 
      },
  },
  { timestamps: true } 
);

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
