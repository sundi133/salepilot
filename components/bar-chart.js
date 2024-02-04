import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ data_series, data_series_2, title }) => {
  const category_names = [
    ...new Set([...Object.keys(data_series), ...Object.keys(data_series_2)])
  ];

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: category_names,
      labels: {
        rotate: -45,
        rotateAlways: true,
        trim: true,
        minHeight: 80
      }
    },
    yaxis: {
      max: 10,
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: function (value) {
          if (!value) {
            return 0;
          }
          return value.toFixed(1);
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark'
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 1
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      },
      margin: 20,
      offsetX: 0,
      offsetY: 0
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%'
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      floating: true,
      offsetY: -10,
      offsetX: -5
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  const series = [
    {
      name: 'Evaluation scores for the candidate',
      data: Object.values(data_series),
      color: '#3078F0' // Blue
    },
    {
      name: 'Evaluation scores normalized across all candidates for the same interview',
      data: Object.values(data_series_2),
      color: '#F04F47' // Red
    }
  ];

  return (
    <Chart
      className="w-full rounded-md"
      options={options}
      series={series}
      type="bar"
      height={450}
      style={{ marginTop: '16px' }}
    />
  );
};

export default BarChart;
