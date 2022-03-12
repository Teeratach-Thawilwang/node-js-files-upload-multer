var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs')

// module 
var multer = require('multer')
const upload = multer({ dest: './public/data/uploads/' })

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// Upload file
router.post('/stats', upload.single('uploaded_file'), function(req, res) {
    // check file size and image format
    const targetPath = path.join(__dirname, "../public/data/uploads/" + req.file.originalname);
    if (req.file.size <= 625000) {
        if (path.extname(req.file.originalname).toLowerCase() === ".png" ||
            path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
            path.extname(req.file.originalname).toLowerCase() === ".svg") {

            // rename file path.
            fs.rename(req.file.path, targetPath, err => {
                if (err) {
                    res.sendStatus(500)
                        .contentType("text/plain")
                        .end("Upload fail. cann't rename file.");
                } else {
                    res
                        .status(200)
                        .contentType("text/plain")
                        .end("File uploaded!");
                }
            });
        } else {
            // delete recieved file.
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    res.sendStatus(500)
                        .contentType("text/plain")
                        .end("unlink fail. cann't delete file.");
                } else {
                    res
                        .status(200)
                        .contentType("text/plain")
                        .end("image file should be .jpg, .png, .svg");
                }
            })
        }
    } else {
        // delete recieved file.
        fs.unlink(req.file.path, (err) => {
            if (err) {
                res.sendStatus(500)
                    .contentType("text/plain")
                    .end("unlink fail. cann't delete file.");
            } else {
                res
                    .status(200)
                    .contentType("text/plain")
                    .end("image size more than 5MB.");
            }
        })
    }
    console.log(req.file, req.body)
});
module.exports = router;