const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Menyalin req.query
  const reqQuery = { ...req.query };

  // Sorting Query

  // Nilai yang akan menjadi pengecualian
  const removeFields = ['select', 'sort'];

  // Menghapus nilai tertentu berdasarkan params yang diberikan di dalam req.query
  removeFields.forEach((param) => delete reqQuery[param]);

  // Filtering Query
  let queryString = JSON.stringify(reqQuery);

  // Membuat operator ($gt, $gte, etc)
  queryString = queryString.replace(
    /\b(eq|gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Mengembalikan nilai string ke dalam JSON
  const parseBack = JSON.parse(queryString);
  query = model.find(parseBack);

  // Pengkondisian untuk Selecting
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Pengkondisian untuk Sorting
  else if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  // Populate
  else if (populate) {
    query = query.populate(populate);
  }

  // Nilai default untuk sorting berdasarkan createAt
  else {
    query = query.sort('-createAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  // Eksekusi querry
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    data: results,
  };

  next();
};

module.exports = advancedResults;
