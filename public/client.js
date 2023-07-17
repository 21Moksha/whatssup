const socket = io()

let name;

let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message_area')
var audio = new Audio('ting.mp3');

do{
    name= prompt('Please enter your name: ')
}while(!name)

textarea.addEventListener('keyup', (e) =>{
    if(e.key==='Enter'){
        sendMessage(e.target.value)
    }
})
// Get the theme toggle button element
const themeToggle = document.getElementById('theme-toggle');



// Add event listener to the button
themeToggle.addEventListener('click', () => {
  // Toggle the "light-theme" class on the body element
  document.body.classList.toggle('light-theme');
  // Toggle the "dark-theme" class on the body element
  document.body.classList.toggle('dark-theme');
});



function sendMessage(message)
{
    let msg={
        user: name,
        message: message.trim()
    }

    appendMessage(msg, 'outgoing')
    textarea.value=''
    scrolltobottom()
    // Send to server
    socket.emit('message', msg)
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message') 
    if(type=='incoming')
    {
        audio.play();        
    }
    //audio.play();
    let markup = `
    <p>${msg.message}</p>
    <h4>${msg.user}</h4>
`;

mainDiv.innerHTML = markup;
messageArea.appendChild(mainDiv);

    
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


//Recieve messages

socket.on('message', (msg) =>
{
    appendMessage(msg, 'incoming')
    scrolltobottom()
})
function scrolltobottom()
{
    messageArea.scrollTop = messageArea.scrollHeight
}