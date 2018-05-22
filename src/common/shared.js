var role = require('../models/role'),
    factory = require('../common/factories'),
    pipeline = require('../models/requestPipeline');

module.exports = {
    pipelineResolver: function (req, res, pipelineObject) {
        var result;

        switch (pipelineObject.request_type) {
            case "role_add":
                {
                    result = factory.role_add(pipelineObject.request_data);
                }
        }


        return result.then(item => {
            pipelineObject.request_completion_date = Date.now();
            pipelineObject.request_status = "COMPLETE";
            pipelineObject.request_output_data = item;
            pipeline.update({_id:pipelineObject._id}, pipelineObject, (er,su) => {
                if(er)
                 return res.status(200).send({
                     success: false,
                     message: 'Fatal error in request  pipeline',
                     error_code :'[error while updating request as complete however inline request is completed.]',
                     operation_data: er
                 });
                 return res.status(200).send({
                     success: true,
                     message: 'Operation is completed successfully.',                    
                     operation_data: pipelineObject
                 });
 
             });


        }).catch(e => {
            pipelineObject.request_completion_date = Date.now();
            pipelineObject.request_status = "FAILED";
            pipelineObject.request_output_data = e;
            pipeline.update({_id:pipelineObject._id}, pipelineObject, (er,su) => {
               if(er)
                return res.status(200).send({
                    success: false,
                    message: 'Fatal error in request  pipeline',
                    error_code :'[error occurred while performing inline request and error occured while updating request status.]',
                    operation_data: pipelineObject
                });
                return res.status(200).send({
                    success: false,
                    message: 'Operation is failed.',                    
                    error_code :'[error ocurred while performing request but request is updated.]',
                    operation_data: pipelineObject
                });

            });
        });

    },
    createRole: function (req, res) {
        console.log(req.body);
        role.create({
            roleCode: req.body.roleCode,
            roleName: req.body.roleName,
            roleAccess: req.body.roleAccess,
            roleActive: req.body.roleActive
        }).then(x => {
            return res.status(200).send({
                success: true,
                message: 'role is created',
                roleMaster: x
            });
        }).catch(e => {
            return res.status(200).send({
                success: false,
                error: e
            });
        });

    },
    prepareMasterData: function (req, res) {
        var data = {};

        role.find().then(x => data.RoleMaster = x).then(y => {
            return res.status(200).send({
                MasterData: data
            });
        });






    },
    initMasterData: function (req, res) {

        var roleMaster = [{
                roleCode: 'admin',
                roleName: 'Administrator',
                roleAccess: ["ALL"],
                roleActive: true
            },
            {
                roleCode: 'candidate',
                roleName: 'Candidate',
                roleAccess: ["USER_ADD", "USER_EDIT"],
                roleActive: true
            }
        ];
        role.collection.insert(roleMaster, function (a, b) {
            if (a) {
                return res.status(400).send({
                    success: false,
                    roleMaster: roleMaster,
                    message: JSON.stringify(a)
                });
            }

            return res.status(200).send({
                success: true,
                roleMaster: roleMaster
            });
        });



    }
}