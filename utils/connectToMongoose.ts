import mongoose from 'mongoose';
import EnvConfig from '../modules/EnvConfig';
let cachedDb: any = null;
export const connectMongo = async () => {
    if (cachedDb) {
        return Promise.resolve(cachedDb);
    }
    return mongoose.connect(EnvConfig.getDbCon()).then((connection) => {
        cachedDb = connection;
        return cachedDb;
    }).catch(e => {
        throw e
    })
};


