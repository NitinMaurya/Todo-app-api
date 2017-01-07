/**
 * Created by nitin on 6/1/17.
 */
var express =  require ('express');
var bodyParser = require ('body-parser');
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

   todos.forEach(function (calltodoId){
      if(calltodoId.id === todoId){
          matchedtodo = calltodoId;
      }
   });
   if(matchedtodo) {
       res.json(matchedtodo);
   }
   else {
       res.status(404).send();
       console.log('Page Not Found!');
   }
});

app.post('/todos',function (req,res){
    var body = req.body;
    body.id = (++todo_id);
    todos.push(body);
    res.json(body);
});

app.listen(port,function (){
    console.log('Express Server is running at port ' + port + '......');
});