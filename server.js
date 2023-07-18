const express = require('express')
const { Socket } = require('socket.io')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () =>
{
    console.log('Listing on port 3000')
})

app.use(express.static(__dirname+'/public'))
app.get('/',(req, res) => {
    res.sendFile(__dirname + '/home.html')

})
app.get('/chat',(req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/contact',(req, res) => {
    res.sendFile(__dirname + '/contact.html')
})

const io = require('socket.io')(http)


io.on('connection', (socket) =>{
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
    socket.on('new-user', name => {
      // Broadcast the message to all other users except the sender
      console.log("new user joined");
      socket.broadcast.emit('user-joined', name);
    });
    socket.on('disconnect', name => {
      console.log("user left");
      socket.broadcast.emit('left', name);
    })
})

const fs = require('fs');

app.post('/contact', (req, res) => {
  // Extract the form data from the request body
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  // Create an object to represent the contact data
  const contactData = {
    name: name,
    email: email,
    message: message
  };

  // Read existing data from the JSON file (if any)
  let existingData = [];
  if (fs.existsSync('contacts_info.json')) {
    existingData = JSON.parse(fs.readFileSync('contacts.json'));
  }

  // Add the new contact data to the existing data
  existingData.push(contactData);

  // Write the updated data back to the JSON file
  fs.writeFileSync('contacts.json', JSON.stringify(existingData));

  // Send a response to the client
  res.send('Thank you for contacting us!');
});
