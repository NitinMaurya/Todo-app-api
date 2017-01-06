/**
 * Created by nitin on 6/1/17.
 */
var express =  require ('express');
var app = express();
var port = process.env.PORT || 8000;

app.get('/',function (req,res){
    res.send('Todo Api Root.');
});

app.listen(port,function (){
    console.log('Express Server is running at port ' + port + '......');
});