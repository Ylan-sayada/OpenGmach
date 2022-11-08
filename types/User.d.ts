import { FullCoordAddress } from './General.d';
export interface User {
    _id: string;
    mail: string;
    name: string;
    phone: string;
    avatar: string;
    lastName: string;
    password: string;
    isConnected: boolean;
    username: string;
    userType: number;
    birthDate: number;
    activation: AccountActivation;
    permission: AccountPermission;
    address: FullCoordAddress;
}
type UserRegistration = Pick<User, "name" | "lastName" | "address" | "username" | "mail" | "phone" | "birthDate" | "password" | "avatar"> & { avatarAsFile?: FileList };
type UserLogin = Pick<User, "username" | "password">
export interface NotAuthUser {
    name: string,
    phone: string
}
export interface NotAuthUserForm {
    firstName: string,
    lastName: string,
    phone: string
}

export interface AccountActivation {
    isActivated: boolean;
    expirationDate: number;
    activationToken: string;
}

export interface AccountPermission {
    isMainAdmin: boolean;
    manageUsers: Manage;
    manageSchedule: Manage;
    showStatistics: boolean;
    manageAccountancy: Manage;
    manageDonateMarket: Manage;
    manageProduct: Manage;
}
export type PermissionWithUserType = AccountPermission & {
    userType: number
}

export interface Manage {
    show: boolean;
    create: boolean;
    remove: boolean;
    update: boolean;
}