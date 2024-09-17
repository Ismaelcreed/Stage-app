import React, { useRef } from 'react';
import QRCode from 'qrcode.react';

const QRCodeWithDownload = ({ 
  id_violations, 
  driver_id, 
  vehicle_id, 
  officer_id, 
  violation_type, 
  desc, 
  fineAmount, 
  date, 
  localisation 
}) => {
  const qrRef = useRef();

  // Créez la chaîne d'information pour le QR code
  const infoString = `
    Numéro de l'infraction: ${id_violations}
    Conducteur: ${driver_id}
    Véhicule: ${vehicle_id}
    Agent: ${officer_id}
    Type de Violation: ${violation_type || 'Inconnu'}
    Description: ${desc || 'Aucune description disponible'}
    Montant de l'Amende: ${fineAmount || 'Non défini'}
    Date: ${date}
    Localisation: ${localisation}
  `;

  // Fonction pour télécharger le QR code en tant qu'image PNG
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream'); // Pour le téléchargement en PNG
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'infraction-details.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <div ref={qrRef}>
        <QRCode value={infoString} />
      </div>
      <a 
  style={{
    display: 'inline-block',
    padding: '10px 25px',
    backgroundColor: '#3f51b5',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    margin: 'auto', // Assurez-vous que le bouton a une largeur fixe pour que margin: auto fonctionne
    display: 'block',
    textAlign: 'center',
    width : "250px",
    marginTop : "10px"
  }}
  onClick={downloadQRCode}
>
  Télécharger ce QR Code
</a>
    </div>
  );
};

export default QRCodeWithDownload;
