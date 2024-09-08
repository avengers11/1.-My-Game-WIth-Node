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
            attributes: ['id', 'name', 'amount', 'image', 'createdAt', 'updatedAt', 'password']
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
        return res.render('admin/login', { error: 'An error occurred during login.' });
    }
};
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render('admin/login', { error: 'An error occurred during logout.' });
        }
        res.clearCookie('connect.sid');
        return res.redirect('/admin/login');
    });
};


