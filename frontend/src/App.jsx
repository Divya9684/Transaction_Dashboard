import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TransactionTable from './components/TransactionTable';
import CustomBarChart from './components/BarChart';
import StatisticsDisplay from './components/StatisticsDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import CustomPieChart from './components/CustomPieChart';

const App = () => {
  const [month, setMonth] = useState('March');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [barChartData, setBarChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const itemsPerPage = 10; // Number of items per page

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/combined`, {
        params: {
          month: month,
          page: currentPage,
          limit: itemsPerPage,
        }
      });
      const { transactions, statistics = {} } = response.data;

      setTransactions(transactions);
      setStatistics({
        totalSales: statistics.totalSales || 0,
        totalSoldItems: statistics.totalSoldItems || 0,
        totalNotSoldItems: statistics.totalNotSoldItems || 0,
      });

      const priceRanges = {
        '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
        '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901-above': 0
      };

      transactions.forEach(transaction => {
        const price = transaction.price;
        if (price >= 0 && price <= 100) priceRanges['0-100']++;
        else if (price > 100 && price <= 200) priceRanges['101-200']++;
        else if (price > 200 && price <= 300) priceRanges['201-300']++;
        else if (price > 300 && price <= 400) priceRanges['301-400']++;
        else if (price > 400 && price <= 500) priceRanges['401-500']++;
        else if (price > 500 && price <= 600) priceRanges['501-600']++;
        else if (price > 600 && price <= 700) priceRanges['601-700']++;
        else if (price > 700 && price <= 800) priceRanges['701-800']++;
        else if (price > 800 && price <= 900) priceRanges['801-900']++;
        else priceRanges['901-above']++;
      });

      const transformedBarChartData = Object.keys(priceRanges).map((range) => ({
        label: range, 
        value: priceRanges[range], 
      }));

      setBarChartData(transformedBarChartData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [month, currentPage]); // Add `currentPage` as a dependency

  useEffect(() => {
    fetchData();
  }, [month, currentPage, fetchData]); // Include currentPage in the useEffect dependency array

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container mt-5">
      {/* Heading Container */}
      <div className="heading-container">
        <h1>Transaction<br/>Dashboard</h1>
      </div>

      {/* Search Bar and Month Selector */}
      <div className="search-bar-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search Transactions"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="form-select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Display Error if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div className="text-center">Loading data...</div>}

      {/* Display Data when available */}
      {!loading && (
        <>
          <div className="table-container">
            <TransactionTable transactions={filteredTransactions} />
          </div>
          <div className="pagination-container d-flex justify-content-between mt-4">
            <button className="btn btn-primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button className="btn btn-primary" onClick={handleNextPage}>
              Next
            </button>
          </div>
          <StatisticsDisplay statistics={statistics} />

          <div className="mt-5">
            <div className="d-flex justify-content-center">
              <div className="col-md-6">
                <CustomBarChart chartData={barChartData} month={month} />
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <div className="col-md-6">
                <div className="text-center"> {/* Add this div for text alignment */}
                  <CustomPieChart month={month} />
                </div>
              </div>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};

export default App;
