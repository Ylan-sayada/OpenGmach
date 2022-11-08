import { NextApiRequest, NextApiResponse } from "next"
import sgMail from '@sendgrid/mail';
import { randomUUID } from "crypto";
import { add } from "date-fns";
import bcrypt from 'bcrypt';
import { defaultPermission } from "../../data/definitions/constant";
import GeneralCrudController from "../../modules/GeneralCrudController";
import { OBJECT_MODEL } from "../../data/definitions/MongooseDocs";
type Data = {
    element?: any
    error?: string,
    user?: any,
    created?: boolean
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let DBCrud = new GeneralCrudController(OBJECT_MODEL['User' as keyof (typeof OBJECT_MODEL)]);
    let hashedPswd = await bcrypt.hash(req.body.password, 10);
    const activationToken = randomUUID();
    DBCrud.add({
        ...req.body,
        password: hashedPswd,
        isConnected: false,
        userType: 1,
        activation: {
            "isActivated": false,
            "activationToken": activationToken,
            "expirationDate": add(new Date(), {
                hours: 1
            }).getTime()
        },
        permission: { ...defaultPermission, isMainAdmin: true }
    });
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
    const msg = {
        to: req.body.mail as string,
        from: process.env.EMAIL as string,
        subject: 'Account Activation',
        text: 'This is a mail who contain a link to activate your user gmach account',
        html: `<p>Click  <a href="${process.env.NEXT_PUBLIC_HOST}/activation/${activationToken}">here</a> to activate your account</p>`,
    };

    sgMail.send(msg).then(() => {
        console.log('Email sent to ' + req.body.mail)
    }).catch((error) => {
        console.error(error)
        console.log(error);
    })
    res.status(200).json({ created: true });
} 