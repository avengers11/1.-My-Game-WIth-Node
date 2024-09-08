const { Ludo_Manage, gready_manage } = require('../models');

// Ludo_Manage
let ludoManage = null;
async function refreshLudoManage(){
    ludoManage = await Ludo_Manage.findByPk(1);
}
if(ludoManage == null){
    ludoManage = Ludo_Manage.findByPk(1);
}

// gready_manage
let GreadyManage = null;
async function refreshGreadyManage() {
    const instance = await gready_manage.findByPk(1);
    GreadyManage = instance ? instance.dataValues : null;
}
async function initializeGreadyManage() {
    if (GreadyManage === null) {
        await refreshGreadyManage();
    }
}

module.exports = {
    // Ludo_Manage
    ludoManage,
    refreshLudoManage,

    // GreadyManage
    GreadyManage: async function() {
        await initializeGreadyManage();
        return GreadyManage;
    },
    refreshGreadyManage,
};
