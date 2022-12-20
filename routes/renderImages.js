var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { ApiOpenai } = require("../classes/csOpenai");
const uniqid = require("uniqid");
const fetch = require("node-fetch");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const imageResult = require("../models/image_results");
const SearchImg = require("../models/searchs");
const User = require("../models/users");

// const apiKey='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';

router.post("/", (req, res, next) => {
  try {
    if (!checkBody(req.body, ["queryKey", "token"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }
    User.findOne({ token: req.body.token }).then(async (theUser) => {
      if (theUser && theUser.nbRequest > 0) {
        const { queryKey } = req.body;

        let ImagAI = new ApiOpenai();
        await ImagAI.generate(queryKey, 4, ""); //.catch(err => console.error(err))

        if (ImagAI.Result) {
          User.updateOne(
            { _id: theUser._id },
            { $inc: { nbRequest: -1 } }
          ).then((updateDoc) => {});

          const { data } = ImagAI.Result;

          function downloadAI(tabResult) {
            return new Promise((resolve, reject) => {
              const tabTask = [];
              for (let index = 0; index < tabResult.length; index++) {
                fetch(tabResult[index].url).then((res) => {
                  const imagePath = `./tmp/${uniqid()}.png`;
                  // This opens up the writeable stream to `output`
                  const writeStream = fs.createWriteStream(imagePath);
                  res.body.pipe(writeStream);

                  writeStream.on("finish", () => {
                    uploadToCloudinary(imagePath)
                      .then((n) => {
                        tabTask.push(n);
                        //console.log('resultCloudinary.secure_url',n);
                      })
                      .then(() => {
                        if (tabTask.length === tabResult.length) {
                          SaveInDB(tabTask);
                          resolve(tabTask);
                        }
                      });
                  });
                  console.log("close");
                });
              }
              //resolve(tabTask);
              // if (err) return reject(err);
            });
          }

          function uploadToCloudinary(image) {
            return new Promise((resolve, reject) => {
              cloudinary.uploader.upload(image, (err, url) => {
                fs.unlinkSync(image);
                if (err) return reject(err);
                return resolve(url.secure_url);
              });
            });
          }

          // Apres upload Cloudinary ==> Enregistrement des images sur DB
          function SaveInDB(tabImgUp) {
            let arrayImageId = [];
            for (const newUrl of tabImgUp) {
              const imageIA = new imageResult({
                url: newUrl,
              });
              imageIA.save();
              arrayImageId.push(imageIA);
            }

            if (arrayImageId.length > 0) {
              const newQuery = new SearchImg({
                user_id: theUser._id,
                textSearch: queryKey,
                dateSearch: Date.now(),
                imageResult: arrayImageId.map((val) => val._id),
              });

              newQuery.save().then((newDoc) => {
                res.json({ result: true, data: arrayImageId });
              });
            } else {
              res.json({ result: false, data: [] });
            }
          }

          downloadAI(data)
            .then((n) => {
              console.log("End downloadAI", n);
            })
            .catch((err) => () => {
              console.error(err);
              res.json({ result: false, error: err });
            });
        } else {
          res.json({ result: false });
        }
      } else {
        if (theUser && !theUser.nbRequest > 0) {
          res.json({ result: false, error: "No credits" });
        } else {
          res.json({ result: false, error: "User not found" });
        }
      }
    });
  } catch (error) {
    res.json({ result: false, error: `User not found   ==> ${error}` });
  }
});

router.post("/checked", (req, res, next) => {
  if (!checkBody(req.body, ["imageId", "token", "isLiked"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    console.log("invalid inputs", req.body);
    return;
  }
  const { token, imageId, isLiked } = req.body;
  console.log(isLiked, "toto");
  User.findOne({ token: token }).then((theUser) => {
    imageResult
      .updateOne({ _id: imageId }, { isChecked: isLiked })
      .then((updaeDoc) => {
        res.json({ result: true });
      });
  });
});

module.exports = router;

