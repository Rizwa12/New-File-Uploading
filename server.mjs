import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import fs from 'fs';
import admin from "firebase-admin";
import { stringToHash } from "bcrypt-inzi";

// https://firebase.google.com/docs/storage/admin/start
var serviceAccount = {
    "type": "service_account",
    "project_id": "file-uploading-c9477",
    "private_key_id": "d8c8dd880eb4b26a34aa5a97b60632af4157b324",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMKlBHxYvJCIKb\nG/q4V/Umy314519/hzl+e1oPFbTcEGj7HNZrDlBUipLCwzsKNo/MgYDirLbq/Zjs\n8WltK+I4R5WkYuQIdh72yum8bYUcgCfUt50fHFyk9JPywUEE83ejj7vNDRN15TSb\ny+YP4Dsb7KKFEN3G4EgF5EUh81BmjZD9Thdn5yOGQzVvIfi7iikSlTrLfUyur6ie\n9jcx2v6bbZimz1XJDduVXYvOpAtaP5+PnAJYalzaupUO2SV0DQd9RRcAdouj+Y1b\nn/+wADsgfo1nfxBGvCt/SkVt8P84ApowtUE3Y0NqAke7OUlCYJ/FZvEkffx1oie+\nwpkgUxnLAgMBAAECggEACZN2GeYXa3gr0N5yZCezMHAjJ1x9O39aTRpR1Y5LlUM4\nLiFvbyyhmO2GlH43hgACi6S+KL04HfQdTAb6TmwPm45dlvNdrB+HAUVWl23XOS7l\nPCvZwayA+rdPO/e56haihtHsv/sVunxj+zPuy2s76oN7wsKeD40HSi6nc9m0bJlJ\n6lo1ON/bP4qaTsv1zi0TGMaA0mc5fOdaMjkfYVj48c8a9mLSUNJ7U29lnQlYyObr\nUuzEbWMNSfNrDZIL3vYh8yUK82SJ0jvbc3Vkgiw9TxIDG33xzJdqOSRi3+vXimiY\n14IpEZqSHE3DjySiOoeZ2J2yAnhJ+Qi33p8rkwc5MQKBgQD6HGJRYUsi/LBktpsd\nr+Rs1gnR7tGXhCnY81NHtOIe5aCmfauvcsSkxE3RbWx+6xCDSxsLVHOc+AiMZ16a\nl5rXw6ol/iUYoj+337/g+cj434K99UbGPzQEoeybklnba9eIzv2UgdUuEK1xG+gO\notq0NK61uVunp41yUk4r9Q7PmwKBgQDQ+PqqnGS+IxDkPfrxJ1+jpcVqZvTST/if\noJEWghkSP0LqwfZ1/QISHwttOYUVCZRyEbX+kq1lnbqreJuTrhUvRvXJH1fApPXI\nDJlXa9dYOykVjW6bN8acqX9GT3WBZu+gHjNiJEIczgcsPmlCFpa0FwIVlAAoPS35\n4MNLboI5kQKBgBf1fB2bml0Bo8wiCf3wCYu7fTlVDVLcYD3eIU4vL7ISAS+xvi6S\nae/2thWny8rkrbJGEZMmReT1hawdgtyARV8B6Vy2WctgT4ZHstPUWcItdxLHWj5H\nc6417LqCbIUucXkziusc/NTq2BKLv9EXHKhCm7HgzbzjuhMHe2GOmhqdAoGAdP2O\nyAk6VUAoar9QR8X1QxbBSOpO0Zc355Xq5CD9jDuiaO8h3bhBeoeqzAFRwg9U7e+A\nZf8T2DnPkcO5xZnF/mvJmklTxWQUvWRgTJLxQlIMlCZT783wATDbMi+15zYLnSaL\nObx2zs2BMoHWR8uBn1zqK85psB1gKe5tJ0O84CECgYBXd1nFFnNrVFr1eJQ316ZZ\nYRSD0D82V0koFg/JHb4ETlQYDbTvxeskt4gIXGXwTFmpI4XNo8zELADWG3Oasej+\noZ5QOniHCIyLf4MpkKX+/jw6HPTCYHwMzInzgYHP8D2vDAHGlpuLd5TbJJuDkVyh\nU2z1dkkyrm6ERJ8GS8Tosw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-c550t@file-uploading-c9477.iam.gserviceaccount.com",
    "client_id": "111419116153203438509",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c550t%40file-uploading-c9477.iam.gserviceaccount.com"
    
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https:// file-uploading-c9477.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://file-uploading-c9477.appspot.com");



//==============================================
import multer from 'multer';
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })

//==============================================




const dbURI = process.env.MONGODBURI||'mongodb+srv://abc:abc@cluster0.dcy08cl.mongodb.net/socialmediaserver?retryWrites=true&w=majority';
const port = process.env.PORT || 5001;


const app = express();
app.use(express.json()); // parsing body


app.use(cors({
    origin: ['http://localhost:3000', 'https://file-uploading-c9477.web.app', "*"],
    credentials: true
}));

const customerSchema = new mongoose.Schema({

    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const customerModel = mongoose.model('Customer', customerSchema);



app.post("/signup", upload.any(), (req, res) => {

    let body = req.body;

    // console.log("body: ", body);
    // console.log("body: ", body.name);
    // console.log("body: ", body.email);
    // console.log("body: ", body.password);

    console.log("file: ", req.files[0]);

    if (!body.name
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "name": "John",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        {
            destination: `profilePhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        // check if user already exist // query email user
                        customerModel.findOne({ email: body.email }, (err, user) => {
                            if (!err) {
                                console.log("user: ", user);

                                if (user) { // user already exist
                                    console.log("user already exist: ", user);
                                    res.status(400).send({ message: "user already exist,, please try a different email" });
                                    return;

                                } else { // user not already exist

                                    stringToHash(body.password).then(hashString => {

                                        customerModel.create({
                                            name: body.name,
                                            email: body.email.toLowerCase(),
                                            password: hashString,
                                            profilePicture: urlData[0]
                                        },
                                            (err, result) => {
                                                if (!err) {
                                                    console.log("data saved: ", result);
                                                    res.status(201).send({
                                                        message: "user is created",
                                                        data: {
                                                            name: body.name,
                                                            email: body.email.toLowerCase(),
                                                            profilePicture: urlData[0]
                                                        }
                                                    });
                                                } else {
                                                    console.log("db error: ", err);
                                                    res.status(500).send({ message: "internal server error" });
                                                }
                                            });
                                    })

                                }
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "db error in query" });
                                return;
                            }
                        })


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });








});


app.get("/users", async (req, res) => {
    try {
        let users = await customerModel.find({}).exec();
        console.log("all user : ", users);

        res.send({
            message: "all users",
            data: users
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})








/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////
//mongoose.connect('mongodb+srv://abc:abc@cluster0.dcy08cl.mongodb.net/?retryWrites=true&w=majority');
//let dbURI = process.env.MONGODBURI||'mongodb+srv://abc:abc@cluster0.dcy08cl.mongodb.net/socialmediaserver?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});
process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});