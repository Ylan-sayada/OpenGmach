
import React, { useState } from 'react'
import type { NextComponentType } from 'next';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { sysConfig } from '../data/atoms/landingAtoms';
import styles from "../styles/components/Footer.module.scss";

const Footer: NextComponentType = () => {
    const dataSysConfig = useRecoilValue(sysConfig);
    const [center, setCenter] = useState({ lat: 0, lng: 0 })
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const containerStyle = {
        width: '300px',
        height: '300px'
    };


    const onLoad = React.useCallback(function callback(map: google.maps.Map) {
        setCenter({
            lat: Number(dataSysConfig?.gmachDetails?.gmachAddress?.coord?.lat),
            lng: Number(dataSysConfig?.gmachDetails?.gmachAddress?.coord?.long)
        })

        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [dataSysConfig, center])

    const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, [])
    return (<>
        <footer id={styles.footer}>
            <div className={styles.left_side}>
                <div style={{ backgroundImage: `url(${dataSysConfig?.gmachDetails?.gmachLogo})` }} className={`${styles.logoImg}`} />
                <p>{dataSysConfig.gmachDetails?.gmachDesc}</p>
            </div>
            <div className={styles.right_side}>
                <h3>Contact Us</h3>
                <div className="contact_us_container">
                    <p>Tel - <a href={`tel:${dataSysConfig.gmachDetails?.gmachPhone}`}>{dataSysConfig.gmachDetails?.gmachPhone}</a></p>
                    <p>Address - {dataSysConfig.gmachDetails?.gmachAddress?.computed_address}</p>
                    {dataSysConfig.isLoaded && dataSysConfig.gmachDetails.gmachAddress.coord && <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        <MarkerF position={center} />
                    </GoogleMap>

                    }
                </div>
            </div>
        </footer>
    </>
    )
}
export default Footer