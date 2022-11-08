import { isPast } from 'date-fns';
import axios from 'axios';
import * as yup from "yup";
export let loginValidation = yup.object({
    username: yup.string().min(2).max(50),
    password: yup.string().min(2).max(50)
}).required();
export let registerValidation = yup.object({
    name: yup.string().min(2).max(50).required(),
    lastName: yup.string().min(2).max(50),
    username: yup.string().min(2).max(50).test(
        'is-exist',
        "This user name is already exist",
        async (value) => {

            let response = true;
            if (value) {
                if (typeof value !== "undefined" && value.length > 2) {
                    response = (await axios.get(`${process.env.NEXT_PUBLIC_HOST}api/check/${value}`)).data.isExist as boolean;
                }

            }
            return !response;
        },
    ),
    password: yup.string().min(2).max(50),
    birthDate: yup.date().test(
        'is-pastBirthdate',
        "Marty is that you ?",
        async (value) => {
            return isPast(value as Date);
        },
    ),
    mail: yup.string().email().required(),
    avatarAsFile: yup
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
        }),
    phone: yup.string().matches(/^0\d([\d]{0,1})([-]{0,1})\d{7}$/, "The input doesnt seem to be an israeli phone number"),
}).required();
