const express = require("express")
const multer = require("multer")
const path = require("path")
const app = express()

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + ".jpg")
    }
})


const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});


module.exports = upload