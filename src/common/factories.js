var role = require('../models/role'),
user = require('../models/user'),
entity = require('../models/entity'),
request = require('../models/requestPipeline');
module.exports = {


    entity__add: function(item)
    {
        return entity.create({
            entity_code: item.entity_code,
            entity_name: item.entity_name,
            entity_access: item.entity_access,
            entity_active: item.entity_active
        });
    },
    entity__view : function(condition)
    {
        return entity.where(condition).exec();
    },
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