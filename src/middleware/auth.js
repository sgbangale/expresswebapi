var jwt = require('jsonwebtoken'),
  role = require('../models/role');

module.exports =
  function auth() {

    return function (req, res, next) {
      var token = req.body.token || req.query.token || req.headers['token'];
      var request_type = req.query.request_type;
      if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          console.log(err);
          if (err) {        
            return res.json({
              success: false,
              message: 'Failed to authenticate token.'
            });
          } else {
        
            role.findOne({
              roleCode: decoded.Role
            }, function (e, role) {
              if (e) {
                return res.status(403).send({
                  success: false,
                  message: 'Authorization is failed. role dont have '
                });
              }
              if(role.roleAccess.indexOf(request_type) != -1 || role.roleAccess.indexOf('ALL') != -1)
              {
                req.decoded = decoded;
                next();
              }
              else {
                return res.status(403).send({
                  success: false,
                  message: 'Authorization is failed. User role dont have sufficient rights.'
                });
              }
            });
          }


        });

      } else {

        // if there is no token
        // return an error
        return res.status(403).send({
          success: false,
          message: 'No token provided.'
        });

      }
    }
  }