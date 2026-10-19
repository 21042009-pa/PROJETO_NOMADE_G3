const multer = require("multer")


const TIPOS_PERMITIDOS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'Back-end/uploads')
    },
    filename: function (req, file, cb) {
    const extensao = TIPOS_PERMITIDOS[file.mimetype];
    const nome = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${nome}${extensao}`);
  },
})

function fileFilter(req, file, cb) {
  if (TIPOS_PERMITIDOS[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido. Envie JPG, PNG ou WEBP."));
  }
}


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});


module.exports = upload