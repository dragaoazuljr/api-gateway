import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {

    logger = new Logger(AwsService.name);

    constructor(
        private readonly _configService: ConfigService
    ) {}

    async uploadArquivo(file: any, _id: string){
        const s3 = new AWS.S3({
            region: this._configService.get('AWS_REGION'),
            accessKeyId: this._configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this._configService.get('AWS_SECRET_ACCESS_KEY')
        })

        const fileExtension = file.originalname.split('.')[1];
        const urlKey = `${_id}.${fileExtension}`
        const params = {
            Body: file.buffer,
            Bucket: this._configService.get('AWS_S3_BUCKET_NAME'),
            Key: urlKey
        }

        const data = s3
                    .putObject(params)
                    .promise()
                    .then(
                        data => ({ url: `https://smartranking-api.s3-sa-east-1.amazonaws.com/${urlKey}` }),
                        err => {
                            this.logger.error(err);
                            return err
                        }
                    )
        return data;
    }

}
