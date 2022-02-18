const mongoAdress = "mongodb://localhost:27017/moviesdb";
const port = 3000;
const allowedCors = [
  "http://gfh.movie.nomoredomains.work",
  "https://gfh.movie.nomoredomains.work",
  "https://localhost:3000",
  "http://localhost:3000",
  "localhost:3000",
];

const jwtData = "randomdata";

module.exports = {
  mongoAdress,
  port,
  allowedCors,
  jwtData,
};
