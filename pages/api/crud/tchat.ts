import { NextApiRequest, NextApiResponse } from "next"
import type { TchatMsgWithUserData } from "../../../types/Tchat"

import Tchat from "../../../data/model/Tchat";
import { connectMongo } from "../../../utils/connectToMongoose";
type Data = {
    msgList: TchatMsgWithUserData[],
    error?: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await connectMongo();
    let msgList = await Tchat.aggregate().lookup({
        from: 'user',
        localField: 'userID',
        foreignField: '_id',
        as: 'userData',
    }).unwind({ path: '$userData' }).project({
        message: 1,
        publishDate: 1,
        userID: 1,
        'userData.username': 1,
        'userData.avatar': 1,
        'userData.isConnected': 1
    }) as TchatMsgWithUserData[];
    res.status(200).json({ msgList });
}