const { User } = require('../../models');
const bcrypt = require('bcryptjs');

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
    res.render('admin/index');
};

exports.login = async (req, res) => {
    res.render('admin/login');
};

/*
===================
        Backend 
===================
*/
exports.loginSubmit = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username, role: 1 },
            attributes: ['id', 'name', 'amount', 'image', 'createdAt', 'updatedAt', 'password'] // Include 'password'
        });

        if (user && user.dataValues.password === password) {
            req.session.user = {
                id: user.id,
                username: user.name,
                role: 1
            };
            return res.redirect('/admin');
        } else {
            return res.render('admin/login', { error: 'Invalid username, password, or role.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.render('admin/login', { error: 'An error occurred during login.' });
    }
};


