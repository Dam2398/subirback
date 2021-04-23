import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import config from '../config/config';
export const checkJwt = (req:Request, res: Response, next: NextFunction)=>{
    //console.log('REQ->',req.headers);
    const token= <string> req.headers['auth'];//token sera de tipo string|| Se solicita del header el token
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);//el segundo parametro es la key
        res.locals.jwtPayload = jwtPayload;

    } catch (error) {
        res.status(401).json({msg:"Not Authorized"});
    }

    const {userId, email} = jwtPayload;

    const newToken = jwt.sign({userId, email}, config.jwtSecret, {expiresIn: '1800s'});//TIEMPO||Se genera el token

    res.setHeader('token',newToken);
    //Call next
    next();

}