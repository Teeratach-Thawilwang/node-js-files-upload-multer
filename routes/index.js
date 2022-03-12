var express = require('express');
var router = express.Router();
var path = require('path');

// manage file upload
const upFile = require(path.resolve("helpers/uploadFiles.js"))
var multer = require('multer')
const upload = multer({ dest: './public/data/uploads/', limits: 5 })

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// Upload single file
router.post('/stats/single', upload.single('uploaded_file'),
    async function(req, res) {
        try {
            const status = await upFile.uploadImage(req)
            console.log(status);
            res.end(status.detail)
        } catch (err) {
            console.log(err);
            res.end(err.detail)
        }
    }
);

// upload multi file
router.post('/stats/multi', upload.array('uploaded_files', 5),
    async function(req, res) {
        // check file type
        for (let i = 0; i < req.files.length; i++) {
            console.log(req.files[i].size)
            if (!upFile.checkFileType(req.files[i].originalname)) {
                res.end("image file should be .jpg, .png, .svg")
            } else if (req.files[i].size > 1 * 1024 * 1024) {
                res.end("image size more than 5MB.")
            }
        }

        for (let i = 0; i < req.files.length; i++) {
            try {
                const status = await upFile.uploadImage({ file: req.files[i] })
                console.log(status);
                res.end(status.detail)
            } catch (err) {
                console.log(err);
                res.end(err.detail)
            }
        }
    }
);

module.exports = router;