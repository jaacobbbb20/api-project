// Delete all or a certain user
    // TO USE: uncomment which await User.destroy line applies to you
const { User } = require('../db/models');

(async () => {
  //await User.destroy({ where: {} }); // remove all users
  // await User.destroy({ where: { id: 4 } }); // remove id=4 only
  console.log('✅ Users deleted');
  process.exit();
})();
