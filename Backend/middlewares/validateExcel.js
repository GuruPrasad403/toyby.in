export const validateExcelFile = (req, res, next) => {
    const { filename } = req.file;
    if (filename.endsWith('.csv')) {
      return next();
    } else {
      return res.status(400).json({
        msg: 'This file format is not supported',
      });
    }
  };