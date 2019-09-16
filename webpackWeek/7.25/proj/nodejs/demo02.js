var fs = require('fs');
//删除json文件中的选项
function deleteJson(id){
    fs.readFile('./mock/person.json',function(err,data){
        if(err){
            return console.error(err);
        }
        var person = data.toString();
        person = JSON.parse(person);
        //把数据读出来删除
        for(var i = 0; i < person.data.length;i++){
            if(id == person.data[i].id){
                //console.log(person.data[i])
                person.data.splice(i,1);
            }
        }
        console.log(person.data);
        person.total = person.data.length;
        var str = JSON.stringify(person);
        //然后再把数据写进去
        fs.writeFile('./mock/person.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log("----------删除成功------------");
        })
    })
}
deleteJson(4);//执行一下