const { Ludo_Manage } = require('../models');

let ludoManage = null;
async function refreshLudoManage(){
    ludoManage = await Ludo_Manage.findByPk(1);
}
if(ludoManage == null){
    ludoManage = Ludo_Manage.findByPk(1);
}

module.exports = {
    ludoManage,
    refreshLudoManage
};
