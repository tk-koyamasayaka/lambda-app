const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
    
    // S3の画像をリスト化
    const listObjects = await S3ListObjects({
        Bucket: 'koi-chan-img'
    });
    
    const filePaths = listObjects.Contents.map(item => item.Key);
    
    const index = randomInt(filePaths.length);
    const filePath = filePaths[index];
    
    const image = await S3GetObject({
        Bucket: 'koi-chan-img',
        Key: filePath,
    });
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': image.ContentType
        },
        body: image.Body.toString('base64'),
        isBase64Encoded: true
    };
    return response;

};

const S3ListObjects = params =>
    new Promise( (resolve, reject) =>
        S3.listObjects(params,
            (err, data) => (err ?
                reject(err) :
                resolve(data))));
                
            
const S3GetObject = params =>
    new Promise( (resolve, reject) =>
        S3.getObject(params,
            (err, data) => (err ?
                reject(err) :
                resolve(data))));
        
const randomInt = max => Math.floor(Math.random() * Math.floor(max));  
