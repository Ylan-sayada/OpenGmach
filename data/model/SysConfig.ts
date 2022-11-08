import { Schema, pluralize, model, models, Types } from 'mongoose';
import { SysConfig } from '../../types/SysConfig';
import { handleDecimal } from './GeneralSchemaType';
const gmachAction = {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    actionImage: { type: String, required: true },
}
const gmachDetails = {
    gmachName: { type: String, required: true },
    gmachDesc: { type: String, required: true },
    gmachAddress: {
        coord: {
            long: { type: String, required: true, get: handleDecimal },
            lat: { type: String, required: true, get: handleDecimal },
        },
        computed_address: { type: String, required: true },
    },
    gmachPhone: { type: String, required: true },
    gmachMail: { type: String, required: true },
    gmachLogo: { type: String, required: true },

}
const gmachDonation = {
    enabled: { type: Boolean, required: true },
    paypalLink: { type: String, required: true },
}
const SysConfigSchema = new Schema<SysConfig>({
    isInit: { type: Boolean, required: true },
    gmachDetails: gmachDetails,
    gmachDonation: gmachDonation,
    gmachAction: [gmachAction],
    headerText: { type: String, required: true },
    headerImage: [{ type: String, required: true }],
});

pluralize(null);
export default models.SysConfig || model<SysConfig>('SysConfig', SysConfigSchema, 'sysConfig');