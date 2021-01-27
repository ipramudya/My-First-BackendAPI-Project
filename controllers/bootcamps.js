const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utilities/geocoder');

//#desc         Memperoleh seluruh data bootcamps
//#route        GET /api/v1/bootcamps
//#access       Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Sorting Query

  // Menghapus nilai tertentu berdasarkan params yang diberikan di dalam req.query
  const removeFields = ['select', 'sort'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Filtering Query

  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(eq|gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  const parseBack = JSON.parse(queryString);
  query = Bootcamp.find(parseBack);

  // Pengkondisian untuk Selecting
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Pengkondisian untuk Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createAt');
  }

  // Eksekusi querry
  const getBootcamps = await query;

  res.status(200).json({
    success: true,
    count: getBootcamps.length,
    data: getBootcamps,
  });
});

//#desc         Memperoleh salah satu data bootcamp
//#route        GET /api/v1/bootcamps/:id
//#access       Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const getBootcampID = await Bootcamp.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: getBootcampID,
  });

  if (!getBootcampID) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
});

//#desc         Membuat data bootcamps baru
//#route        POST /api/v1/bootcamps
//#access       Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const createBootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: createBootcamp,
  });
});

//#desc         Mengupdate data bootcamp
//#route        PUT /api/v1/bootcamps/:id
//#access       Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
});

//#desc         Menghapus data bootcamp tertentu
//#route        DELETE /api/v1/bootcamps/:id
//#access       Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const deleteBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `Data of ID ${req.params.id} has been Deleted !`,
  });

  if (!deleteBootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
});

//#desc         Memperoleh data bootcamp dalam sebuah radius
//#route        GET /api/v1/bootcamps/radius/:zipcode/:distance
//#access       Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Peroleh Latitude dan Longitude
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  // Kalkulasi Radius
  // Radius Bumi = 3,963 mil/ 3,378 km
  const radius = distance / 3963;
  const getInRadius = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: getInRadius.length,
    data: getInRadius,
  });
});
