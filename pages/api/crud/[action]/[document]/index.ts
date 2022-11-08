import { connectMongo } from './../../../../../utils/connectToMongoose';
import { authenticateTokenSyncronously } from '../../../../../utils/authenticateTokenSyncronously';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next'
import { OBJECT_MODEL } from '../../../../../data/definitions/MongooseDocs';
import { ENUM_MANAGE } from '../../../../../data/definitions/enums';
import GeneralCrudController from '../../../../../modules/GeneralCrudController';
import { add } from 'date-fns';
import { randomUUID } from 'crypto';
import sgMail from '@sendgrid/mail';
import { defaultPermission } from '../../../../../data/definitions/constant';

type Data = {
    element?: any
    error?: string,
    user?: any,
    created?: boolean,
    update?: any,
    deleted?: any

}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let { document, action } = req.query as { [key: string]: string };
    console.log(document, action)
    let result, user, isAuthenticated = false;
    try {
        await connectMongo();
    } catch (error) {
        res.status(500).json({ error: "The server could not connect to the database" })
    }

    if (!(ENUM_MANAGE[action.toLocaleUpperCase() as keyof (typeof ENUM_MANAGE)] && OBJECT_MODEL[document as keyof (typeof OBJECT_MODEL)])) {
        res.status(400).json({ error: `invalid argument ${document}` });
    }
    else {
        let DBCrud = new GeneralCrudController(OBJECT_MODEL[document as keyof (typeof OBJECT_MODEL)])
        if (document === "User" || document === "Tchat" || document === "Schedule" || (document !== "SysConfig" && action !== "show") || (document === "DonateItem" && action !== "show")) {
            user = authenticateTokenSyncronously(req) as any;
            if (user) {
                if (user.permission.isMainAdmin || user.permission[`manage${document}`][action]) {
                    isAuthenticated = true;
                }
            }
        }

        try {
            switch (req.method) {
                case "POST":
                    if (document === "User") {
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
                            permission: { ...defaultPermission }
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
                    } else if (document === "DonateItem") {
                        DBCrud.add({
                            ...req.body,
                            listOfRequest: [],
                            category: "any",
                            isAvailable: true
                        });
                        res.status(200).json({ created: true });
                    }
                    else {
                        console.log(req.body)

                        let result = await DBCrud.add({
                            ...req.body
                        });
                        console.log(result)
                        res.status(200).json({ created: true });
                    }
                    break;
                case "GET":
                    result = await DBCrud.all();
                    res.status(200).json({ element: result });
                    break;
                case "PUT":
                    result = await DBCrud.update(req.body._id, req.body);
                    console.log(result)
                    console.log(req.body)
                    res.status(200).json({ update: result });
                    break;
                case "DELETE":
                    result = await DBCrud.removeMany(req.body, '_id');
                    res.status(200).json({ element: result });
                    break;
                default:
                    res.status(404).json({ element: action, error: "Your method could not be handled by the server" });
                    break;
            }
        } catch (error) {
            res.status(404).json({ element: action, error: "Your method could not be handled by the server" });
        }

    }
}