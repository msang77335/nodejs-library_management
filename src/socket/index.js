const { addUser, removeUser, getAllUser } = require("../../assets/users");
module.exports = {
   init: (server) => {
      const io = require("socket.io")(server);
      io.on("connection", (socket) => {
         socket.on("login", ({ id }, callback) => {
            addUser({ id: id, socketId: socket.id });
            io.emit("sendOnline", { onLineUsers: getAllUser() });
         });

         socket.on("getOnline", () => {
            socket.emit("sendOnline", { onLineUsers: getAllUser() });
         });

         socket.on("disconnect", () => {
            removeUser(socket.id);
            io.emit("sendOnline", { onLineUsers: getAllUser() });
         });
      });
   },
};
