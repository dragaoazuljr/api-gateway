global.crypto = require('crypto');
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { AuthLoginUsuarioDto } from "src/auth/dtos/auth-login-usuario.dto";
import { AuthRegistroUsuarioDto } from "src/auth/dtos/auth-registro-usuario";

@Injectable()
export class AwsCognitoService {

    private userPool: CognitoUserPool
    
    constructor(
        configService: ConfigService
    ) {
        let userPoolId: string = configService.get<string>('COGNITO_USER_POOL_ID');
        let clientId: string = configService.get<string>('COGNITO_CLIENT_ID');
        let region: string = configService.get<string>('AWS_REGION_US_VIRGINIA');
        let authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

        this.userPool = new CognitoUserPool({
            ClientId: clientId,
            UserPoolId: userPoolId,
        })
    }


    async registrarUsuario(authRegistroUsuarioDto: AuthRegistroUsuarioDto){
        const { email, nome, senha, telefoneCelular } = authRegistroUsuarioDto
    
        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                senha, 
                [
                    new CognitoUserAttribute({ Name: 'phone_number', Value: telefoneCelular}),
                    new CognitoUserAttribute({ Name: 'name', Value: nome})
                ], 
                null,
                ((err, result) => {
                    if(!result){
                        reject(err);
                    }else {
                        resolve(result.user);
                    }
                })
            )
        })
    }

    async autenticarUsuario (authLoginUsuario: AuthLoginUsuarioDto){
        const { email, senha } = authLoginUsuario;

        const userData = {
            Username: email,
            Pool: this.userPool
        }
        
        const authenticationDetail = new AuthenticationDetails({
            Username: email,
            Password: senha
        })
        
        const userCognito = new CognitoUser(userData);

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticationDetail, {
                onSuccess: (result) => resolve(result),
                onFailure: (err) => reject(err)
            })
        })
    }    
}
