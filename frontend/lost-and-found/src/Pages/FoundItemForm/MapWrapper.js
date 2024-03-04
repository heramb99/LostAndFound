import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import { Icon } from 'leaflet';
import { Button, Card } from "react-bootstrap";
import { PinFill, XCircle } from 'react-bootstrap-icons';




// Cordinates of Halifax
const center =  [44.653707240893, -63.59127044677735];


const customIcon = new Icon({
    iconUrl: require("./../../Assets/Images/location-pin.png"),
    iconSize: [38, 38]
}
)



function LeafletgeoSearch(props) {
    // const [locations, setLocations] = useState([]);
    const locations = props.locations
    const setLocations = props.setLocationsFun

    const addLocation = (newLocation) => {
        console.log("add point", newLocation)
        console.log("printing locs before", locations);
        setLocations([newLocation]);
        console.log("printing locs after", locations);
    };

    const map = useMap();
    useEffect(() => {
        if (locations.length === 1) {
            // If there's only one marker, set the map center to that marker's coordinates
            map.setView([locations[0].lat, locations[0].lng], map.getZoom());
        } else {
            // If no markers or more than one marker, use Halifax's center
            map.setView(center, map.getZoom());
        }
    }, [locations, map]);

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
            {/* <h3>Pinned Locations:</h3>
            <ul>
                {loc.map((location, index) => (
                    <li key={index}>
                        Latitude: {location[0]}, Longitude: {location[1]}
                    </li>
                ))}
            </ul> */}
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



function MapWrapper(props) {

    const locations = props.locations;
    const setLocations = props.setLocationsFun;
    const isEdit = props.isEdit || false


    // const [locations, setLocations] = useState([]);

    const removeElement = (index) => {
        const updatedList = [...locations];
        updatedList.splice(index, 1);
        setLocations(updatedList);
    };

    return (
        <div>
            <div id="mapid" >
                <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{  height: '400px' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LeafletgeoSearch locations={locations} setLocationsFun={setLocations} />
                </MapContainer>
            </div>
            <div style={{ width: '100%',textAlign:'center'}} >
                <h5 style={{textAlign:'center'}}>{isEdit ? 'Updated Location:' : 'Selected Location:'}</h5>
                <ul style={{ textAlign: center }}>
                    {locations[0]?.label && locations.map((location, index) => (
                          <Card className="border shadow p-2">
                          <li key={index}>
                            <PinFill className="mr-2" color="red" />
                            {location.label}
                            <Button
                              className="ml-1"
                              style={{
                                backgroundColor: "white",
                                height: "10xp",
                                width: "10xp",
                                border: "1px solid white",
                              }}
                              onClick={() => removeElement(index)}>
                              <XCircle style={{ color: "black" }} />
                            </Button>
                          </li>
                        </Card>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default MapWrapper;

