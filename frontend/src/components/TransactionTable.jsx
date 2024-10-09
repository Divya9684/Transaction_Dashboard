import PropTypes from 'prop-types';

const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div>No transactions available.</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Category</th>
          <th>Sold</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.id}</td>
            <td>{transaction.title}</td>
            <td>{transaction.description}</td>
            <td>${transaction.price.toFixed(2)}</td>
            <td>{transaction.category}</td>
            <td>{transaction.sold ? 'Yes' : 'No'}</td>
            <td>
              <img src={transaction.image} alt={transaction.title} width="50" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number.isRequired,
      category: PropTypes.string,
      sold: PropTypes.bool.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionTable;
