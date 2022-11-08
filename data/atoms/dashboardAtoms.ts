import { atom, selector } from "recoil";
import { TchatMsgWithUserData } from './../../types/Tchat.d';
import type { User } from "../../types/User";
import type { Schedule } from './../../types/Schedule';
import type { DonateItem } from "../../types/DonateItem";
import type { Accountancy } from "../../types/Accountancy";
import io from "socket.io-client";
export const dashboardUsers = atom({
    key: 'dashboardUsers',
    default: [] as User[],
});
export const dashboardAccountancy = atom({
    key: 'dashboardAccountancy',
    default: [] as Accountancy[],
});
export const dashboardReminders = atom({
    key: 'dashboardReminders',
    default: [] as Schedule[],
});
export const dashboardDonatedItem = atom({
    key: 'dashboardDonatedItem',
    default: [] as DonateItem[],
});
export const dashboardTchat = atom({
    key: 'dashboardTchat',
    default: [] as TchatMsgWithUserData[],
});
export const authDetails = atom({
    key: 'authDetails',
    default: {} as Omit<User, "password" | "activation.activationToken">
})



