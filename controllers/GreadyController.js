const { User } = require('../models');

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
        res.render('games/gready/index');
};

/*
===================
        API
===================
*/

exports.gameData = async (req, res) => {
        var gameScene = req.query.gameScene !== undefined && req.query.gameScene !== "undefined" ? req.query.gameScene : 'gready_games';
        var mini = req.query.mini;
        var userId = req.query.userId !== undefined && req.query.userId !== "undefined" ? req.query.userId : 1;
        var token = req.query.token;
        var status = true;

        // users prop 
        var name = "";
        var amount = 0;
        var image = "";

        // users 
        const user = await User.findByPk(userId);
        const userValue = user.dataValues;

        name = userValue.name;
        amount = userValue.amount;
        image = userValue.image;

        res.json({
                receivedData: {
                        gameScene,
                        status,
                        userId,
                        name,
                        amount,
                        image,
                },
        });
};

exports.usersInfo = async (req, res) => {
        var userId = req.query.userId !== undefined && req.query.userId !== "undefined" ? req.query.userId : 1;
        // users 
        const user = await User.findByPk(userId);
        const userValue = user.dataValues;
        amount = userValue.amount;
        res.json(amount);
};
