import { NextApiRequest, NextApiResponse } from "next"
import SysConfig from "../../data/model/SysConfig";
import { connectMongo } from "../../utils/connectToMongoose";
type Data = {
    success: boolean,
    error?: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let { userRequest, _id } = req.body;
    try {
        await connectMongo();

        let result = await SysConfig.findOneAndUpdate({ isInit: false }, { isInit: true });
        console.log(result);
        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, error: "The server could not connect to the database" })
    }
}