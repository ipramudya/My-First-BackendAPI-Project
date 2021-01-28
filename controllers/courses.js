const Course = require('../models/Course');
const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//#desc         Memperoleh seluruh data courses
//#route        GET /api/v1/courses
//#route        GET /api/v1/bootcamps/:bootcampId/courses
//#access       Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const getCourses = Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: getCourses.length,
      data: getCourses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//#desc         Memperoleh single data course
//#route        GET /api/v1/courses/:id
//#access       Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const getCourse = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!getCourse) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: getCourse,
  });
});

//#desc         Menambahkan Course
//#route        POST /api/v1/bootcamps/:bootcampId/courses
//#access       Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const addCourse = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: addCourse,
  });
});

//#desc         Memperbarui Course
//#route        PUT /api/v1/courses/:id
//#access       Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let updateCourse = await Course.findById(req.params.id);

  if (!updateCourse) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  updateCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updateCourse,
  });
});

//#desc         Menghapus Course
//#route        DELETE /api/v1/courses/:id
//#access       Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const updateCourse = await Course.findById(req.params.id);

  if (!updateCourse) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }

  await updateCourse.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
