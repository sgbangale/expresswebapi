var role = require('../models/role'),
user = require('../models/user'),
request = require('../models/requestPipeline');
module.exports = {


    role__add : function(item)
    {
        return role.create({
            roleCode: item.roleCode,
            roleName: item.roleName,
            roleAccess: item.roleAccess,
            roleActive: item.roleActive
        });
    },
    role__view : function(condition)
    {
        return role.where(condition).exec();
    },
    user__view : function(condition)
    {
        return user.where(condition).select({ "emailAddress": 1, "_id": 1,"firstName":1,"lastName":1,"role":1}).exec();
    },
    request__view : function(condition)
    {
        return request.where(condition).exec();
    },
}