import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    
    signUp(){
        return {message: 'I am registered'};
    }

    signIn(){
        return {message: 'I am signed in'};
    }
}