const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};
    
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split('.')[0].split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
})

const fileFilter = (req, file, callback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    return callback(new Error('Seulement les fichiers images sont autorisés!'), false);
  }
  callback(null, true);
};

let upload = multer({ storage, fileFilter }).single('image');

module.exports = (req, res, next) => {
upload(req, res, (err) => {
    if (err) {
      // erreur lors de l'upload (erreur de type de fichier notamment)
      return res.status(500).json({ error: "Une erreur s'est produite" });
    }
    next();
  });
}