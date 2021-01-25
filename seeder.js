const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Load DOTENV path
dotenv.config({ path: './config/config.env' });

//Load models
const Bootcamp = require('./models/Bootcamp');

//Connect to mongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

//Import data into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Import data berhasil...');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Delete data berhasil...');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === 'delete') {
  deleteData();
}
