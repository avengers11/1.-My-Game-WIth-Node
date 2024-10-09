const { gready_manage } = require('../models');

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
    // GreadyManage
    GreadyManage: async function() {
        await initializeGreadyManage();
        return GreadyManage;
    },
    refreshGreadyManage,
};
