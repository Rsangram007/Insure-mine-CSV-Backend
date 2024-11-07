const multer = require('multer');

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `file-${Date.now()}-${file.originalname}`);
     
    }
});

const uploads = multer({ storage: Storage }).single('file');

module.exports = { uploads };
