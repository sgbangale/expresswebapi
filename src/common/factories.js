var role = require('../models/role'),
    user = require('../models/user'),
    entity = require('../models/entity'),
    request = require('../models/requestPipeline'),
    mongoose =   require('mongoose');
module.exports = {


    entity__add: function (item) {
        return entity.create({
            entity_code: item.entity_code,
            entity_name: item.entity_name,
            entity_access: item.entity_access,
            entity_active: item.entity_active
        });
    },
    entity__view: function (condition) {
var entity = mongoose.model('Entity');
        var viewPromise = new Promise(
            function (resolve, reject) {
                entity.where(condition.filters).sort([
                    ["'" + condition.sortField + "'", condition.sortOrder]
                ]).count().exec().then((countData ) => {
                    entity.where(condition.filters).sort([
                        ["'" + condition.sortField + "'", condition.sortOrder]
                    ]).skip(condition.first).limit(condition.rows).exec(function (err, user) {
                        if (err)
                            reject(reason); 
                        else
                            resolve({
                                data: user,
                                count: countData
                            });
                    });
                });
            }
        );
        return viewPromise;
    },
    role__add: function (item) {
        return role.create({
            roleCode: item.roleCode,
            roleName: item.roleName,
            roleAccess: item.roleAccess,
            roleActive: item.roleActive
        });
    },
    role__view: function (condition) {
        return role.where(condition).exec();
    },
    user__view: function (condition) {
        var sortConfig ={};
        sortConfig[condition.sortField]=condition.sortOrder;
        var entity = mongoose.model('User');
        var viewPromise = new Promise(
            function (resolve, reject) {
                entity.where(condition.filters).count().exec().then((countData ) => {
                    entity.where(condition.filters).sort(sortConfig).skip(condition.first).limit(condition.rows).select({
                        "emailAddress": 1,
                        "_id": 1,
                        "firstName": 1,
                        "lastName": 1,
                        "role": 1
                    }).exec(function (err, user) {
                        if (err)
                            reject(reason); 
                        else
                            resolve({
                                data: user,
                                count: countData
                            });
                    });
                });
            }
        );
        return viewPromise;
    },
    request__view: function (condition) {
        var sortConfig ={};
        sortConfig[condition.sortField]=condition.sortOrder;
        var viewPromise = new Promise(
            function (resolve, reject) {
                request.where(condition.filters).sort([
                    [condition.sortField , condition.sortOrder]
                ]).count().exec().then((countData ) => {
                    request.where(condition.filters).sort(sortConfig).skip(condition.first).limit(condition.rows).exec(function (err, user) {
                        if (err)
                            reject(reason); 
                        else
                            resolve({
                                data: user,
                                count: countData
                            });
                    });
                });

            }
        );
        return viewPromise;
    },
}