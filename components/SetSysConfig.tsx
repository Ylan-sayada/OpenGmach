import { Libraries } from '@googlemaps/js-api-loader';
import { useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { authDetails } from '../data/atoms/dashboardAtoms';
import { sysConfig } from '../data/atoms/landingAtoms';
import { SysConfig } from '../types/SysConfig';
const libraries: Libraries = ["places"]
export default function SetSysConfig() {
    const router = useRouter();
    const setSysConfig = useSetRecoilState(sysConfig);
    const setAuthDetails = useSetRecoilState(authDetails);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        libraries: libraries,
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string
    })
    useEffect(() => {
        axios.get("http://localhost:3000/api/crud/show/SysConfig")
            .then(element => {
                let isConnected = localStorage.getItem("userData") !== undefined;
                setSysConfig({ ...element.data.element[0], isLoaded } as SysConfig & { isLoaded: boolean })
                if (isConnected) {
                    setAuthDetails(JSON.parse(localStorage.getItem("userData") as string))
                }
                if ((!element.data.element[0].isInit && !localStorage.getItem("initToken")) && router.pathname !== "/Key4Log") {
                    router.push("/Key4Log");
                }
            }).catch(e => {
                console.log(e)
            })

    })
    return null;
}
