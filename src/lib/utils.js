import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';

export const generateJwtToken = async (userId, existingRefreshToken = null) => {
    const accessToken = jwt.sign(
        { userId, iat: Math.floor(Date.now() / 1000) }, 
        process.env.JWT_ACCESS_SECRET, 
        { expiresIn: '30d' }
    );

    let refreshToken = existingRefreshToken; 

    if (!existingRefreshToken) {
        refreshToken = jwt.sign(
            { userId, iat: Math.floor(Date.now() / 1000), jti: userId }, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '30d' }
        );
    }

    return { accessToken, refreshToken };
};

export const setupCors = () => {
    return cors({
        origin:"*",
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
}


export const removeSensitiveData=(data)=>{
    if(Array.isArray(data)){
        return data.map((item)=>{
            const {password, otp, refreshToken, otpExpiresAt,  ...rest}=item;
            return rest;
        })
    }
    const {password, otp, refreshToken, otpExpiresAt,  ...rest}=data;
    return rest;
}



export function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}