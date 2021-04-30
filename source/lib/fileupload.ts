const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');
const validator = require('validator')

// These values will be used by below functions
//  Declaring them outside the function for better performance
const awsBucket = process.env.AWS_FILE_BUCKET;
const awsAccessId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const S3 = new AWS.S3({
  accessKeyId: awsAccessId,
  secretAccessKey: awsSecretKey,
  region: 'ap-south-1',
  apiVersion: '2006-03-01',
});

const extensionNotAllowed = ['exe', 'bat', 'msi', 'cmd']

function getUploadSignedUrl(filename: string) {

  const fileExtension = getFileExtension(filename);

  if (!fileExtension) {
    throw Error('File extension not found');
  }

  if (validator.isIn(fileExtension, extensionNotAllowed)) {
    throw Error(`File Extension ${fileExtension} not allowed`);
  }

  // Storing it in S3 and getting signed url from aws
  const fileUuidName = `${uuid()}.${fileExtension}`
  const signedURL = S3.getSignedUrl('putObject', {
    Bucket: awsBucket,
    Key: `${fileUuidName}`
  })

  return { url: signedURL, fileUuidName };
}

async function deleteFileAws(awskey: string) {
  try {
    await S3.deleteObject({
      Bucket: awsBucket,
      Key: `${awskey}`,
    }).promise();

    // Check if the file exits, after delete operation, 
    //  If exists, then throw an error.
    if (await isFileExists(awskey) == true) {
      throw Error('Error in Deleting file form AWS');
    }
    return;
  } catch (error) {
    throw Error(error.message || error);
  }
}

async function isFileExists(awskey: string) {
  try {
    await S3.headObject({
      Bucket: awsBucket,
      Key: `${awskey}`,
    }).promise();
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false
    } else {
      throw Error(err.message || err);
    }
  }
}



function getFileExtension(filename) {
  if (!filename.includes('.')) {
    return '';
  }
  return filename.split('.').pop();
}


export { getUploadSignedUrl, deleteFileAws }