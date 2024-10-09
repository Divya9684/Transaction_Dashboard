import PropTypes from 'prop-types';

const StatisticsDisplay = ({ statistics = { totalSales: 0, totalSoldItems: 0, totalNotSoldItems: 0 } }) => {
  return (
    <div className="mt-3">
      <h2 className="heading-container">Transaction Statistics</h2>
      <div className="text-center" style={{ marginTop: '-50px' }}>
        <div>
          <p><strong>Total Sales:</strong> ${statistics.totalSales.toFixed(2)}</p>
        </div>
        <div>
          <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
        </div>
        <div>
          <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

StatisticsDisplay.propTypes = {
  statistics: PropTypes.shape({
    totalSales: PropTypes.number.isRequired,
    totalSoldItems: PropTypes.number.isRequired,
    totalNotSoldItems: PropTypes.number.isRequired,
  }),
};

export default StatisticsDisplay;
