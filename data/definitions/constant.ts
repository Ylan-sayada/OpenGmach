import { AccountPermission } from "../../types/User";


export const ARRAY_MANAGE = ["show", "create", "remove", "update"];
export const USER_TYPE = {
    0: "Volunteer",
    1: "Donator",
    2: "Needy"
}
export const IMPORTANCE = ["low", "medium", "high"];
export const ARRAY_DOCUMENT = ["Accountancy", "Product", "Schedule", "User"];
export const dayOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const maxDayOfEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const defaultPermission: AccountPermission = {
    "isMainAdmin": false,
    "showStatistics": false,
    "manageProduct": {
        "show": true,
        "remove": true,
        "create": true,
        "update": true
    },
    "manageUsers": {
        "show": false,
        "create": false,
        "update": false,
        "remove": false
    },
    "manageAccountancy": {
        "show": false,
        "remove": false,
        "create": false,
        "update": false
    },
    "manageSchedule": {
        "show": false,
        "remove": false,
        "create": false,
        "update": false
    },
    "manageDonateMarket": {
        "show": false,
        "remove": false,
        "create": false,
        "update": false
    }
}
