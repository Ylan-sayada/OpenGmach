import { NextApiRequest, NextApiResponse } from "next"
import sgMail from '@sendgrid/mail';
type Data = {
    element?: any
    error?: string,
    user?: any,
    created?: boolean
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
    console.log(process.env.EMAIL);
    if (process.env.EMAIL) {
        const msg = {
            to: "sayylan@gmail.com",
            from: process.env.EMAIL as string,
            subject: 'Account Activation',
            text: 'This is a mail who contain a link to activate your user gmach account',
            html: `<p>Click  <a href="${process.env.NEXT_PUBLIC_HOST}/activation/123">here</a> to activate your account</p>`,
        }
        sgMail.send(msg).then(() => {
            console.log('Email sent to sayylan@gmail.com')
            res.status(200).json({ element: "" })
        }).catch((error) => {
            console.error(error)
            res.status(200).json({ error })
        })
    } else {
        res.status(200).json({ error: "undefined" })
    }


}