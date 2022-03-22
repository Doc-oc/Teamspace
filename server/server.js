const io = require('socket.io')(8080, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
  
})
  
io.on("connection", socket => {
  socket.on('get-document', fileID => {
    const document = ""; //function here
    socket.join(fileID)
    socket.emit('load-document', document) // eg.document.dat

    socket.on('send-changes', delta => {
      socket.broadcast.to(fileID).emit("recieve-changes", delta)
    })

    socket.on("save-document", async data => {
       //await function
    })
  })
})