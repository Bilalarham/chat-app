
const socket=io()
const $messageform=document.querySelector('#msgform')
const $msgforninput=$messageform.querySelector('input')
const $submitbtn=$messageform.querySelector('button')
const $locbtn=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates 
const msgtemplate=document.querySelector('#message-template').innerHTML
const locationTemp=document.querySelector('#location-template').innerHTML
const sidebsr=document.querySelector('#sidebartemp').innerHTML
//options
 const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
 const autoscrol=()=>{
   const $newmessage=$messages.lastElementChild
   const newmsgstyles=getComputedStyle($newmessage)
   const msgmargen=parseInt(newmsgstyles.marginBottom)
   const msgHight=$newmessage.offsetHeight + msgmargen
   const visibleH=$messages.offsetHeight
   const conHight=$messages.scrollHeight
   const scroll=$messages.scrollTop + visibleH
   if(conHight - msgHight <= scroll){
$messages.scrollTop=$messages.scrollHeight

   }
 }
socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(msgtemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
autoscrol()
})
socket.on('location',(Url)=>{
console.log(Url.username)
const html=Mustache.render(locationTemp,{
    username:Url.username,
    url:Url.url,
    createdAt:moment(message.createdAt).format('h:mm A')
})
$messages.insertAdjacentHTML('beforeend',html)
autoscrol()
})
socket.on('roomdata',({room ,users})=>{
    const html=Mustache.render(sidebsr,{
room,
users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageform.addEventListener('submit',(e)=>{
  e.preventDefault()
  $submitbtn.setAttribute('disabled','disabled')
  const message=document.querySelector('#message').value
  socket.emit('sendMessage',message,(error)=>{
      $submitbtn.removeAttribute('disabled','disabled')
      $msgforninput.value=''
      $msgforninput.focus()
    if(error){ return console.log(error)}
    console.log('the msg was delivered')
  
  })
})

$locbtn.addEventListener('click',()=>{
    $locbtn.setAttribute('disabled','disabled')
    if(!navigator.geolocation){return alert('geo location is not sported by your brouser')}
    navigator.geolocation.getCurrentPosition((position)=>{
socket.emit('sendlocation',{
    latitude:position.coords.latitude,
    longitude:position.coords.longitude
},()=>{
    $locbtn.removeAttribute('disabled','disabled')
    console.log('Location send successfully')
})
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})