var role = require('../models/role');

module.exports = {


    role_add : function(item)
    {
        return role.create({
            roleCode: item.roleCode,
            roleName: item.roleName,
            roleAccess: item.roleAccess,
            roleActive: item.roleActive
        });
    }

}