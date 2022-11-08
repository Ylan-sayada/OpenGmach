export type ModalState = { toShow: boolean, params?: string };
export type ToastState = {
    toShow: boolean, params?: {
        variant: string;
        bodyTxt: string;
        headerTxt: string;
    }
}
export type SocketHandle<T> = {
    data: T,
    method: 'add' | 'remove' | 'update'
}
export type FullCoordAddress = {
    coord: {
        long: number;
        lat: number;
    },
    computed_address: string;
}