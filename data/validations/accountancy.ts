
import * as yup from "yup";
export let accountancyValidation = yup.object({
    amount: yup.number().min(1).typeError("You should submit a valid number"),
    type: yup.number().min(0).max(1),
    details: yup.string().min(2).max(300),
    date: yup.date()
}).required();