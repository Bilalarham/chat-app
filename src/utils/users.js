const users=[]
const addUser=({id,username,room})=>{
//clean the data
username= username.trim().toLowerCase()
room=room.trim().toLowerCase()
//validate daTa
if(!username || !room){
    return {
        error:'user name and room required'
    }
}
//check for existing user
const exitUser=users.find((user)=>{
    return user.room===room && user.username===username
})
//validate username
if(exitUser){
    return{
        error:'This user name is alredy taken'
    }
}
//store user
const user={id,username,room}
users.push(user)
return{user}
}
const removeUser=(id)=>{
    const index=users.findIndex((users)=>users.id===id)
    if(index !==-1){
        return users.splice(index,1)[0]
    }
 }
 const getuser=(id)=>{
    return users.find((user)=>user.id===id)
 }
 const getuserinroom=(room)=>{
    // room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
 }

 module.exports={
    addUser,
    removeUser,
    getuser,getuserinroom
 }