/**
 * Created by nitin on 14/1/17.
 */
var bcrypt = require('bcrypt');
var _ = require('underscore');
var jwt = require ('jsonwebtoken');
var crypto = require('crypto-js');
module.exports = function (sequelize,DataTypes){
    var user = sequelize.define('user',{
        email : {
            type: DataTypes.STRING,
            allowNull : false,
            unique : true,
            validate: {
                isEmail : true
            }
        },
        salt : {
            type : DataTypes.STRING
        },
        hashed_Password : {
          type : DataTypes.STRING
        },
        password : {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 15]
            }
            ,
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                // console.log('salt : ' + salt);
                var hashedPassword = bcrypt.hashSync(value, salt);
                //console.log('hashedPassword : ' + hashedPassword);
                //console.log('value : ' + value);
                this.setDataValue('hashed_Password', hashedPassword);
                this.setDataValue('salt', salt);
                this.setDataValue('password', value);
            }
        }
    },{
        hooks :{
            beforeValidate: function (user,options){
                if(typeof user.email === 'string'){
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods : {
            authenticate: function (body) {
              return new Promise (function (resolve,reject){
                  if(typeof body.email !== 'string' || typeof body.password !== 'string'){
                      return reject();
                  }
                  user.findOne({
                      where : {
                          email : body.email
                      }
                  }).then(function (user){
                      if(!user || !bcrypt.compareSync(body.password , user.get('hashed_Password'))){
                          return reject();
                      }
                      resolve(user);
                  },function(e){
                      reject();
                  })
              });

          },
            findByToken : function (token) {
                return new Promise(function (resolve,reject){
                    try {
                        var decodedJwt = jwt.verify(token, '@masterToken');
                        var bytes = crypto.AES.decrypt(decodedJwt.token, '@masterKey');
                        var tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));
                        user.findById(tokenData.id).then(function (user){
                            if(user){
                                resolve(user);
                            }
                            else reject();
                        },function (e){
                            reject();
                        } );
                    }catch (e){
                        reject();
                    }
                });
            }
        },
        instanceMethods: {
            toPublicJSON : function (){
                var json = this.toJSON();
                return _.pick(json,'id','email','updatedAt','createdAt');
            },
            generateToken : function (type) {
               if(!_.isString(type)){
                   return undefined ;
               }
               try {
                   var stringData = JSON.stringify({id : this.get('id'), type : type});
                   var encryptData = crypto.AES.encrypt(stringData,'@masterKey').toString();
                   var token = jwt.sign({
                       token : encryptData
                   },'@masterToken');

                   return token;

               }catch (e){
                  // console.log(e);
                   return undefined ;
               }
            }
        }
    });
    return user;
};