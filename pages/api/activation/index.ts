import { NextApiRequest, NextApiResponse } from "next"
import User from "../../../data/model/User";
import { connectMongo } from "../../../utils/connectToMongoose";
type Data = {
    success: boolean,
    error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let { token } = req.body;
    let currentTime = new Date().getTime();
    User.updateOne({
        'activation.activationToken': token,
        'activation.expirationDate': {
            $gt: currentTime
        },
    }, {
        'activation.isActivated': true
    }).then((response) => {
        let {
            matchedCount,
            modifiedCount
        } = response;
        let code = matchedCount && modifiedCount ? 1 : matchedCount ? 0 : -1;
        res.status(200).json({
            success: modifiedCount > 0
        })
    })
}