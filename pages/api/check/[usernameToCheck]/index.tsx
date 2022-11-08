import { NextApiRequest, NextApiResponse } from "next"
import { connectMongo } from "../../../../utils/connectToMongoose";
import User from "../../../../data/model/User";
type Data = {
    isExist: boolean,
    error?: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await connectMongo();
    let { usernameToCheck } = req.query as { [key: string]: string };

    let isExist = await User.find({ username: usernameToCheck })
    res.status(200).json({ isExist: (isExist.length > 0) });
}