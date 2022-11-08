import { Schema, pluralize, model, models } from 'mongoose';
import { Schedule } from '../../types/Schedule';
const ScheduleSchema = new Schema<Schedule>({
    taskDate: { type: Number, required: true },
    taskName: { type: String, required: true },
    importance: { type: Number, required: true },
});
pluralize(null);
export default models.Schedule || model<Schedule>('Schedule', ScheduleSchema, 'scheduler');