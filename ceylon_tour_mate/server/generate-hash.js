const bcrypt = require('bcrypt');

const password = 'Admin@123';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hash:', hash);
});