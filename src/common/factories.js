var role = require('../models/role'),
    user = require('../models/user'),
    entity = require('../models/entity'),
    request = require('../models/requestPipeline'),
    mongoose = require('mongoose');
module.exports = {

    data__view: function (condition) {
        var entity = mongoose.model("data");
        var viewPromise = new Promise(
            function (resolve, reject) {
                entity.where(condition.filters).sort([
                    ["'" + condition.sortField + "'", condition.sortOrder]
                ]).count().exec().then((countData) => {
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

    entity__add: function (item) {

        // mongoose.model(res.entity_code, mongoose.Schema(res.entity_schema));
        var viewPromise = new Promise(
            function (resolve, reject) {
                entity.create({
                    entity_code: item.entity_code,
                    entity_name: item.entity_name,
                    entity_access: item.entity_access,
                    entity_active: item.entity_active,
                    entity_schema: item.entity_schema
                }, function (err, entityData) {
                    if (err) {
                        reject(err);
                    } else {
                        entitySchema = {};
                        Object.keys(entityData.entity_schema).forEach(function (field) {
                            var fieldDef = entityData.entity_schema[field];
                            console.log(fieldDef);
                            switch(fieldDef['type'])
                            {
                                case 'String':
                                
                                fieldDef['type'] = String;
                                break;
                            }
                            entitySchema[field] = fieldDef;
                           
                        });
                        console.log(entitySchema);
                        resolve(entityData);
                    }

                });


            });
        return viewPromise;
    },
    entity__view: function (condition) {

        var entity = mongoose.model('Entity');
        var viewPromise = new Promise(
            function (resolve, reject) {
                if (condition)
                    entity.where(condition.filters).sort([
                        ["'" + condition.sortField + "'", condition.sortOrder]
                    ]).count().exec().then((countData) => {
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
                else {
                    entity.find({}).exec(
                        function (err, _data) {
                            if (err)
                                reject(reason);
                            else
                                resolve({
                                    data: _data,
                                });
                        }
                    );
                }
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
        var sortConfig = {};
        sortConfig[condition.sortField] = condition.sortOrder;
        var entity = mongoose.model('User');
        var viewPromise = new Promise(
            function (resolve, reject) {
                entity.where(condition.filters).count().exec().then((countData) => {
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
        var sortConfig = {};
        sortConfig[condition.sortField] = condition.sortOrder;
        var viewPromise = new Promise(
            function (resolve, reject) {
                request.where(condition.filters).sort([
                    [condition.sortField, condition.sortOrder]
                ]).count().exec().then((countData) => {
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