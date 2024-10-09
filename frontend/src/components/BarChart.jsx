import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';
import PropTypes from 'prop-types';

const CustomBarChart = ({ month = 'March' }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transactions/combined?month=${month}`);
        const transactions = response.data.transactions;

        const groupedData = [
          { range: '0-100', count: 0 },
          { range: '101-200', count: 0 },
          { range: '201-300', count: 0 },
          { range: '301-400', count: 0 },
          { range: '401-500', count: 0 },
          { range: '501-600', count: 0 },
          { range: '601-700', count: 0 },
          { range: '701-800', count: 0 },
          { range: '801-900', count: 0 },
          { range: '901-above', count: 0 },
        ];

        transactions.forEach((transaction) => {
          const price = transaction.price;
          if (price >= 0 && price <= 100) groupedData[0].count++;
          else if (price >= 101 && price <= 200) groupedData[1].count++;
          else if (price >= 201 && price <= 300) groupedData[2].count++;
          else if (price >= 301 && price <= 400) groupedData[3].count++;
          else if (price >= 401 && price <= 500) groupedData[4].count++;
          else if (price >= 501 && price <= 600) groupedData[5].count++;
          else if (price >= 601 && price <= 700) groupedData[6].count++;
          else if (price >= 701 && price <= 800) groupedData[7].count++;
          else if (price >= 801 && price <= 900) groupedData[8].count++;
          else groupedData[9].count++;
        });

        setBarChartData(groupedData);
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };

    fetchTransactions();
  }, [month]);

  return (
    
    <div className="bar-chart-container">
      <h2 className='heading-container'>Bar Chart - Price Ranges</h2>
      {barChartData.length > 0 ? (
        <BarChart
          width={600}
          height={300}
          data={barChartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="range" 
            label={{ value: 'Price Ranges', position: 'insideBottomRight', offset: 0 }} 
          />
          <YAxis 
            label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft' }} 
            domain={[0, 'dataMax + 10']} 
          />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      ) : (
        <p>No data available to display</p>
      )}
    </div>
  );
};

CustomBarChart.propTypes = {
  month: PropTypes.string.isRequired,
};

export default CustomBarChart;
