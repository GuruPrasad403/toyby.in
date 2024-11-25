import xlsx from 'xlsx';

export const downloadCSV = async (ModelNameOrMock, res, searchFilter = {}) => {
  try {
    let data;

    // Check if the input is a mock model (object with a `find` method) or a Mongoose model
    if (typeof ModelNameOrMock.find === 'function') {
      // Fetch data using the `find` method, either with a search filter or without
      data = await ModelNameOrMock.find(searchFilter);
    } else {
      throw new Error('Provided ModelNameOrMock is not valid. It must have a "find" method.');
    }

    // If no data is found, send an appropriate response
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No data available to download.' });
    }

    // Format data for CSV export
    const formattedData = data.map(item => {
      let formattedItem = {};
      Object.keys(item.toObject ? item.toObject() : item).forEach(key => {
        if (Array.isArray(item[key])) {
          // If value is an array, join into a string
          formattedItem[key] = item[key].join(', ');
        } else {
          formattedItem[key] = item[key];
        }
      });
      return formattedItem;
    });

    // Convert the formatted data to JSON
    const jsonData = JSON.parse(JSON.stringify(formattedData));

    // Create an Excel sheet and convert it to CSV
    const ws = xlsx.utils.json_to_sheet(jsonData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    const csvData = xlsx.utils.sheet_to_csv(ws);

    // Set headers for CSV download
    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.setHeader('Content-Type', 'text/csv');

    // Send the CSV data
    res.send(csvData);
  } catch (err) {
    console.error('Error generating CSV file:', err);
    res.status(500).json({ message: 'Error generating CSV file.', error: err.message });
  }
};
