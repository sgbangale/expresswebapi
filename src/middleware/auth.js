var jwt = require('jsonwebtoken');

  module.exports =
  function auth(rolecode,roleaccess) {

    return function (req, res, next) {
      var token = req.body.token || req.query.token || req.headers['token'];
      if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          if (err) {
            console.log(err);
            return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
            if (decoded) { //-1 != decoded.Role.roleaccess.indexOf(roleaccess) ||-1!=rolecode.indexOf(decoded.Role.rolecode) 
              req.decoded = decoded;
              next();
            }
            else {
              return res.status(403).send({

                success: false,
                message: 'Authorization is failed. User dont have sufficient rights.'
              });
            }
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