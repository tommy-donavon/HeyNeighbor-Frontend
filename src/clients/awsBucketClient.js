import { S3 } from 'aws-sdk';

class S3Client {
  constructor() {
    if (!S3Client.instance) {
      S3Client.instance = new S3({
        credentials: {
          accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
          secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
        },
      });
      S3Client.instance.config.region = 'us-east-2'
    }

    // return S3Client.instance;
  }

  uploadPhoto = async (username, file, type) => {
    const params = {
      ACL: 'public-read-write',
      Bucket: 'heyneighborimgstore',
      ContentEncoding: 'base64',
      ContentType: type,
      Key: `profiles/${username}_${Date.now()}`,
      Body: file,
    };
    try{
      const uploadData = await S3Client.instance.upload(params).promise()
      return uploadData.Location
    }catch(err){
      console.error(err)
    }
  };
}

const instance = new S3Client();
Object.freeze(instance);
export default instance;
