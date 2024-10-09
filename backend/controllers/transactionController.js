const axios = require('axios');

const getTransactionsFromAPI = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid data format from API'); // Error handling for incorrect format
    }
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
    throw new Error('Failed to fetch data from API'); // Rethrow with a specific error message
  }
};

const getCombinedTransactions = async (req, res) => {
  const { month, page = 1, limit = 10 } = req.query; // Add pagination query params (default: page=1, limit=10)

  // Validate month parameter
  const validMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!month || !validMonths.includes(month)) {
    return res.status(400).json({ message: 'Valid month query parameter is required' }); // Handle invalid month
  }

  try {
    const transactions = await getTransactionsFromAPI();

    // Filter transactions based on the month
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.dateOfSale);
      return date.toLocaleString('default', { month: 'long' }) === month; // Filter based on month name
    });

    if (filteredTransactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the specified month' }); // Handle no transactions found
    }

    // Pagination logic
    const pageNum = parseInt(page);  // Parse page and limit as integers
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum; // Calculate offset for skipping records

    // Ensure there are enough items to move to the next page
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limitNum);
    const hasNextPage = filteredTransactions.length > offset + limitNum; // Check if there's a next page

    // If there are no more items for the next page, stay on the current page
    if (paginatedTransactions.length === 0 && pageNum > 1) {
      return res.status(400).json({ message: 'No more items to load' });
    }

    // Calculate statistics
    const totalSales = filteredTransactions.reduce((acc, transaction) => acc + transaction.price, 0);
    const totalSoldItems = filteredTransactions.filter(transaction => transaction.sold === true).length; // Count of sold items
    const totalNotSoldItems = filteredTransactions.filter(transaction => transaction.sold === false).length; // Count of unsold items

    // Prepare data for the bar chart based on price ranges
    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0,
    };

    filteredTransactions.forEach(transaction => {
      const price = transaction.price;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    // Prepare data for the bar chart
    const barChartData = Object.keys(priceRanges).map(range => ({
      range, // Price range label
      count: priceRanges[range], // Count for that price range
    }));

    // Respond with transactions, statistics, pagination, and chart data
    res.json({
      transactions: paginatedTransactions, // Return only paginated transactions
      statistics: { totalSales, totalSoldItems, totalNotSoldItems },
      barChartData, // Data for the bar chart
      totalTransactions: filteredTransactions.length, // Total transactions for the month
      currentPage: pageNum, // Current page number
      totalPages: Math.ceil(filteredTransactions.length / limitNum), // Total number of pages
      hasNextPage, // Boolean to indicate if next page exists
    });
  } catch (error) {
    console.error('Error in getCombinedTransactions:', error.message);
    res.status(500).json({ message: 'Error fetching combined transactions' });
  }
};

module.exports = {
  getCombinedTransactions,
};
