const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  MONGO_URI: "mongodb+srv://nekoula:Bigsur@cluster0.t9iei.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority",
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT
};