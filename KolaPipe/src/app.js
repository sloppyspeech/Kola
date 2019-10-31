const app=require('express')();
const http=require('http');
const request=require('request');
const socketio=require('socket.io');
const port=8001;

const httpServer=http.createServer(app);
const io=socketio(httpServer);

let coor_npsc=io.of('/coords');
let mydata='';
let intv;

coor_npsc.on('connection',socket =>{

    socket.on('get_coords',(event)=>{
        console.log('getCoords Called');
        intv=setInterval(()=>{
            var d=new Date();
            myData={
                'hour':d.getHours(),
                'minutes':d.getMinutes(),
                'seconds':d.getSeconds()
                };

            request("http://localhost:9000/api/v1/simuRider/T-1178",(err,res,body)=>{
                if(!err && res.statusCode ==200 ){
                    console.log(body);
                }
            });
            socket.emit('currDate',myData);
            console.log("Time "+d.getMinutes()+":"+d.getSeconds());
            // socket.emit('coords',mydata);
        },2000);
    });

    socket.on('disconnect',()=>{
        console.log('Socket IO disconnect Called');
        clearInterval(intv);
        console.log('coor_npsc disconnect Called ');
    });

});



httpServer.listen(port,()=>{
    console.log(`Listening on port : ${port}`);
});
