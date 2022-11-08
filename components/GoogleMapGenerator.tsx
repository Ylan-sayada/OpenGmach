import React, { useState, useCallback, useMemo } from 'react';;
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';





type Props = {
    coord: {
        lat: number,
        long: number
    },
    size: {
        width: number,
        height: number
    }

}
export default function GoogleMapGenerator({ coord, size }: Props) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string
    })
    const containerStyle = {
        width: size.width + 'px',
        height: size.height + 'px'
    };
    const [map, setMap] = useState(null)
    const center = {
        lat: coord.lat,
        lng: coord.long
    };
    // const onLoad = useCallback(function callback(map: any) {
    //     const bounds = new window.google.maps.LatLngBounds(center);
    //     map.fitBounds(bounds);
    //     setMap(map)
    // }, [setMap,center])

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null)
    }, [])
    return (
        isLoaded ? (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                // onLoad={onLoad}
                onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        ) :
            <></>
    )
}
