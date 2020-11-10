import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AwsCognitoConfig } from "src/aws/aws-cognito-config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        private authConfig: AwsCognitoConfig
    ) {
        super({
            name: 'jtwStrategy',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            audience: authConfig.clientId, 
            issuer: authConfig.authority,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
            })
        })
    }

    public validate(payload: any) {

        return { idUsuario: payload.sub, email: payload.email }
    }
}