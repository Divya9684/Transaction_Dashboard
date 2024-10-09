import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import axios from 'axios';
import PropTypes from 'prop-types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

const CustomPieChart = ({ month = 'March' }) => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transactions/combined?month=${month}`);
        const transactions = response.data.transactions;

        const categoryCount = transactions.reduce((acc, transaction) => {
          const category = transaction.category || 'Uncategorized'; // Default category if none
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const pieData = Object.entries(categoryCount).map(([category, count]) => ({
          name: category,
          value: count,
        }));

        setPieChartData(pieData);
      } catch (error) {
        console.error("Error fetching transactions for pie chart", error);
      }
    };

    fetchTransactions();
  }, [month]);

  return (
    <div className="pie-chart-container text-center">
      <h2 className='heading-container mb-0'>Pie Chart - Category Distribution</h2>
      {pieChartData.length > 0 ? (
        <PieChart width={400} height={400} className="mx-auto" style={{ marginTop: '-120px' }}> {/* Centering the PieChart */}
          <Tooltip />
          <Legend />
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      ) : (
        <p>No data available to display</p>
      )}
    </div>
  );
};

CustomPieChart.propTypes = {
  month: PropTypes.string.isRequired,
};

export default CustomPieChart;
