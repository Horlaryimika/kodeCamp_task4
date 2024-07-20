const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("morgan");
require("dotenv").config();



const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(logger("common"));

const connection = mongoose.connect(process.env.MONGODB_URL);
connection.then(() => {
    console.log("Your task 4 has been connected to mongodb successfully")
}).catch((error) => {
    console.log("An error occur while trying to connect. Error:", error)
});

const userRoutes = require("./routes/userRoutes");

server.use("/user", userRoutes);


server.listen(process.env.PORT, function() {
    console.log("Server is up")
})
 
 