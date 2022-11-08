import { NextApiRequest, NextApiResponse } from "next"
import EnvConfig from "../../modules/EnvConfig";
import jwt from 'jsonwebtoken';
type Data = {
    continue?: boolean
    token: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let key = req.body.key;
    let isRight = key === process.env.KEY4LOG;
    let token = jwt.sign({ key }, EnvConfig.getJwtAccessToken());
    res.status(200).json({ continue: isRight, token })
}