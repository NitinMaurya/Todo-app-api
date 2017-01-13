/**
 * Created by nitin on 6/1/17.
 */
var express =  require ('express');
var bodyParser = require ('body-parser');
var _=require('underscore');
var db = require ('./db.js');
var app = express();
var port = process.env.PORT || 8000;
var todos = [];
var todo_id = 0;

app.use(bodyParser.json());

app.get('/',function (req,res){
    res.send('Todo Api Root.');
});

app.get ('/todos', function (req,res){
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('completed') && query.completed === 'true' ){
        where.completed=true;
    }
    else if(query.hasOwnProperty('completed') && query.completed === 'false' ){
        where.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.length > 0 ){
        where.description = {
            $like : '%'+ query.q + '%'
        }
    }
    db.todo.findAll({where : where}).then(function(todos){
        res.json(todos);
    },function (e){
        res.status(500).send();
    });
/*
    var filteredTodos = todos;

    if( query.hasOwnProperty('completed') && query.completed === 'true'){
        filteredTodos =_.where(filteredTodos,{completed : true});
    }else if (query.hasOwnProperty('completed') && query.completed === 'false'){
        filteredTodos =_.where(filteredTodos,{completed : false});
    }

    if( query.hasOwnProperty('q') &&  query.q.trim().length > 0 ) {
        filteredTodos = _.filter(filteredTodos,function (todo){
            return todo.description.toLowerCase().indexOf(query.q.toLowerCase() ) > -1;
        });
    }
   res.json(filteredTodos);*/
});



//var matchedtodo ;
app.get('/todos/:id',function (req,res){
   var todoId = parseInt(req.params.id,10);
/*   matchedtodo = _.findWhere(todos,{ id : todoId});
   if(matchedtodo) {
       res.json(matchedtodo);
   }
   else {
       res.status(404).json({"error" : "Page Not Found!"});

   }*/
    db.todo.findById(todoId).then(function (todo){
       if(todo){
           res.json(todo.toJSON());
       }
       else {
           res.status(404).json('Page Not Found !!');
       }
    },function (e){
        res.status(500).send();
    });
});


app.post('/todos',function (req,res){
    var body = _.pick(req.body,'description','completed');
    /*if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        res.status(404).send();
        return;
    }
    body.description = body.description.trim();
    body.id = (++todo_id);
    todos.push(body);
    res.json(body);*/
    db.todo.create(body).then(function (todo){
        res.json(todo.toJSON());
    },function (e){
       res.status(400).json(e);
    });
});

app.delete('/todos/:id',function (req,res){
    var todoId = parseInt(req.params.id,10);
   db.todo.findById(todoId).then(function (todo){
       if(todo){
           todo.destroy(todoId);
           res.status(204).send();
       }
       else {
           res.status(404).json({ error : 'Todo Not Found With That Id !!'});
       }
   },function (e){
       res.status(500).send();
   });
    /* var delmatchedtodo = _.findWhere(todos,{ id : todoId});
    if(!delmatchedtodo){
        res.status(404).json({"error": "Todo Not Found With That Id !"});
    }
    else {
        todos = _.without(todos, delmatchedtodo);
        res.json(matchedtodo);
    }*/
});

app.put('/todos/:id',function (req,res){
    var body = _.pick(req.body,'description','completed');
    var Attributes = {};
    var todoId = parseInt(req.params.id,10);
   /* var putmatchedtodo = _.findWhere(todos,{ id : todoId});
    if(!putmatchedtodo){
        return res.send(404).json({"error": "Page Not Found!"});
    }*/
    if (body.hasOwnProperty('completed') /*&& _.isBoolean(body.completed)*/){
        Attributes.completed = body.completed;
    }/*else if(body.hasOwnProperty('completed')){
        return res.status(400).json({"error": "Bad Request!!"});
    }
*/
    if (body.hasOwnProperty('description')/* && _.isString(body.description) && body.description.trim().length >0*/){
        Attributes.description = body.description;
    }
    /*else if (body.hasOwnProperty('description')){
        return res.status(400).json({"error": "Bad Request!!"});
    }
   _.extend(putmatchedtodo,validAttributes);
    res.json(putmatchedtodo);*/
    db.todo.findById(todoId).then(function (todo){
        if(todo){
            todo.update(Attributes).then(function (todo) {
                res.json(todo.toJSON());
            },function (e){
                res.status(400).send(e);
            });
        }
        else {
            res.status(404).json({ error : 'Todo Not Found With That Id !!'});
        }
    },function (e){
        res.status(500).send();
    });

});

db.sequelize.sync().then(function (){
    app.listen(port,function (){
        console.log('Express Server is running at port ' + port + '......');
    });
});
