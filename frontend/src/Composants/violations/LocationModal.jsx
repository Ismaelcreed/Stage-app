import React, { useState, useEffect, useRef } from 'react';
import { Input, Modal } from 'antd';
import { MapContainer, TileLayer } from 'react-leaflet';
import { FaSearch } from 'react-icons/fa';
import LocationMarker from './LocationMaker'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../../assets/css/Violations.css";
import { Report } from 'notiflix/build/notiflix-report-aio';

const LocationModal = ({ visible, onCancel, onSelectLocation, onUpdateAddress }) => {
  const [position, setPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = [latitude, longitude];
          setPosition(newCoords);
          fetchAddressFromCoords(newCoords);

          const map = mapRef.current;
          if (map) {
            map.flyTo(newCoords, 13);
          }
        },
        (error) => {
          Report.info("Erreur lors de la récupération de la localisation:", error);
        }
      );
    } else {
      Report.info("Le navigateur ne supporte pas la géolocalisation!");
    }
  }, []);

  const fetchAddressFromCoords = async (coords) => {
    const [lat, lng] = coords;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await response.json();
    const address = data.display_name || 'Adresse non trouvée';
    setSearchTerm(address);
    if (onUpdateAddress) {
      onUpdateAddress(address);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      Report.info("Le terme de recherche est vide.");
      return;
    }

    const map = mapRef.current;
    if (!map) {
      Report.info("Carte non initialisée.");
      return;
    }

    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(searchTerm, (results) => {
      if (results && results.length > 0) {
        const { center } = results[0];
        setPosition([center.lat, center.lng]);
        fetchAddressFromCoords([center.lat, center.lng]);
        map.flyTo(center, 13);
      } else {
        Report.info("Aucun résultat trouvé pour cette adresse.");
      }
    });
  };

  return (
    <Modal
      title="Rechercher l'emplacement de la violation"
      open={visible}
      onCancel={onCancel}
      footer={null}
      style={{ top: 20 }}
    >
      <Input
        placeholder="Entrez une adresse"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        suffix={
          <FaSearch
            style={{ cursor: 'pointer' }}
            onClick={handleSearch}
          />
        }
      />
      <MapContainer
        style={{ height: '400px', width: '100%', marginTop: '10px' }}
        center={position || [0, 0]}
        zoom={13}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          fetchAddressFromCoords={fetchAddressFromCoords}
          onSelectLocation={onSelectLocation}
        />
      </MapContainer>
    </Modal>
  );
};

export default LocationModal;
