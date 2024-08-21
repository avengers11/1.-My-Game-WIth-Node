// controllers/userController.js
const { User, Ludo_Manage} = require('../models');
const { ludoManage } = require('../service/global');
require('dotenv').config();

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
  try {
    const id = req.params.user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.1' });
    }

    const user_id = user.id;
    const name = user.name;
    const img = `/assets/general/users/${user.image}`;
    const amount = user.amount;
    const origin = process.env.FRONTEND_URL;

    res.render('games/ludo/index', { user_id, name, img, amount, ludoManage, origin});
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user.' });
  }
};

/*
===================
      BACKEND
===================
*/
exports.userInfo = async (req, res) => {
  try {
    const id = req.params.user;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user.' });
  }
};