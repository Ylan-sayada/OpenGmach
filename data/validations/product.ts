import * as yup from "yup";
export let productValidation = yup.object({
    desc: yup.string().min(2).max(400).required(),
    productName: yup.string().min(2).max(80).required(),
});
export let requestValidation = yup.object({
    firstName: yup.string().min(2).max(80).required(),
    lastName: yup.string().min(2).max(80).required(),
    phone: yup.string().matches(/^0\d([\d]{0,1})([-]{0,1})\d{7}$/, "The input doesnt seem to be an israeli phone number")
});