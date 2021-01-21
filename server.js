const express = require('express');
const dotenv = require('dotenv');

//Load env variables
dotenv.config({ path: './config/config.env' });

//Run express method
const app = express();

//Manual Routes
app.get('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({ success: true, message: 'Showing all Data' });
});

app.get('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Showing Single Data of id ${req.params.id} `,
  });
});

app.post('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({ success: true, message: 'Creating new Data' });
});

app.put('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Update Data of id ${req.params.id} ` });
});

app.delete('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Delete Data of id ${req.params.id}` });
});

//Running PORT server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
