var fs = require('fs');
var params = {
    "name":"ssssss"
}
function changeJson(id,params){
    fs.readFile('./mock/person.json',function(err,data){
        if(err){
            console.error(err);
        }
        var person = data.toString();
        person = JSON.parse(person);
        //把数据读出来,然后进行修改
        for(var i = 0; i < person.data.length;i++){
            if(id == person.data[i].id){
                console.log('id一样的');
                for(var key in params){
                    if(person.data[i][key]){
                        person.data[i][key] = params[key];
                    }
                }
            }
        }
        person.total = person.data.length;
        var str = JSON.stringify(person);
        //console.log(str);
        fs.writeFile('./mock/person.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('--------------------修改成功');
            console.log(person.data);
        })
    })
}
changeJson(3,params)//执行一下;
