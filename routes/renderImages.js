var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');
const {csOpenai} =require ('../classes/csOpenai');

const imageResult= require('../models/image_results');
const SearchImg= require('../models/searchs');

const apiKey='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';

router.get('/', async (req, res, next)=>{

  if (!checkBody(req.body, ['queryKey'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const {queryKey}= req.body;

  let ImagAI =await new csOpenai(apiKey)
  await ImagAI.generate(queryKey,1,"1024x1024")

  if(ImagAI.Result){

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
        user_id:0,
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



})


module.exports=router;