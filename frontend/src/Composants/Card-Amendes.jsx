import React from 'react';
import { motion } from 'framer-motion';
import '../assets/css/card-amende.scss'; // Assurez-vous que le CSS est correctement importé
import { useInfractionData } from './Listes'; // Importez la fonction qui fournit les données

const Card = ({ title, description, fineAmount, imageId }) => (
  <motion.div
    className="card"
    style={{ backgroundImage: `url(${imageId})` }} // Utilisez l'image locale comme arrière-plan
    whileHover={{ scale: 1.05, boxShadow: "0 16px 32px rgba(0, 0, 0, 0.2)" }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="content">
      <h2 className="title">{title}</h2>
      <p className="copy">{description}</p>
      <p className="fine">Amende: {fineAmount}</p>
    </div>
  </motion.div>
);

const InfractionsPage = () => {
  const infractionData = useInfractionData(); // Obtenez les données traduites

  return (
    <main className="page-content">
      {infractionData.map((infraction, index) => (
        <Card
          key={index}
          title={infraction.title}
          description={infraction.description}
          fineAmount={infraction.fineAmount}
          imageId={infraction.imageId} // Passez l'image locale comme prop
        />
      ))}
    </main>
  );
};

export default InfractionsPage;
