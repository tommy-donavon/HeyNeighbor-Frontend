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
    const upLoadData = S3Client.instance.upload(params, (err, data) => {
      if (err) console.error(err);
      if (data) {
        return data.Location;
      }
    });
    return upLoadData;
    // console.log(upLoadData)
  };
}

const instance = new S3Client();
Object.freeze(instance);
export default instance;
