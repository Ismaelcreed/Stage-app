import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import '../assets/css/Stat.css';
import CountUp from 'react-countup';
import { useQuery, gql } from '@apollo/client';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Requêtes GraphQL
const GET_STATS = gql`
  query GetStats {
    getStats {
      totalAgents
      totalConducteurs
      totalVehicules
      totalViolations
      excessSpeed
      illegalParking
      signalViolation
      drivingUnderInfluence
      specificInfractions
      vehicleRelatedInfractions
    }
  }
`;

const GET_MONTHLY_INFRACTIONS = gql`
  query GetMonthlyInfractions {
    getMonthlyInfractions {
      month
      year
      total
    }
  }
`;

const Statistiques = () => {
  const { t } = useTranslation();
  
  // Utilisation des hooks useQuery pour les statistiques et les infractions mensuelles
  const { loading: statsLoading, error: statsError, data: statsData } = useQuery(GET_STATS);
  const { loading: monthlyInfractionsLoading, error: monthlyInfractionsError, data: monthlyInfractionsData } = useQuery(GET_MONTHLY_INFRACTIONS);
  
  const [doughnutData, setDoughnutData] = useState({
    labels: [ t('statistiques.agents'),  t('statistiques.conducteurs'),  t('statistiques.vehicules'),  t('statistiques.infratcions')],
    datasets: [{
      label: t('statistiques.doughnutChartLabel'),
      data: [0, 0, 0, 0],
      backgroundColor: ['#3a9188', '#0f534c', '#d6e0df', '#24e6d5'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 0,
    }],
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{
      label: t('statistiques.lineChartLabel'),
      data: [],
      fill: false,
      borderColor: '#3a9188',
      tension: 0.1,
    }],
  });

  useEffect(() => {
    if (statsLoading || monthlyInfractionsLoading) {
      Loading.arrows("Veuillez patientez . . ."); 
    } else if (statsData && monthlyInfractionsData) {
      const { totalAgents, totalConducteurs, totalVehicules, totalViolations, excessSpeed, illegalParking, signalViolation, drivingUnderInfluence, specificInfractions, vehicleRelatedInfractions } = statsData.getStats;
      setDoughnutData({
        ...doughnutData,
        datasets: [{
          ...doughnutData.datasets[0],
          data: [totalAgents, totalConducteurs, totalVehicules, totalViolations],
        }],
      });

      const monthlyInfractions = monthlyInfractionsData.getMonthlyInfractions;
      const monthlyData = Array(12).fill(0); // Initialiser avec 0 pour chaque mois
      const monthLabels = [
        t('statistiques.janvier'), t('statistiques.fevrier'), t('statistiques.mars'),
        t('statistiques.avril'), t('statistiques.mai'), t('statistiques.juin'),
        t('statistiques.juillet'), t('statistiques.aout'), t('statistiques.septembre'),
        t('statistiques.octobre'), t('statistiques.novembre'), t('statistiques.decembre')
      ];
      
      monthlyInfractions.forEach(info => {
        const monthIndex = new Date(`${info.year}-${info.month}-01`).getMonth(); // Convertir le mois et l'année en index de mois
        monthlyData[monthIndex] += info.total; // Additionner les valeurs des différents mois
      });

      setLineData({
        labels: monthLabels,
        datasets: [{
          label: t('statistiques.lineChartLabel'),
          data: monthlyData,
          fill: false,
          borderColor: '#3a9188',
          tension: 0.1,
        }],
      });

      Loading.remove(); // Remove loading spinner
    } else if (statsError || monthlyInfractionsError) {
      Report.failure('Erreur', 'Une erreur s\'est produite lors du chargement des statistiques.', 'OK');
      Loading.remove(); // Remove loading spinner
    }
  }, [statsLoading, monthlyInfractionsLoading, statsData, monthlyInfractionsData, statsError, monthlyInfractionsError, t]);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
        },
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
    scales: {
      y: {
        min: 0,
        max: Math.max(...lineData.datasets[0].data) * 1.1 
      }
    }
  };

  if (statsLoading || monthlyInfractionsLoading) {
    return null;
  }
  
  if (statsError || monthlyInfractionsError) {
    return null; // or handle the error as needed
  }

  const { excessSpeed, illegalParking, signalViolation, drivingUnderInfluence, specificInfractions, vehicleRelatedInfractions } = statsData.getStats || {};

  return (
    <div className="statistiques-container">
      <div className="doughnut-container">
        <Doughnut data={doughnutData} className="doughnut-chart" />
        <div className="doughnut-description">
          <h2>{t('statistiques.doughnutChartLabel')}</h2>
          <p>{t('statistiques.doughnutChartDescription')}</p>
          <p>{t('statistiques.doughnutChartInterpretation')}</p>
          <p>{t('statistiques.doughnutChartUsage')}</p>
        </div>
      </div>
      <div className="graphs-and-cards">
        <div className="minicards-container">
          <div className="minicards-row">
            <div className="minicard">
              <h3>{t('statistiques.excèsDeVitesse')}</h3>
              <p>
                <CountUp start={0} end={excessSpeed || 0} duration={4} />
              </p>
            </div>
            <div className="minicard">
              <h3>{t('statistiques.stationnementIllegal')}</h3>
              <p>
                <CountUp start={0} end={illegalParking || 0} duration={4} />
              </p>
            </div>
            <div className="minicard">
              <h3>{t('statistiques.nonRespectDesSignaux')}</h3>
              <p>
                <CountUp start={0} end={signalViolation || 0} duration={4} />
              </p>
            </div>
          </div>
          <div className="minicards-row">
            <div className="minicard">
              <h3>{t('statistiques.conduiteSousInfluence')}</h3>
              <p>
                <CountUp start={0} end={drivingUnderInfluence || 0} duration={4} />
              </p>
            </div>
            <div className="minicard">
              <h3>{t('statistiques.infractionsSpecifiques')}</h3>
              <p>
                <CountUp start={0} end={specificInfractions || 0} duration={4} />
              </p>
            </div>
            <div className="minicard">
              <h3>{t('statistiques.infractionsLieesAuVehicule')}</h3>
              <p>
                <CountUp start={0} end={vehicleRelatedInfractions || 0} duration={4} />
              </p>
            </div>
          </div>
        </div>
        <div className="line-chart">
          <Line data={lineData} options={lineOptions} className="line-chart"/>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;
