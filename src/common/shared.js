var role = require('../models/role');

module.exports = {
    createRole:function(req,res){
console.log(req.body);
        role.create({
            roleCode : req.body.roleCode,
            roleName : req.body.roleName,
            roleAccess:req.body.roleAccess,
            roleActive : req.body.roleActive
        }).then(x=>{
            return res.status(200).send({
                success: true,
                message:'role is created',
                roleMaster: x
            });
        }).catch(e=>{
            return res.status(200).send({
                success: false,
                error : e
            });
        });

    },
    prepareMasterData: function (req,res) {
        var data ={};
        
        role.find().then(x=> data.RoleMaster=x).then(y=>{
            return res.status(200).send({
                MasterData : data
            });
        }
        );

        




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