//#desc         Mengambil seluruh data bootcamps
//#route        GET /api/v1/bootcamps
//#access       Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Showing all Bootcamps' });
};

//#desc         Mengambil salah satu data bootcamp
//#route        GET /api/v1/bootcamps/:id
//#access       Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Showing Single Bootcamp of id ${req.params.id} `,
  });
};

//#desc         Membuat data bootcamps baru
//#route        POST /api/v1/bootcamps
//#access       Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Creating new Bootcamps' });
};

//#desc         Mengupdate data bootcamp
//#route        PUT /api/v1/bootcamps/:id
//#access       Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Update Bootcamp of id ${req.params.id} `,
  });
};

//#desc         Menghapus data bootcamp tertentu
//#route        DELETE /api/v1/bootcamps/:id
//#access       Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Delete Bootcamp of id ${req.params.id}`,
  });
};
