import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import iconPerson from '../assets/images/iconPerson.gif';
import Maison from '../assets/images/Maison.gif';

const customIcon = new L.Icon({
  iconUrl: iconPerson,
  iconSize: [50, 61],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const maisonIcon = new L.Icon({
  iconUrl: Maison,
  iconSize: [50, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [destination] = useState([-18.933333, 47.516667]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (map && position && destination) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(position[0], position[1]),
          L.latLng(destination[0], destination[1]),
        ],
        lineOptions: {
          styles: [{ color: 'red', opacity: 1, weight: 5 }],
        },
        createMarker: () => null,
      }).addTo(map);

      return () => map.removeControl(routingControl);
    }
  }, [map, position, destination]);

  const calculateDistance = (pointA, pointB) => {
    if (!pointA || !pointB || pointA.length < 2 || pointB.length < 2) {
      return null;
    }

    const rad = (x) => (x * Math.PI) / 180;
    const R = 6378137;
    const dLat = rad(pointB[0] - pointA[0]);
    const dLong = rad(pointB[1] - pointA[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(pointA[0])) *
      Math.cos(rad(pointB[0])) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={position || [-18.933333, 47.516667]}
        zoom={15}
        style={{ height: '35vw', width: '100vh' }}
        whenCreated={(mapInstance) => setMap(mapInstance)}
      >
        <LayersControl>
          <LayersControl.BaseLayer name="OpenStreetMap" checked>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN"
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors'
              id="mapbox/satellite-v9"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {position && (
          <Marker position={position} icon={customIcon}>
            <Popup>
              Vous êtes ici !<br />
              Vous êtes à {calculateDistance(position, destination)} mètres du ministère
            </Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination} icon={maisonIcon}>
            <Popup>
              Ministère de l'intérieur et de la décentralisation
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
