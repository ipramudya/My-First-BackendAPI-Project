const Bootcamp = require('../models/Bootcamp');

//#desc         Mengambil seluruh data bootcamps
//#route        GET /api/v1/bootcamps
//#access       Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const getBootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: getBootcamps.length,
      data: getBootcamps,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//#desc         Mengambil salah satu data bootcamp
//#route        GET /api/v1/bootcamps/:id
//#access       Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const getBootcampID = await Bootcamp.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: getBootcampID,
    });

    if (!getBootcampID) {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//#desc         Membuat data bootcamps baru
//#route        POST /api/v1/bootcamps
//#access       Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const createBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: createBootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//#desc         Mengupdate data bootcamp
//#route        PUT /api/v1/bootcamps/:id
//#access       Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const updateBootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updateBootcamp,
    });

    if (!updateBootcamp) {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//#desc         Menghapus data bootcamp tertentu
//#route        DELETE /api/v1/bootcamps/:id
//#access       Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const deleteBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: `Data of ID ${req.params.id} has been Deleted !`,
    });

    if (!deleteBootcamp) {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
