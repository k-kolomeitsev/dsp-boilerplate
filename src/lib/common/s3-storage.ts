// @dsp obj-705af2e8
import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import { moment } from './moment';
import { InternalServerErrorException } from '@nestjs/common';
import { pipeline } from 'stream/promises';

// @dsp func-0277c3b1
export async function saveEventToStorage(
  data: any,
  s3: AWS.S3,
  Bucket: string,
) {
  const momentDate = moment();
  const year = momentDate.year();
  const month = momentDate.month() + 1;
  const day = momentDate.date();
  const hour = momentDate.hour();
  const minute = momentDate.minute();

  const fileContent = Buffer.from(JSON.stringify(data), 'utf8');

  const params = {
    Bucket,
    Key: `${year}/${month}/${day}/${hour}/${minute}/${randomUUID()}.json`,
    Body: fileContent,
  };

  let result;

  try {
    result = await s3.upload(params).promise();
  } catch (e) {
    throw new InternalServerErrorException(e, 'Upload to S3 Error');
  }

  return `S3:${result.Location}`;
}

// @dsp func-29915fe0
export async function getFromStorage(
  s3: AWS.S3,
  Bucket: string,
  mediaPath: string,
) {
  const typeOfMediaStorageArr = mediaPath.split(':');

  let mediaJson = null;

  if (typeOfMediaStorageArr.shift() === 'S3') {
    const url = new URL(typeOfMediaStorageArr.join(':'));
    const path = url.pathname.split('/');
    path.splice(1, 1);
    const Key = path.join('/');

    const options = {
      Bucket,
      Key,
    };

    try {
      const fileJson = await s3.getObject(options).promise();
      const body = fileJson.Body;

      if (!body) {
        throw new Error('S3 object body is empty');
      }

      let bodyString: string;

      if (typeof body === 'string') {
        bodyString = body;
      } else if (Buffer.isBuffer(body)) {
        bodyString = body.toString('utf8');
      } else if (ArrayBuffer.isView(body)) {
        bodyString = Buffer.from(
          body.buffer,
          body.byteOffset,
          body.byteLength,
        ).toString('utf8');
      } else {
        throw new Error(`Unsupported S3 object body type: ${typeof body}`);
      }

      mediaJson = JSON.parse(bodyString);
    } catch (e) {
      console.log('>>> S3 ERR', e);
    }
  }

  return mediaJson;
}

// @dsp func-461463fd
export async function downloadS3ObjectToFile(params: {
  s3: AWS.S3;
  Bucket: string;
  Key: string;
  targetFilePath: string;
}): Promise<void> {
  const stream = params.s3
    .getObject({ Bucket: params.Bucket, Key: params.Key })
    .createReadStream();

  await pipeline(stream, createWriteStream(params.targetFilePath));
}
