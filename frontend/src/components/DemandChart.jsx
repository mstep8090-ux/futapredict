import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const DemandChart = ({ forecastData, startMonth }) => {
  // Generate labels for the 6-month period
  const getMonthLabels = (start) => {
    const labels = [];
    for (let i = 0; i < 6; i++) {
      const m = (start + i - 1) % 12 + 1;
      const date = new Date(2026, m - 1);
      labels.push(date.toLocaleString('default', { month: 'short' }));
    }
    return labels;
  };

  const labels = getMonthLabels(startMonth);

  const data = {
    labels,
    datasets: [
      {
        label: 'Predicted Demand',
        data: forecastData,
        fill: true,
        borderColor: '#1e293b', // Deep Slate Blue brand color
        backgroundColor: 'rgba(30, 41, 59, 0.04)', // Light opacity brand fill
        borderWidth: 2,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#1e293b',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        tension: 0.4, // Smooth bezier curves
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since there's only one dataset
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical gridlines
        },
        ticks: {
          font: { family: 'Inter', size: 11, weight: '500' },
          color: '#64748b',
        },
        border: {
          display: false,
        }
      },
      y: {
        grid: {
          display: false, // Hide horizontal gridlines
        },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#64748b',
          precision: 0,
        },
        border: {
          display: false,
        }
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[220px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default DemandChart;
