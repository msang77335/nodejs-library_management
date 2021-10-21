const users = [];

const addUser = ({ id, socketId }) => users.push({ id, socketId });

const removeUser = (socketId) => {
   const index = users.findIndex((user) => user.socketId === socketId);
   if (index !== -1) return users.splice(index, 1);
};

const getSocketId = (id) => user.find((user) => user.id === id);

const getAllUser = () => users.map((user) => user.id);
// const getAllUser = () => users;

module.exports = { addUser, removeUser, getSocketId, getAllUser };
