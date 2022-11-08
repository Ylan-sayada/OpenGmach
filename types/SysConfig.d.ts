import { FullCoordAddress } from "./General";

export interface SysConfig {
    id: ID;
    isInit: boolean;
    gmachDetails: GmachDetails;
    gmachDonation: GmachDonation;
    gmachAction: GmachAction[];
    headerText: string;
    headerImage: string[];
}

export interface GmachAction {
    title: string;
    desc: string;
    actionImage: string;
}

export interface GmachDetails {
    gmachName: string;
    gmachDesc: string;
    gmachAddress: FullCoordAddress;
    gmachPhone: string;
    gmachMail: string;
    gmachLogo: string;
}

export interface GmachDonation {
    enabled: boolean;
    paypalLink: string;
}

export interface ID {
    oid: string;
}