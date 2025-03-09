import multer from 'multer';
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const pathFile = path.join(process.cwd(), './public/images');
        if (!fs.existsSync(pathFile)) {
            fs.mkdirSync(pathFile, { recursive: true });
        };
        cb(null, pathFile);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    }
});

export const uploadMiddleware = upload.fields([
    { 
        name: 'image',
        maxCount: 15,
    }
]);

export default uploadMiddleware;