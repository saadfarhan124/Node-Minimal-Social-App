const mongoose = require("mongoose");
const config = require("config");
const db = config.get("connectionString");

const connectToDb = async () => {
  try {
    //init gfs
    const conn = await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("Mongo connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports.connectToDb = connectToDb;
