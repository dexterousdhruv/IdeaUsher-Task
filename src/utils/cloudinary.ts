import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});



export const uploadToCloudinaryFromBuffer = (
  buffer: Buffer,
  fileName: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const originalName = fileName.replace(/\s+/g, "-"); // sanitize filename

    const today = new Date();
    const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `IMG-${yyyymmdd}-${originalName}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error)
          return reject(
            new Error("Cloudinary Upload Failed: " + error.message)
          );
        resolve(result?.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

