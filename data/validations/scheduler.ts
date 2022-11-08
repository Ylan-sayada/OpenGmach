import { isPast, isToday } from "date-fns";
import * as yup from "yup";
export let scheduleValidation = yup.object({
    taskName: yup.string().min(2).max(80).required(),
    importance: yup.number().min(0).max(2).required()
});