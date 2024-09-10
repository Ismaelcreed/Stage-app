// src/Composants/Listes.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import img1 from "../assets/images/driving.png";
import img2 from "../assets/images/fast.png";
import img3 from "../assets/images/illegal-transport.png";
import img4 from "../assets/images/pollution.png";
import img5 from "../assets/images/road-sign.png";
import img6 from "../assets/images/stationnement.png";

// Composant Listes pour exporter les données traduites
export const useInfractionData = () => {
  const { t } = useTranslation(); // Appel correct du hook useTranslation

  return [
    {
      title: t('infraction.speeding.title'),
      description: t('infraction.speeding.description'),
      fineAmount: t('infraction.speeding.fineAmount'),
      imageId: img2
    },
    {
      title: t('infraction.illegalParking.title'),
      description: t('infraction.illegalParking.description'),
      fineAmount: t('infraction.illegalParking.fineAmount'),
      imageId: img6
    },
    {
      title: t('infraction.signalViolation.title'),
      description: t('infraction.signalViolation.description'),
      fineAmount: t('infraction.signalViolation.fineAmount'),
      imageId: img5
    },
    {
      title: t('infraction.drivingUnderInfluence.title'),
      description: t('infraction.drivingUnderInfluence.description'),
      fineAmount: t('infraction.drivingUnderInfluence.fineAmount'),
      imageId: img1
    },
    {
      title: t('infraction.specificInfractions.title'),
      description: t('infraction.specificInfractions.description'),
      fineAmount: t('infraction.specificInfractions.fineAmount'),
      imageId: img3
    },
    {
      title: t('infraction.vehicleRelatedInfractions.title'),
      description: t('infraction.vehicleRelatedInfractions.description'),
      fineAmount: t('infraction.vehicleRelatedInfractions.fineAmount'),
      imageId: img4
    }
  ];
};
