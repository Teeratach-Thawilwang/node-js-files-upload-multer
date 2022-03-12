var path = require('path');
var fs = require('fs')

// module 
var multer = require('multer')
const upload = multer({ dest: './public/data/uploads/' })

function status(code, msg) {
    console.log(code, msg)
    return {
        'statusCode': code,
        'detail': msg
    }
}

function checkFileType(filename) {
    if (path.extname(filename).toLowerCase() === ".png" ||
        path.extname(filename).toLowerCase() === ".jpg" ||
        path.extname(filename).toLowerCase() === ".svg") {
        return true
    } else {
        return false
    }
}

function uploadImage(req) {
    return new Promise(function(resolve, reject) {
        // check file size and image type
        const targetPath = path.join(__basedir, "/public/data/uploads/" + req.file.originalname);
        if (req.file.size <= 5 * 1024 * 1024) {
            if (checkFileType(req.file.originalname)) {
                // rename file path.
                fs.rename(req.file.path, targetPath, err => {
                    if (err) {
                        reject(status(500, "Can not rename file."))

                    } else {
                        resolve(status(200, "File uploaded!"))
                    }
                });
            } else {
                // delete recieved file.
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        reject(status(500, "unlink fail. cann't delete file."))

                    } else {
                        reject(status(500, "image file should be .jpg, .png, .svg"))
                    }
                })
            }
        } else {
            // delete recieved file.
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    reject(status(500, "unlink fail. cann't delete file."))

                } else {
                    reject(status(500, "image size more than 5MB."))
                }
            })
        }
    })
}

module.exports.uploadImage = uploadImage
module.exports.checkFileType = checkFileType