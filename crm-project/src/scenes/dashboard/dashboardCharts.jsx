import React, { useEffect, useState } from 'react';
import { GET_DASHBOARD_OBJECT_FIELD } from '../api/endUrls';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import PolarAreaChart from './charts/PolarAreaChart';
import RadarChart from './charts/RadarChart';
import RadialBarChart from './charts/RadialBarChart';
import Typography from '@mui/material/Typography'

const DashboardCharts = ({ dashboard, formValues }) => {
  const [chartType, setChartType] = useState('');
  const [chartData, setChartData] = useState([]);

  const URL_getDashboard = GET_DASHBOARD_OBJECT_FIELD;

  console.log(formValues, "DashboardCharts formValues")
  console.log(dashboard, " DashboardCharts dashboard")

  useEffect(() => {
    if (dashboard) {      
      setChartType(dashboard.chartType);
      fetchRecords(dashboard);
    }
    if (formValues) {
      setChartType(formValues.chartType);
      fetchRecords(formValues);
    }
  }, [dashboard, formValues]);


  const fetchRecords = async (item) => {
    try {
      const response = await RequestServer(apiMethods.get, `${URL_getDashboard}?object=${item.objectName}&field=${item.fields}`);
      if (response.success) {
        console.log(response.data, 'api res dashboard rec');
        if (typeof (response.data === 'object')) {
          setChartData(response.data);
        } else {
          setChartData([]);
        }
      } else {
        setChartData([]);
      }
    } catch (error) {
      setChartData([]);
      console.log(error, 'fetchChartData error');
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        const lineChartData = chartData.map((dataPoint) => ({
          x: Object.values(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <LineChart chartData={lineChartData} />;
      case 'bar':
        const barChartData = chartData.map((dataPoint) => ({
          x: Object.keys(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <BarChart chartData={barChartData} />;
      case 'pie':
        const pieChartData = chartData.map((dataPoint) => ({
          x: Object.values(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <PieChart chartData={pieChartData} />;
      case 'donut':
        const donutChartData = chartData.map((dataPoint) => ({
          x: Object.values(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <DonutChart chartData={donutChartData} />;
      case 'radar':
        const radarChartData = chartData.map((dataPoint) => ({
          x: Object.values(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <RadarChart chartData={radarChartData} />;
      case 'radialBar':
        const radialBarChartData = chartData.map((dataPoint) => ({
          x: Object.values(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <RadialBarChart chartData={radialBarChartData} />;
      case 'polarArea':
        const polarAreaChartData = chartData.map((dataPoint) => ({
          x: Object.values(dataPoint._id).join(' - '),
          y: dataPoint.count,
          label: Object.keys(dataPoint._id).join(', '),
        }));
        return <PolarAreaChart chartData={polarAreaChartData} />;
      default:
        return <Typography textAlign={'center'} variant="h4" color="initial"> No data available for the selected chart type.</Typography>
    }
  };

  return <div className="dashboard-charts">{renderChart()}</div>;

}
export default DashboardCharts;

