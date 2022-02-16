const Ok200 = 200;
const Ok201 = 201;

const mongoAdress = 'mongodb://localhost:27017/moviesdb';
const port = 3000;
const allowedCors = [
  'http://gfh.movie.nomoredomains.work',
  'https://gfh.movie.nomoredomains.work',
  'https://localhost:3000',
  'http://localhost:3000',
  'localhost:3000',
];

module.exports = {
  Ok200,
  Ok201,
  mongoAdress,
  port,
  allowedCors,
};
