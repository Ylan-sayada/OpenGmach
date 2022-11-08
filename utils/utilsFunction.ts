import { format, isPast, isThisWeek, isThisYear, isToday } from "date-fns";
import { month } from "../data/definitions/constant";
import { Accountancy } from "../types/Accountancy";
import { Schedule } from "../types/Schedule";
import axios from 'axios';
export let containString = (element: string) => {
    return new RegExp(/[a-zA-Z]/g).test(element);
}
export let containsHeb = (str: string) => {
    return (/[\u0590-\u05FF]/).test(str);
}
export let is2DArray = (array: any) => {
    return array[0].constructor === Array;
}
export let fileHasProperType = (file: File, type: string[] | string) => {
    if (file) {
        if (Array.isArray(type)) {
            let properType = false;
            type.forEach((value) => {
                if (file.type === `image/${value}`) {
                    properType = true;
                }
            })
            return properType;
        } else {
            return file.type === `image/${type}`
        }

    }
}
export let fileIsBiggerThan = (file: File, size: number) => {
    if (file) {
        return file.size >= size
    }
}
export let numOccurenceInObj = (arr: any[]) => {
    let usersAmount: { [key: number]: number } = {};
    arr.forEach((element) => {
        if (usersAmount[element.userType] && (typeof usersAmount[element.userType] !== "undefined")) {
            usersAmount[element.userType] += 1;
        }
        else {
            usersAmount[element.userType] = 1;
        }
    })
    return usersAmount;
}
export let formatDMY = (date: number) => {
    return format(date, "dd/LL/y");
}
export let formatForDatePicker = (date: number) => {
    return format(date, "yyyy-LL-dd");
}
export let currentYearAccountancy = (data: Accountancy[]) => {
    let dispatchedByMonth: { [key: string]: any } = {}
    data.map((element) => {
        if (isThisYear(element.date)) {
            let formatedDate = format(element.date, "dd/LL/y").split("/") as [string, string, string];
            let monthToNumber = Number(formatedDate[1]) - 1;
            if (dispatchedByMonth[month[monthToNumber]])
                dispatchedByMonth[`${month[monthToNumber]}`][element.type] += element.amount
            else {
                dispatchedByMonth[month[monthToNumber]] = {};
                dispatchedByMonth[month[monthToNumber]][element.type] = element.amount
            }
        }
    })
    return dispatchedByMonth;
}
export const onlyOne = (arr: boolean[]) => {
    let count = 0, isInvalid = false;
    arr.forEach((element) => {
        if (element) {
            count++;
        }
    })
    if (count != 1) {
        isInvalid = true;
    }
    return isInvalid;
}
export let dispatchDate = (dateArr: Schedule[]) => {
    let dispatch: ({ [key: string]: Schedule[] }) = {
        today: [],
        thisWeek: [],
        laterMore: [],
    }
    dateArr.forEach((reminder) => {
        if (isPast(reminder.taskDate)) {
            return;
        }

        if (isToday(reminder.taskDate)) {
            dispatch.today.push(reminder);
        }
        else if (isThisWeek(reminder.taskDate)) {
            dispatch.thisWeek.push(reminder);
        } else {
            dispatch.laterMore.push(reminder);
        }
    })
    return dispatch;
}
export let isUniqObj = <T extends { username: string }>(obj: T, index: number, objArr: T[]) => objArr.findIndex((v2: T) => (v2.username === obj.username)) === index;
export let isSpecialDay = async () => {
    let today = new Date().toISOString().split('T')[0];
    return await new Promise((resolve, reject) => {
        axios.get(`https://www.hebcal.com/hebcal?cfg=json&geonameid=293397&v=1&maj=on&leyning=off&start=${today}&end=${today}`)
            .then((response: any) => {
                let {
                    items
                } = response.data
                if (items.length > 0) {
                    items.forEach((element: any) => {
                        if (element.yomtov || (element.category === "havdalah")) {
                            resolve(true)
                        }
                    });
                }
                resolve(false);
            })
            .catch((err: Error) => {
                reject(err);
            })
    });
}
export let generateParachaData = () => {
    return Array(11).fill(Array(7).fill(false))
}
export let firstCharToLower = (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1)
}
export let firstCharToUper = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
export let hasSpecialChars = (argToTest: string) => {
    argToTest = argToTest + "";
    return !(/^[a-zA-Z0-9\u0590-\u05FF ]*$/).test(argToTest); // Hebrew character are not considered as special char
}