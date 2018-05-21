var role = require('../models/role');

module.exports={
initMasterData: function(req, res) {

    var roleMaster = [{
        roleCode: 'admin',
        roleName: 'Administrator',
        roleAccess: ["ALL"],
        roleActive: true
    },
    {
        roleCode: 'candidate',
        roleName: 'Candidate',
        roleAccess: ["USER_ADD","USER_EDIT"],
        roleActive: true
    }
];
    role.collection.insert(roleMaster,function(a,b){
      if(a){
        return res.status(400).send({
            success: false,
            roleMaster: roleMaster,
            message : JSON.stringify(a)
        });
      }
        
        return res.status(200).send({
            success: true,
            roleMaster: roleMaster
        });
    });

    
   
}
}