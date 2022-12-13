const { Configuration, OpenAIApi } = require("openai");

class csOpenai {
    constructor(inApiKey) {
        this.inApiKey=inApiKey;
        this.configuration = new Configuration({
            apiKey:inApiKey,
          });
    }
    async generate(inQueryKey,inCountRslt,inResolution ){
        const openai = new OpenAIApi(this.configuration);
        const response = await openai.createImage({
          prompt: inQueryKey,
          n: inCountRslt,
          size: inResolution,
        });
        this.arrayResult=response.data;
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

module.exports = { csOpenai };