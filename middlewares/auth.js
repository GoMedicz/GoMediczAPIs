const express = require("express")
const User = require("../models/users")
const jwt = require('jsonwebtoken')
const {Utils} = require('./utils')
// const { Utils } = require("sequelize")

const utils = new Utils()

class Auth {
    constructor() {
        this.blacklist = new Set(); // Set to store invalidated tokens
      }
    generateAuthToken(User){
        const tokenData = {
            email:User.email
        }
        return jwt.sign(tokenData,process.env.ACCESS_TOKEN_SECRET)

    }
    async tokenRequired(req, res, next){

        const authHeader = req.headers['authorization']
        if (!authHeader) {
          return res.status(401).json({
            status: false,
            error: utils.getMessage('TOKEN_ERROR')
          })
        }
        const token = authHeader.split(' ')[1]
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{

                if (typeof user === 'object' && user !== null) {
                    req.user = user;
                  } else {
                    return res.sendStatus(403);
                  }
                next()
            })
        } catch (err) {
            return res.status(500).json({
                status:false,
                error: utils.getMessage('INTERNAL_SERVER_ERROR')
            })
        }

    }
    // Invalidate a token and add it to the blacklist
  invalidateToken(token) {
    this.blacklist.add(token);
  }
  // Check if a token is blacklisted (invalid)
  isTokenInvalid(token) {
    return this.blacklist.has(token);
  }



}

module.exports = {
    Auth
}