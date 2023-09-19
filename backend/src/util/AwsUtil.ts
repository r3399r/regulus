import { S3 } from 'aws-sdk';
import { fromBuffer } from 'file-type';
import { inject, injectable } from 'inversify';

/**
 * Utility class for Aws
 */
@injectable()
export class AwsUtil {
  @inject(S3)
  private readonly s3!: S3;

  public getS3SignedUrl(uri: string) {
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    return this.s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: uri,
    });
  }

  public async s3Upload(data: string, filename: string) {
    const buffer = Buffer.from(data, 'base64');
    const res = await fromBuffer(buffer);
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;
    const key = `${filename}.${res?.ext}`;

    await this.s3
      .putObject({
        Body: buffer,
        Bucket: bucket,
        Key: key,
      })
      .promise();

    return key;
  }

  public async listS3Objects(prefix?: string) {
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    return await this.s3
      .listObjects({
        Bucket: bucket,
        Prefix: prefix,
      })
      .promise();
  }

  public async deleteS3Objects(key: string[]) {
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    return await this.s3
      .deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects: key.map((v) => ({ Key: v })),
        },
      })
      .promise();
  }
}
