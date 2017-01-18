/**
 * Created by nitin on 18/1/17.
 */
var crypto = require('crypto-js');
 module.exports = function (sequelize,DataTypes){
     return sequelize.define ('token',{
        token : {
            type: DataTypes.VIRTUAL,
            allowNull : false,
            validate : {
                len : [1]
            },
            set : function (value){
                var hash = crypto.MD5(value).toString();
                this.setDataValue('token',value);
                this.setDataValue('hashedToken',hash);
            }
        },
         hashedToken : DataTypes.STRING
     });
};