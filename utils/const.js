const mongoAdress = 'mongodb://localhost:27017/bitfilmsdb';
const port = 3000;
const allowedCors = [
  'http://gfh.movie.nomoredomains.work',
  'https://gfh.movie.nomoredomains.work',
  'gfh.movie.nomoredomains.work',
  'https://localhost:3000',
  'http://localhost:3000',
  'localhost:3000',
];

module.exports = { mongoAdress, port, allowedCors };
