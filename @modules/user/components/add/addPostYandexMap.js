import { YMaps, Map, Placemark } from "react-yandex-maps";
import Container from "@modules/common/components/container/container";
import { useRef, useState } from "react";

export default function AddPostYandexMap() {
    const mapRef = useRef(null);
    const [coords, setCoords] = useState(false)

    const clickOnMap = (e) => {
        var coords = e.get('coords');
        setCoords(coords)
    }

    return (
        <>
            <div className="mb-5 mt-10">                
                <YMaps>
                    <Map width={"100%"} height={340} 
                        onClick={clickOnMap}
                        instanceRef={mapRef}
                        defaultState={{ center: [43.58528, 39.72028], zoom: 13 }} 
                    >
                        <Placemark defaultOptions={{draggable: true, visible:false}} geometry={coords}></Placemark>
                    </Map>
                </YMaps>
            </div>
        </>
    );
}