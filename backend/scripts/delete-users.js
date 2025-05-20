// Delete all or a certain user
    // TO USE: uncomment which await User.destroy line applies to you
    // TO RUN: inside of backend thru the terminal, run 'node scripts/delete-users.js'
const { User } = require('../db/models');

(async () => {
  // await User.destroy({ where: {} }); // remove all users
  // await User.destroy({ where: { id: x } }); // remove a user by specific id
  process.exit();
})();
