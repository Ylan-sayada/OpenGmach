import { authByDb } from './../../../../utils/authByDb';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '../../../../types/User';
import EnvConfig from '../../../../modules/EnvConfig';
import { connectMongo } from '../../../../utils/connectToMongoose';



type Data = {
    token?: string,
    userData?: Omit<User, "password" | "activation.activationToken">,
    error?: string
}


export default async function handler(req: NextApiRequest, response: NextApiResponse<Data>) {
    let token = undefined, userData = undefined, result;
    await connectMongo();
    if (req.method === "POST") {
        result = await authByDb(req.body.username, "username", req.body.password);
        if (result) {
            userData = result;
            token = jwt.sign({ ...userData }, EnvConfig.getJwtAccessToken());
            response.status(200).json({ token, userData });
        } else {
            response.status(400).json({ error: "login failed" });
        }
    }
    else {
        response.status(404).json({ error: "mail and/or password are missing/s" })
    }
}
