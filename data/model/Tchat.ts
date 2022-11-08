import { Tchat } from '../../types/Tchat';
import { Schema, pluralize, model, models } from 'mongoose';
const TchatSchema = new Schema<Tchat>({
    message: { type: String, required: true },
    publishDate: { type: Number, required: true },
    userID: { type: String, required: true },
});
pluralize(null);
export default models.Tchat || model<Tchat>('Tchat', TchatSchema, 'tchat');