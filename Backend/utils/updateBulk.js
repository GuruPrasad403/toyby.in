import csv from 'csvtojson';

export const updateFromCSV = async (csvFilePath, Model) => {
  try {
    // Parse the CSV file into JSON
    const data = await csv().fromFile(csvFilePath);

    // Create bulk operations for MongoDB
    const bulkOperations = data.map((record) => {
      if (!record._id) {
        console.log(`Skipping record without _id: ${JSON.stringify(record)}`);
        return null;
      }
      return {
        updateOne: {
          filter: { _id: record._id }, // Match the MongoDB _id
          update: { $set: { ...record } }, // Update the fields with the record data
        },
      };
    }).filter(Boolean); // Remove null operations for records without _id

    if (bulkOperations.length === 0) {
      console.log("No valid records to update");
      return;
    }

    // Execute the bulk operation
    const result = await Model.bulkWrite(bulkOperations);

    console.log('Bulk update result:', result);
  } catch (error) {
    console.error('Error updating records from CSV:', error);
  }
};


  // Utility to preprocess CSV data (e.g., handle booleans, parse prices)
  export const preprocessData = (data) => {
    return data.map((record) => {
      // If needed, preprocess your data based on requirements
      if (record.isActive && typeof record.isActive === 'string') {
        record.isActive = record.isActive.toLowerCase() === 'true';
      }
  
      // Convert price to a number
      if (record.price && typeof record.price === 'string') {
        record.price = parseFloat(record.price);
      }
  
      // Convert order status to proper enum if necessary
      if (record.orderStatus) {
        record.orderStatus = record.orderStatus.charAt(0).toUpperCase() + record.orderStatus.slice(1).toLowerCase(); // Format the status properly
      }
  
      return record;
    });
  };
  
