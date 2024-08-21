const { Ludo_Manage} = require('../../models');
const { ludoManage, refreshLudoManage } = require('../../service/global');

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
    const { dataValues: { game_mod, game_status, next_win, dice_1x, dice_2x, dice_3x, change_low, change_high} } = await Ludo_Manage.findByPk(1);
    res.render('admin/ludo/index', {game_mod, game_status, next_win, dice_1x, dice_2x, dice_3x, change_low, change_high});
};

/*
===================
        Backend 
===================
*/
exports.manageData = async (req, res) => {
    try {
        const { game_mod, game_status, next_win, change_low, change_high, dice_1x, dice_2x, dice_3x } = req.body;

        // Find the record to update
        const Manage = await Ludo_Manage.findByPk(1);
        if (!Manage) {
            return res.status(404).send('Record not found');
        }

        // Update fields
        Manage.game_mod = game_mod === "on" ? 1 : 0;
        Manage.game_status = game_status === "on" ? 1 : 0;
        Manage.next_win = next_win ? parseInt(next_win, 10) : Manage.next_win;
        Manage.change_low = change_low ? parseInt(change_low, 10) : Manage.change_low;
        Manage.change_high = change_high ? parseInt(change_high, 10) : Manage.change_high;
        Manage.dice_1x = dice_1x ? parseInt(dice_1x, 10) : Manage.dice_1x;
        Manage.dice_2x = dice_2x ? parseInt(dice_2x, 10) : Manage.dice_2x;
        Manage.dice_3x = dice_3x ? parseInt(dice_3x, 10) : Manage.dice_3x;

        // Save the updated record
        await Manage.save();

        await refreshLudoManage();

        // Redirect after successful update
        return res.redirect('/admin/game-ludo');
    } catch (error) {
        console.error('Error during update:', error);
        return res.status(500).send('An error occurred');
    }
};
