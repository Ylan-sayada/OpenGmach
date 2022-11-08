import { Schema, pluralize, model, models } from 'mongoose';
import { DonateItem } from '../../types/DonateItem';
const DonateItemSchema = new Schema<DonateItem>({
    desc: { type: String, required: true },
    ownerId: { type: String, required: true },
    imgDescUrl: { type: String, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
    listOfRequest: [{
        name: { type: String, required: true },
        phone: { type: String, required: true },
    }],
    productName: { type: String, required: true },
    address: {
        coord: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true }
        },
        computed_address: { type: String, required: true }
    }
});
pluralize(null);
export default models.DonateItem || model<DonateItem>('DonateItem', DonateItemSchema, 'donateMarket');