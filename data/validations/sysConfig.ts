import { GmachDetails } from './../../.history/types/SysConfig.d_20221011021419';
import { isPast } from 'date-fns';
import axios from 'axios';
import * as yup from "yup";
export let actionGmachValidation = yup.object({
    title: yup.string().min(2).max(50).required(), desc: yup.string().min(2).max(400).required(), imgFile: yup
        .mixed()
        .required("You need to provide an avatar")
        .test("type", "Please , provide a jpeg or png image", (value) => {
            let res = false;
            if (value[0] !== undefined) {
                res = (value[0].type === "image/jpeg") || (value[0].type === "image/png")
            }
            return res;
        })
        .test("fileSize", "The file is too large", (value) => {
            let res = false;
            if (value[0] !== undefined) {
                res = (value[0].size <= 200000)
            }
            return res
        })
});
export let sysConfigValidation = yup.object({
    gmachDetails: yup.object().shape({
        gmachName: yup.string().min(2).max(50).required(),
        gmachDesc: yup.string().min(2).max(400).required(),
        gmachMail: yup.string().email().required(),
        gmachPhone: yup.string().matches(/^0\d([\d]{0,1})([-]{0,1})\d{7}$/, "The input doesnt seem to be an israeli phone number"),
    }),
    gmachDonation: yup.object().shape({
        paypalLink: yup.string().matches(/^https:\/\/www.paypal.com\/donate\//, "The link is not a valid Paypal donation link")
    }),
    headerText: yup.string().min(2).max(50).required(),
}).required();