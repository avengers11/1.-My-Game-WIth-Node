const { gready_manage } = require('../../models');
const { refreshGreadyManage } = require('../../service/global');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const greadyIo = io.of('gready');

/*
===================
        View
===================
*/
exports.index = async (req, res) => {
    const { dataValues: { game_mod, game_status, next_win, change_low, change_mid, change_high, win5x, win10x, win15x, win25x, win45x } } = await gready_manage.findByPk(1);
    res.render('admin/gready/index', {game_mod, game_status, next_win, change_low, change_mid, change_high, win5x, win10x, win15x, win25x, win45x });
};

/*
===================
        Backend 
===================
*/
exports.manageData = async (req, res) => {
    try {
        const { game_mod, game_status, next_win, change_low, change_mid, change_high, win5x, win10x, win15x, win25x, win45x } = req.body;

        // Find the record to update
        const Manage = await gready_manage.findByPk(1);
        if (!Manage) {
            return res.status(404).send('Record not found');
        }

        // Update fields
        Manage.game_mod = game_mod === "on" ? 1 : 0;
        Manage.game_status = game_status === "on" ? 1 : 0;
        Manage.next_win = next_win ? parseInt(next_win, 10) : Manage.next_win;

        Manage.change_low = change_low ? parseInt(change_low, 10) : Manage.change_low;
        Manage.change_mid = change_mid ? parseInt(change_mid, 10) : Manage.change_mid;
        Manage.change_high = change_high ? parseInt(change_high, 10) : Manage.change_high;

        Manage.win5x = win5x ? parseInt(win5x, 10) : Manage.win5x;
        Manage.win10x = win10x ? parseInt(win10x, 10) : Manage.win10x;
        Manage.win15x = win15x ? parseInt(win15x, 10) : Manage.win15x;
        Manage.win25x = win25x ? parseInt(win25x, 10) : Manage.win25x;
        Manage.win45x = win45x ? parseInt(win45x, 10) : Manage.win45x;

        // Save the updated record
        await Manage.save();

        refreshGreadyManage();

        // Redirect after successful update
        return res.redirect('/admin/game-gready');
    } catch (error) {
        console.error('Error during update:', error);
        return res.status(500).send('An error occurred');
    }
};
