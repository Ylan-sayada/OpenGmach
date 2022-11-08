import type { User as UserType } from "../../../types/User"
export interface Tchat {
    message: string,
    publishDate: number,
    userID: string,
}
export type TchatMsgWithUserData = Tchat & {
    userData: Pick<UserType, 'username' | 'avatar' | 'isConnected'>
};
