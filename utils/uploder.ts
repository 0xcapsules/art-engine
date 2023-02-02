import * as AWS from 'aws-sdk';
import * as fs from 'fs';



const s3 = new AWS.S3({
    region: 'eu-central-1',
    accessKeyId: 'AKIAXEZRZEA52A7AJRTJ',
    secretAccessKey: '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'
  });
  

const scanAndUpload = async (path: string) => {
    try {
        const files = await fs.promises.readdir(path);
        for (const file of files) {
            if (file.includes('.jpg') || file.includes('.png') || file.includes('.jpeg')) {
                const filePath = path + '/' + file;
                const fileContent = await fs.promises.readFile(filePath);
                const s3Params = {
                    Bucket: "capsules-images",
                    Key: file,
                    Body: fileContent,
                };
                const s3UploadData = await s3.upload(s3Params).promise();
                console.log(`File uploaded successfully. ${s3UploadData.Location}`);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

scanAndUpload("path-to-read");

