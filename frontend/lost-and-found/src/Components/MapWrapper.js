import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import { Icon } from 'leaflet';
import { Button } from "react-bootstrap";
import { XLg } from 'react-bootstrap-icons';




// Cordinates of Halifax
const center = [44.653707240893, -63.59127044677735];


const customIcon = new Icon({
    iconUrl: require("../Assets/Images/location-pin.png"),
    iconSize: [38, 38]
}
)



function LeafletgeoSearch(props) {
    // const [locations, setLocations] = useState([]);
    const locations = props.locations
    const setLocations = props.setLocationsFun
    const setLocation = props.setLocationsFun2

    const addLocation = (newLocation) => {
        setLocations([newLocation]);
        setLocation([newLocation]);
    };

    const map = useMap();
    map.on('geosearch/showlocation', function (event) {
        const { location } = event;
        const { label, x, y } = location;
        addLocation({ "lat": y, "lng": x, "label": label })

    });
    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            showMarker: false,
        });


        map.addControl(searchControl);



        return () => map.removeControl(searchControl);
    }, []);

    return (
        <div>
        
            {locations.map((coordinate, index) => (
                <Marker key={index} position={[coordinate.lat, coordinate.lng]} icon={customIcon}>
                    <Popup key={index}>{coordinate.label}</Popup>
                </Marker>
            ))}
            {locations.map((coordinate, index) => (
                <Circle key={index} radius={100} center={[coordinate.lat, coordinate.lng]} icon={customIcon} >
                </Circle>
            ))}
        </div>
    );
}

function MapWrapper({setLocation}) {



    const [locations, setLocations] = useState([]);

    const removeElement = (index) => {
        const updatedList = [...locations];
        updatedList.splice(index, 1);
        setLocations(updatedList);
        setLocation(updatedList);
    };

    return (
        <div>
            <div id="mapid" >
                <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ width: '300px', height: '300px' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LeafletgeoSearch locations={locations} setLocationsFun={setLocations} setLocationsFun2={setLocation}/>
                </MapContainer>
            </div>
            <div style={{ width: '75%'}}>
                <h5>Selected Location:</h5>
                <ul style={{ textAlign: center }}>
                    {locations.map((location, index) => (
                        <li key={index}>
                            Address: {location.label}
                            <Button className="ml-2" style={{ backgroundColor: "white" }} onClick={() => removeElement(index)}>
                                <XLg style={{ color: "black" }} />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default MapWrapper;

