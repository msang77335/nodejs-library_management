const mongoose = require("mongoose");

mongoose.connect(
   process.env.MONGO_URI,
   {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   },
   (error) => {
      if (!error) {
         console.log("Connect DB Success!!!");
      } else {
         console.log("Connect DB Success!!!");
      }
   }
);
