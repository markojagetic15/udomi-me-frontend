import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const uploadFile = async (file: File) => {
  const S3_BUCKET = import.meta.env.VITE_S3_BUCKET_NAME as string;
  const REGION = import.meta.env.VITE_AWS_REGION as string;

  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: file.name,
    Body: file,
  };

  try {
    const command = new PutObjectCommand(params);
    return await s3Client.send(command);
  } catch (error) {
    console.error(error);
  }
};
