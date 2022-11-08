import { Schema, pluralize, model, models } from 'mongoose';
import { Accountancy } from '../../types/Accountancy';
const AccountancySchema = new Schema<Accountancy>({
    details: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: Number, required: true },
    date: { type: Number, required: true }
});
pluralize(null);
export default models.Accountancy || model<Accountancy>('Accountancy', AccountancySchema, 'accountancy');