var express = require('express');
var router = express.Router();
var user = require('../models/user');
var jwt = require('jsonwebtoken'),
    auth = require('../middleware/auth');
    
//prepare this by user role
var MenuAccess = (JSON.stringify(

    [{
            view: [
                {
                    field: "request_type",
                    header: "request_type"
                },
                {
                    field: "request_intiator",
                    header: "request_intiator"
                },
                {
                    field: "request_data",
                    header: "request_data"
                },
                {
                    field: "request_status",
                    header: "request_status"
                },
                {
                    field: "request_output_data",
                    header: "request_output_data"
                }
            ],
            actionCode: 'requests',
            actionItems: [{
                    ActionCode: "request__view",
                    ActionName: "Add New User",
                    MultiSelect: true,
                    Icon: 'fa-plus'
                },
                // {ActionCode:"request__add",ActionName:"Add New User" ,MultiSelect:true,Icon:'fa-plus'},
                {
                    ActionCode: "request__edit",
                    ActionName: "Edit User",
                    MultiSelect: false,
                    Icon: 'fa-edit'
                },
                {
                    ActionCode: "request__delete",
                    ActionName: "Remove User",
                    MultiSelect: true,
                    Icon: 'fa-trash'
                },
            ]
        },
        {
            view: [{
                    field: "emailAddress",
                    header: "Email Address"
                },
                {
                    field: "role",
                    header: "Role"
                }, {
                    field: "firstName",
                    header: "First Name"
                }, {
                    field: "lastName",
                    header: "Last Name"
                }
            ],
            actionCode: 'user',
            actionItems: [{
                    ActionCode: "user__add",
                    ActionName: "Add New User",
                    MultiSelect: true,
                    Icon: 'fa-plus'
                },
                {
                    ActionCode: "user__edit",
                    ActionName: "Edit User",
                    MultiSelect: false,
                    Icon: 'fa-edit'
                },
                {
                    ActionCode: "user__delete",
                    ActionName: "Remove User",
                    MultiSelect: true,
                    Icon: 'fa-trash'
                },
            ]
        },
        {
            view: [{
                    field: "entity_code",
                    header: "entity_code"
                },
                {
                    field: "entity_name",
                    header: "entity_name"
                }, {
                    field: "entity_access",
                    header: "entity_access"
                }, {
                    field: "entity_active",
                    header: "entity_active"
                }
            ],
            actionCode: 'entity',
            actionItems: [{
                    ActionCode: "entity__add",
                    ActionName: "Add New Entity",
                    MultiSelect: true,
                    Icon: 'fa-plus'
                },
                {
                    ActionCode: "entity__edit",
                    ActionName: "Edit Entity",
                    MultiSelect: false,
                    Icon: 'fa-edit'
                },
                {
                    ActionCode: "entity__delete",
                    ActionName: "Remove Entity",
                    MultiSelect: true,
                    Icon: 'fa-trash'
                },
            ]
        },
    ]


));
var MenuItemVar = (JSON.stringify(
    [{
            label: 'File',
            icon: 'fa-file-o',
            items: [{
                    label: this.showLogin ? 'Login' : 'Logout',
                    icon: this.showLogin ? 'fa-sign-in' : 'fa-sign-out',
                    routerLink: this.showLogin ? '/login' : '/logout',
                },
                {
                    label: 'Open'
                },
                {
                    separator: true
                },
                {
                    label: 'Quit'
                }
            ]
        },
        {
            label: 'Admin Operations',
            icon: 'fa-edit',
            items: [
                {
                    label: 'Entities',
                    icon: 'fas fa-cogs',
                    routerLink: 'entities'
                },
                {
                    label: 'Requests',
                    icon: 'fas fa-angle-double-right',
                    routerLink: 'requests',
                },

                {

                    label: 'Users',
                    icon: 'fas fa-users',
                    routerLink: 'users'
                }

            ]
        }
    ]
));
router.post('/', function (req, res) {
    user.create({
            emailAddress: req.body.EmailAddress,
            password: req.body.Password,
            firstName: req.body.FirstName,
            lastName: req.body.LastName,
            role: req.body.Role.toLowerCase()
        },
        function (err, user) {
            if (err) return res.status(500).send({
                success: false,
                message: "There was a problem adding the information to the database." + JSON.stringify(err)
            });

            res.status(200).send(user);
        });
});
router.post('/token', function (req, res) {    
    user.findOne({
        emailAddress: req.body.EmailAddress
    }, function (e, user) {
        if (e) {
            return res.status(200).send({
                success: false,
                message: 'invalid email address or password.[error in finding user]'
            });
        } else {
            if (user) {
                //user.comparePassword(Buffer.from(req.body.Password, 'base64').toString('ascii'), function (ismatch) {
                user.comparePassword(req.body.Password, function (ismatch) {
                    if (ismatch) {
                        var issuedTime = Date.now();

                        var token = jwt.sign({
                            User: {
                                EmailAddress: user.emailAddress,
                                FirstName: user.firstName,
                                LastName: user.lastName,
                                Id: user._id
                            },
                            Role: user.role,
                            iat: Math.floor(Date.now() / 1000),
                            exp: Math.floor(((Date.now() / 1000) + Number.parseInt(process.env.TOKEN_TIME_EXPIRE_IN_SECOND)))
                        }, process.env.SECRET);
                        return res.status(200).send({
                            success: true,
                            message: 'Put this token in subsequent request add in header token <token>',
                            token: token,
                            FirstName: user.firstName,
                            LastName: user.lastName,
                            MenuItem: Buffer.from(MenuItemVar).toString('base64'),
                            MenuAccess: Buffer.from(MenuAccess).toString('base64'),
                            iat: Math.floor(Date.now() / 1000),
                            exp: Math.floor(((Date.now() / 1000) + Number.parseInt(process.env.TOKEN_TIME_EXPIRE_IN_SECOND)))
                        });
                    } else {
                        return res.status(200).send({
                            success: false,
                            message: 'invalid email address or password.[password is not match]'
                        });
                    }

                });
            } else {
                return res.status(200).send({
                    success: false,
                    message: 'invalid email address or password.[user is not found]'
                });
            }
        }
    });
});

router.post('/forgetPassword', function (req, res) {
    user.findOne({
        emailAddress: req.body.EmailAddress
    }, function (e, user) {
        if (e) {
            return res.status(200).send('email address is not found in the system.');
        } else {
            user.password = 'password';
            user.save(function (e, user) {
                if (user) {
                    return res.status(200).send('password is changed to default password "password"');
                }



            });

        }
    });
});
router.post('/changePassword', function (req, res) {
    user.findOne({
        emailAddress: req.body.EmailAddress
    }, function (e, user) {
        if (e) {
            return res.status(200).send('email address is not found in the system.');
        } else {
            user.password = req.body.Password;
            user.save(function (e, user) {
                if (user) {
                    return res.status(200).send('password is changed to default password "password"');
                }



            });

        }
    });
});


router.get('/', auth('ADMIN'), function (req, res) {
    user.find({}, function (e, users) {
        if (e) {
            return res.status(200).send('email address is not found in the system.');
        } else {
            if (users) {
                return res.status(200).send(users.map(x => {
                    return {
                        "_id": x._id,
                        "emailAddress": x.emailAddress,
                        "firstName": x.firstName,
                        "lastName": x.lastName,
                        "role": x.role
                    }
                }));
            }
        }
    });
});

module.exports = router;