const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utilities/geocoder');

//#desc         Memperoleh seluruh data bootcamps
//#route        GET /api/v1/bootcamps
//#access       Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  const deleteBootcamp = await Bootcamp.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: `Data of ID ${req.params.id} has been Deleted !`,
  });

  if (!deleteBootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  deleteBootcamp.remove();
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

//#desc         Upload Foto untuk Bootcamp
//#route        PUT /api/v1/bootcamps/:id/photo
//#access       Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const uploadBootcampPhoto = await Bootcamp.findById(req.params.id);

  if (!uploadBootcampPhoto) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  const file = req.files.file;

  // Cek jika telah memasukan file
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  // Cek jika ekstensi file adalah image
  else if (
    !file.mimetype === 'image/jpeg' ||
    !file.mimetype.startsWith('image')
  ) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // Cek size dari file
  else if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `File too big, please upload file less then ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Membuat "custom-file-name" agar tidak terjadi duplikasi nama file
  file.name = `photo_${uploadBootcampPhoto._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse(
          `Error Uploading Photo ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
