const { Configuration, OpenAIApi } = require("openai");

class ApiOpenai {
    constructor() {        
        this.configuration = new Configuration({
            apiKey:process.env.OPENAI_API_KEY ||'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',
          });
    }
    
    async generate(inQueryKey,inCountRslt,inResolution ){

      if(inQueryKey && inCountRslt>0){
          const openai = new OpenAIApi(this.configuration);
          const response = await openai.createImage({
            prompt: inQueryKey,
            n: (inCountRslt > 4)? 4 : inCountRslt ,
            size: this.checkSize(inResolution) ,
          });
          this.arrayResult=response.data;
      }
    }

    // 256x256, 512x512, or 1024x1024
    checkSize (params) {
      let tabSize=['256x256','512x512','1024x1024'];
      if(tabSize.includes(params)){
        return params;
      }else{
        return '256x256';
      }
    }

    async generateWithImage(inQueryKey,url){
        try {
            // This is the Buffer object that contains your image data
            const buffer = [url];
            // Set a `name` that ends with .png so that the API knows it's a PNG image
            buffer.name = "image.png";
            const openai = new OpenAIApi(this.configuration);
            const response = await openai.createImageVariation(
            buffer,
            1,
            "1024x1024"
            );
            console.log(response);
            // response.data.data[0].url
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
            } else {
              console.log(error.message);
            }
          }
    }

    get Result() {
        return this.arrayResult;
    }
}

module.exports = { ApiOpenai };