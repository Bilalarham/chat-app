const genmsg=(username,text)=>{
    return{
        username,
text,
createdAt:new Date().getTime()}
}
const genloc=(username,url)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}
module.exports={genmsg,genloc}
