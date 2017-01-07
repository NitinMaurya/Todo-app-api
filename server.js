/**
 * Created by nitin on 6/1/17.
 */
var express =  require ('express');
var app = express();
var port = process.env.PORT || 8000;
var todos = [
    {
    id : 1,
    description : 'Meeting with my friend',
    completed : false
},
    {
    id : 2,
    description : 'Go to Market',
    completed : false
},
    {
        id : 3,
        description : 'Go to Sleep',
        completed : false
    }
    ];

app.get('/',function (req,res){
    res.send('Todo Api Root.');
});

app.get ('/todos', function (req,res){
   res.json(todos);
});

var matchedtodo ;
app.get('/todos/:id',function (req,res){
   var todoId = parseInt(req.params.id);

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

app.listen(port,function (){
    console.log('Express Server is running at port ' + port + '......');
});