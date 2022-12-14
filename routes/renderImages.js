var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');
const {csOpenai} =require ('../classes/csOpenai');

const imageResult= require('../models/image_results');
const SearchImg= require('../models/searchs');
const User= require('../models/users');

const apiKey='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';

router.get('/:token', (req, res, next)=>{
  if (!checkBody(req.body, ['queryKey'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({token:req.params.token}).then(async(theUser)=>{
    if (theUser && theUser.nbRequest>0 ){
      const {queryKey}= req.body;

      let ImagAI = new csOpenai(apiKey)
      await ImagAI.generate(queryKey,1,"1024x1024")
    
      if(ImagAI.Result){
    
        User.updateOne(
          { _id: theUser._id },
          { $inc: { nbRequest: -1} }
       ).then(upda=>{
        
       })

        const {data} =ImagAI.Result;
        const arrayImageId =await data.map(element => {
            const imageIA= new imageResult({
              url: element.url,
            });
    
            imageIA.save().then(newDoc => {
              // res.json({ result: true, token: newDoc });
            });
            return imageIA._id
            
        });
    
        if (arrayImageId.length>0) {
          const newQuery= new SearchImg({
            user_id:theUser._id,
            textSearch: queryKey,
            dateSearch: Date.now(),
            imageResult:arrayImageId
          })
      
          newQuery.save().then((newDoc)=>{
            res.json({result:true, data: ImagAI.Result });
          })
        }else{
          res.json({result:false,data:[] });
        }    
        

      
      
      }else{
        res.json({result:false });
      }
    
    }else{
      if (theUser && !theUser.nbRequest>0 ){ 
        res.json({ result: false, error: 'No credits' });
      }else{
        res.json({ result: false, error: 'User not found' });
      }
    }

  })





})


module.exports=router;