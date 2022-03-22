const { createNoSubstitutionTemplateLiteral } = require('typescript')

const io = require('socket.io')(8080, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
  
})
  
io.on("connection", socket => {
  socket.on('send-changes', delta => {
    socket.broadcast.emit("recieve-changes", delta)
  })
})