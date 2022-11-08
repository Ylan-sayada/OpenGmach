import { atom } from "recoil";
import { SysConfig } from "../../types/SysConfig";
export const sysConfig = atom({
    key: 'SysConfig',
    default: {} as SysConfig & { isLoaded: boolean },
});