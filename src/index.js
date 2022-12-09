const path=require('path')
const http=require('http')
const soketio=require('socket.io')
const express = require('express')
const Filter=require('bad-words')
const app=express()
const server =http.createServer(app)
const io=soketio(server)
const port= process.env.PORT || 3000
const pubdir=path.join(__dirname,'../public')
app.use(express.static(pubdir))
const {genmsg,genloc}=require('./utils/messages')
const {addUser,removeUser, getuser,getuserinroom}=require('./utils/users')
io.on('connection',(socket)=>{
    console.log('new web socket connection')
  
socket.on('join',(options,callback)=>{
   const{error,user}= addUser({id:socket.id,...options})
   if(error){
   return callback(error)
   }
    socket.join(user.room)
    socket.emit('message',genmsg('welcome'))
    socket.broadcast.to(user.room).emit('message',genmsg(`${user.username} has joined!`))
    io.to(user.room).emit('roomdata',{
        room:user.room,
        users:getuserinroom(user.room)
    })
    callback()
})
socket.on('sendMessage',(message,callback)=>{
    const filter=new Filter()
    if(filter.isProfane(message)){ return callback('bad words not allowed')}
const user=getuser(socket.id)
    io.to(user.room).emit('message',genmsg(user.username,message))
    callback()
})
socket.on('sendlocation',(coords,callback)=>{
    const user=getuser(socket.id)
io.to(user.room).emit('location',genloc(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
callback()
})
socket.on('disconnect',()=>{
   const user= removeUser(socket.id)
   if(user){
io.to(user.room).emit('message',genmsg(`${user.username} has left`))
io.to(user.room).emit('roomdata',{
    room:user.room,
    users:getuserinroom(user.room)
})
   }
    
})
})

server.listen(port,()=>{
    console.log(`server is on ${port}`)
})