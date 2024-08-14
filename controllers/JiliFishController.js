// controllers/userController.js
const { User, JiliFish_Manage} = require('../models');

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
  try {
    const id = req.params.user
    const user = await User.findByPk(id);
    const manage = await JiliFish_Manage.findByPk(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.render('games/jili-fish/index', { user, manage});
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user.' });
  }
};

/*
===================
        API
===================
*/
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};