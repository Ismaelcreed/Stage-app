// LocationMarker.js
import React from 'react';
import { useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import car from '../../assets/images/car.gif';

const customIcon = new L.Icon({
  iconUrl: car,
  iconSize: [70, 61],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker = ({ position, setPosition, fetchAddressFromCoords, onSelectLocation }) => {
  useMapEvents({
    click: (e) => {
      const latLng = e.latlng;
      setPosition([latLng.lat, latLng.lng]);
      fetchAddressFromCoords([latLng.lat, latLng.lng]);
      if (onSelectLocation) {
        onSelectLocation(`${latLng.lat}, ${latLng.lng}`);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
};

export default LocationMarker;
