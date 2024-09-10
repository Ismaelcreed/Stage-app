import React from 'react';
import { useTranslation } from 'react-i18next'; // Importez le hook useTranslation
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import '../assets/css/Stat.css';
import CountUp from 'react-countup';

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

const Statistiques = () => {
  const { t } = useTranslation(); // Utilisez le hook useTranslation pour traductions

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: t('statistiques.doughnutChartLabel'),
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Line Chart Data
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: t('statistiques.lineChartLabel'),
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: '#ac009d',
      tension: 0.1,
    }],
  };

  // Line Chart Options
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
            max: 100
        }
    }
  };

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
            {[1, 2, 3].map(i => (
              <div key={i} className="minicard">
                <h3>{t('statistiques.cardLabel')} {i}</h3>
                <p>
                  <CountUp start={0} end={i * 10} duration={4} />
                </p>
              </div>
            ))}
          </div>
          <div className="minicards-row">
            {[4, 5, 6].map(i => (
              <div key={i} className="minicard">
                <h3>{t('statistiques.cardLabel')} {i}</h3>
                <p>
                  <CountUp start={0} end={i * 10} duration={4} />
                </p>
              </div>
            ))}
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
