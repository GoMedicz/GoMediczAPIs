const Riders = require("../../models/riders")
const {User} = require('../../models/users');
const bcrypt = require("bcrypt");
const { Auth } = require("../../middlewares/auth");
const { Utils } = require("../middlewares/utils");
const _ = require("lodash");

const utils = new Utils();
const auth = new Auth();