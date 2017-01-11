var Sequelize = require ('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
    'dialect' : 'sqlite' ,
    'storage' : __dirname + '/sqliteDatabaseFile.sqlite'
});

var Todo = sequelize.define('todo',{
   description : {
       type : Sequelize.STRING,
       allowNull : false,
       validate : {
           len : [1,250]
       }

   } ,
    completed : {
       type : Sequelize.BOOLEAN,
       // allowNull : false,
        defaultValue: false
    }
});

sequelize.sync().then(function (){
 //   console.log('Everything is synced.');
    Todo.create({
        description : 'go to college',
        completed : true
    }).then(function(){
        return Todo.create({
            description :'go to market'
        });
    }).then(function (){            //for searching
        return Todo.findAll({
            where : {
                description : {
                   $like : '%%'
                }

            }
        });
    }).then(function (todos){           //for printing todos
       if(todos){
           todos.forEach(function(todo){
               console.log(todo.toJSON());
           });

       }else {
           console.log('Todo Not Found!');
       }
    }).catch(function (e){              //for catching errors
        console.log(e);
    });

});



