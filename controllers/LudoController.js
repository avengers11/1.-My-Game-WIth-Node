// controllers/userController.js
const { User, Ludo_Manage} = require('../models');

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
  try {
    const id = req.params.user
    const user = await User.findByPk(id);
    const manage = await Ludo_Manage.findByPk(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found.1' });
    }

    res.render('games/ludo/index', { user, manage});
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user.' });
  }
};