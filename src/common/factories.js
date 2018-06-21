var role = require('../models/role'),
    entity = require('../models/entity'),
    request = require('../models/requestPipeline'),
    mongoose = require('mongoose'),
    fs = require('fs');
var sharedFunctions = {
    entity__generateFile: function (entityData) {
        var schemaData = JSON.stringify(entityData.entity_schema)
            .replace(/"String"/g, 'String')
            .replace(/"Date"/g, 'Date')
            .replace(/"Number"/g, 'Number')
            .replace(/"Boolean"/g, 'Boolean')
            .replace(/"Boolean"/g, 'Boolean')
            .replace(/"Mixed"/g, 'mongoose.Schema.Types.Mixed')
            .replace(/""/g, ' ');
        var data =
            `var mongoose = require('mongoose');
        mongoose.model('` + entityData.entity_code + `', mongoose.Schema(` + schemaData + `));
        module.exports = mongoose.model('` + entityData.entity_code + `');
        `;
        return data;
    },
    entity__generateBAL(entityData) {

    }
};
module.exports = {
    data__view: function (condition, entityName) {
        var entity = require('../business/' + entityName);
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
    entity__add: function (item) {
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

                        var fileContent = sharedFunctions.entity__generateFile(entityData);
                        fs.writeFile("src/business/" + entityData.entity_code + '.js', fileContent, (err) => {
                            if (err) reject(err);
                            else
                            {
                                entityData.entity_access.forEach(function (accessData) {
                                    fs.writeFile("src/business/" + accessData.access_code + '.js', accessData.access_function, (err) => {
                                        if (err) reject(err);
                                    });
                                });
                                resolve(entityData);
                            }
                        });
                    }
                });
            });
        return viewPromise;
    },
    entity__view: function (condition) {
        var entity = require('../models/entity');
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