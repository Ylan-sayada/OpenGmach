import { Schema, pluralize, model, models } from 'mongoose';
import { User } from '../../types/User';
import { manageObj } from './GeneralSchemaType';

const userSchema = new Schema<User>({
    mail: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    userType: { type: Number, required: true },
    isConnected: { type: Boolean, required: true },
    birthDate: { type: Number, required: true },
    activation: {
        isActivated: { type: Boolean, required: true },
        expirationDate: { type: Number, required: true },
        activationToken: { type: String, required: true }
    },
    address: {
        coord: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true }
        },
        computed_address: { type: String, required: true }
    },
    permission: {
        isMainAdmin: { type: Boolean, required: false },
        showStatistics: { type: Boolean, required: false },
        manageUsers: manageObj,
        manageSchedule: manageObj,
        manageDonateMarket: manageObj,
        manageAccountancy: manageObj,
        manageProduct: manageObj
    }
});
pluralize(null);
export default models.User || model<User>('User', userSchema, 'user');