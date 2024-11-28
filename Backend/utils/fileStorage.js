import path from 'path';
import multer from 'multer';
import fs from 'fs';
import csv from 'csvtojson';
import { fileURLToPath } from 'url';

// Define __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// for localhost Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/'); // Ensure this directory exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const originalExtension = path.extname(file.originalname); // Get the original extension
//     cb(null, file.fieldname + '-' + uniqueSuffix + originalExtension); // Append extension
//   },
// });


//for vercel deployment 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/'); // Use Vercel's writable temporary directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + originalExtension);
  },
});
export const upload = multer({ storage: storage });

// Function to validate CSV headers
export const validateCSVHeaders = async (filePath, requiredFields) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const rawHeaders = fileContent.split('\n')[0].split(',');

  // Normalize headers (trim whitespace and remove carriage returns)
  const headers = rawHeaders.map((header) => header.trim().toLowerCase().replace(/\r/g, ''));

  // Normalize required fields
  const normalizedRequiredFields = requiredFields.map((field) => field.trim().toLowerCase());

  // Check for missing and extra fields
  const missingFields = normalizedRequiredFields.filter((field) => !headers.includes(field));
  const extraFields = headers.filter((header) => !normalizedRequiredFields.includes(header));

  return { missingFields, extraFields };
};

// Function to convert CSV to JSON
export const convertToJson = async (filePath) => {
  const jsonArray = await csv().fromFile(filePath);
  return jsonArray;
};

// Utility to preprocess CSV data and normalize fields
export const preprocessData = (data) => {
    return data.map((record) => {
      // Convert "TRUE"/"FALSE" strings to Booleans for the isActive field
      if (record.isActive && typeof record.isActive === 'string') {
        record.isActive = record.isActive.toLowerCase() === 'true';
      }
  
      // Add other field normalization or conversions as required
      // Example: Convert price to a number
      if (record.price && typeof record.price === 'string') {
        record.price = parseFloat(record.price);
      }
  
      if (record.stock && typeof record.stock === 'string') {
        record.stock = parseInt(record.stock, 10);
      }
  
      return record;
    });
  };
  
