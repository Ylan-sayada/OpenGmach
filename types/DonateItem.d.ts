import { FullCoordAddress } from './General.d';
import { NotAuthUser } from './User.d';
export interface DonateItem {
    _id: string,
    desc: string;
    ownerId: string;
    imgDescUrl: string;
    category: string
    isAvailable: boolean;
    listOfRequest: NotAuthUser[];
    productName: string;
    publicationDate: number;
    address: FullCoordAddress
}
