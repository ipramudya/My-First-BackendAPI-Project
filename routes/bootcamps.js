const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Showing all Bootcamps' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Showing Single Bootcamp of id ${req.params.id} `,
  });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Creating new Bootcamps' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Update Bootcamp of id ${req.params.id} `,
  });
});

router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Delete Bootcamp of id ${req.params.id}` });
});

module.exports = router;
