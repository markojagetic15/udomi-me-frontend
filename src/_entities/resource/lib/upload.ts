import AWS from 'aws-sdk';

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const uploadFile = async (file: File) => {
  const S3_BUCKET = import.meta.env.VITE_S3_BUCKET_NAME as string;
  const REGION = import.meta.env.VITE_AWS_REGION as string;

  AWS.config.update({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  });

  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const params: AWS.S3.PutObjectRequest = {
    Bucket: S3_BUCKET,
    Key: file.name,
    Body: file,
  };

  try {
    return await s3.putObject(params).promise();
  } catch (error) {
    console.error(error);
  }
};
