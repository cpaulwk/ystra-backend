var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { ApiOpenai } = require("../classes/csOpenai");
const cloudinary = require("cloudinary").v2;

const imageResult = require("../models/image_results");
const SearchImg = require("../models/searchs");
const User = require("../models/users");

router.post("/", (req, res, next) => {
  try {
    if (!checkBody(req.body, ["queryKey", "token"])) {
      return res.status(400).send({  result: false, error: 'Missing or empty fields' });
    }

    const {token}=req.body;
    User.findOne({ token: token }).then(async (theUser) => {
      if (theUser && theUser.nbRequest > 0) {
        const { queryKey } = req.body;

        let ImagAI = new ApiOpenai();
        await ImagAI.generate(queryKey, 4, ""); 
        if (ImagAI.Result) {
            User.updateOne(
              { _id: theUser._id },
              { $inc: { nbRequest: -1 } }
            ).then((updateDoc) => {});

            const { data } = ImagAI.Result;
            let arrayImageId = [];
            for (let index = 0; index < data.length; index++) {     
                const resultCloudinary = await cloudinary.uploader
                .upload(data[index].url)
                  .then(result=>
                      {
                        const newImageResult = new imageResult({
                          url: result.secure_url,
                          isChecked:false
                        });
                        newImageResult.save();
                        arrayImageId.push(newImageResult);
                      }                  
                    );
            };

            if (arrayImageId.length > 0) {
              const newQuery = new SearchImg({
                user_id: theUser._id,
                textSearch: queryKey,
                dateSearch: Date.now(),
                imageResult: arrayImageId.map((val) => val._id),
              });

              newQuery.save().then((newDoc) => {
                res.json({ result: true, imagesUrl: arrayImageId });
              });
            } else {
              res.json({ result: false, imagesUrl: [] });
            }
          }  
          
          
      } else {
        if (theUser && !theUser.nbRequest > 0) {
          res.status(401).send({ result: false, error: 'No credits' })
        } else {
          res.status(401).send({ result: false, error: 'User not found' })
        }
      }

      }).catch(error=>{
      res.status(500).send({ result: false, error: error.message })
    })

  } catch (error) {
    res.status(401).send({ result: false, error: error.message })
  }
});


router.post("/liked", (req, res, next) => {
  if (!checkBody(req.body, ["imageId", "token", "isLiked"])) {
    return res.status(400).send({  result: false, error: 'Missing or empty fields' });
  }
  const { token, imageId, isLiked } = req.body;
  User.findOne({ token: token }).then((theUser) => {
    if (theUser){
      imageResult
        .updateOne({ _id: imageId }, { isChecked: isLiked })
        .then((updaeDoc) => {
          res.json({ result: true });
        });
    }else{
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

});

module.exports = router;

