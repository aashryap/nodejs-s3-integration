const Busboy = require('busboy');
const AWS = require('aws-sdk');

const BUCKET_NAME = "node-s3-aashray";
const IAM_USER_KEY = "AKIAIP6NNLYWIFEWDASA";
const IAM_USER_SECRET = "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";

module.exports = (app) => {
    app.post('/api/upload', function(req, res, next){
        const element1 = req.body.element1;
        var busboy = new Busboy({headers : req.headers});
        busboy.on('finish', function(){
            console.log("upload finished");

            console.log('files');

            console.log(req.files);
            const file = req.files.element2;
            console.log(file);
            // uploadToS3(file);

            let s3Bucket = new AWS.S3({
                accessKeyId : IAM_USER_KEY,
                secretAccessKey : IAM_USER_SECRET
                // Bucket : BUCKET_NAME
            })

            s3Bucket.createBucket(function() {
                let params = {
                    Bucket : BUCKET_NAME,
                    Key : file.name,
                    Body : file.data
                }

                s3Bucket.upload(params, function(err, data){
                    if(err)
                    {
                        console.log("err while uploading----", err);
                    }
                    console.log("-------s3 data-------", data);
                })
            })
        })
        req.pipe(busboy);

        res.status(200).send({msg : "okay" })
    })

    app.get("/api/getFile", function(req, res, next){
        
        let s3Bucket = new AWS.S3({
            accessKeyId : IAM_USER_KEY,
            secretAccessKey : IAM_USER_SECRET
            // Bucket : BUCKET_NAME
        })

        s3Bucket.createBucket(function(){
            let params = {
                Bucket : BUCKET_NAME,
                Key : "wp1900761.jpg"
            }

            s3Bucket.getObject(params, function(err, data){
                if(err)
                {
                    console.log("errr while getting data------", err);
                }
                console.log("---------data download s3-------", data);
                res.setHeader('Content-disposition', 'attachment; filename=wp1900761.jpg');
                res.setHeader('Content-length', data.ContentLength);
                res.end(data.Body);
            })
        })
     
    })
}