const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

// Static method untuk menghitung rata2 dari biaya courses
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log('Menghitung Rata-rata biaya....');

  const arr = await this.aggregate([
    {
      //mencocokan fields berdasarkan bootcampId
      $match: { bootcamp: bootcampId },
    },
    {
      //hasil dari pencocokan dan perhitungan
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    //menyimpan data ke BootcampSchema
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(arr[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

// Memanggil getAverageCost setelah save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Memanggil getAverageCost sebelum remove
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
