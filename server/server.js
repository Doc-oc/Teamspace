var admin = require("firebase-admin");
const fetch = require('node-fetch');
const http = require('https')


// Fetch the service account key JSON file contents

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  // The database URL depends on the location of the database
  databaseURL: "https://teamspace-7f0e3-default-rtdb.europe-west1.firebasedatabase.app"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();



const io = require('socket.io')(8080, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
  
})

var text = "test";

function newColor()
{
  return '#'+'0123456789abcdef'.split('').map(function(v,i,a){
  return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
}
  
io.on("connection", socket => {

  socket.name = "Guest"+parseInt(Math.random()*1000);
  socket.color = newColor()

  socket.on('get-document', async file => {

    var ref = db.ref(`boards/${file.board}/filespace/${file.filespace}/files`);
    ref.once("value", function(snapshot) {
      const fileDB = snapshot.val();
      const fileArray = [];
      for(let id in fileDB){
          fileArray.push({id, ...fileDB[id]});
      } 
      fileArray.map(function(f){
        if(f.id == file.file)
          console.log(f.fileData)
      })
    });

    socket.join(file.file)
    socket.emit('load-document', file.fileData) // eg.document.dat

    socket.on('send-changes', delta => {
      socket.broadcast.to(file.file).emit("recieve-changes", delta)
    })

    socket.on("save-document", async data => {
       //await function
    })
  })
})