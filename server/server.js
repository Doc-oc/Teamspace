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
    origin: 'http://192.168.0.108:3000',
    methods: ['GET', 'POST'],
  }
  
})

io.on("connection", socket => {

  socket.on('get-document', async file => {
    // and then later

    /*socket.on('joined', (socket) => {
      socket.broadcast.to(file.file).emit("hello", "world");
    });*/

    socket.join(file.file)
  
    socket.emit('load-document', file.fileData) // eg.document.dat

    socket.on('send-changes', delta => {
      socket.broadcast.to(file.file).emit("recieve-changes", delta)
    })

    /*socket.on('joinedUser', data => {
      //socket.broadcast.emit(message);
      socket.broadcast.emit("recieve-joined", data)
    })*/ 
  
    socket.on("save-document", async data => {
      db.ref(`boards/${file.board}/filespace/${file.filespace}/files/${file.file}`).update({fileData: data});
    })
  })
})

async function findFile(){

}