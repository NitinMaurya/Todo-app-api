/**
 * Created by nitin on 6/1/17.
 */
var express =  require ('express');
var bodyParser = require ('body-parser');
var _=require('underscore');
var app = express();
var port = process.env.PORT || 8000;
var todos = [];
var todo_id = 0;

app.use(bodyParser.json());

app.get('/',function (req,res){
    res.send('Todo Api Root.');
});

app.get ('/todos', function (req,res){
   res.json(todos);
});

var matchedtodo ;
app.get('/todos/:id',function (req,res){
   var todoId = parseInt(req.params.id,10);
   matchedtodo = _.findWhere(todos,{ id : todoId});
   if(matchedtodo) {
       res.json(matchedtodo);
   }
   else {
       res.status(404).json({"error" : "Page Not Found!"});

   }
});

app.post('/todos',function (req,res){
    var body = _.pick(req.body,'description','completed');
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        res.status(404).send();
        return;
    }
    body.description = body.description.trim();
    body.id = (++todo_id);
    todos.push(body);
    res.json(body);
});

app.delete('/todos/:id',function (req,res){
    var todoId = parseInt(req.params.id,10);
    var delmatchedtodo = _.findWhere(todos,{ id : todoId});
    if(!delmatchedtodo){
        res.status(404).json({"error": "Todo Not Found With That Id !"});
    }
    else {
        todos = _.without(todos, delmatchedtodo);
        res.json(matchedtodo);
    }
});

app.put('/todos/:id',function (req,res){
    var body = _.pick(req.body,'description','completed');
    var validAttributes = {};
    var todoId = parseInt(req.params.id,10);
    var putmatchedtodo = _.findWhere(todos,{ id : todoId});
    if(!putmatchedtodo){
        return res.send(404).json({"error": "Page Not Found!"});
    }
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(400).json({"error": "Bad Request!!"});
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0){
        validAttributes.description = body.description;
    }
    else if (body.hasOwnProperty('description')){
        return res.status(400).json({"error": "Bad Request!!"});
    }

    _.extend(putmatchedtodo,validAttributes);
    res.json(putmatchedtodo);

});

app.listen(port,function (){
    console.log('Express Server is running at port ' + port + '......');
});