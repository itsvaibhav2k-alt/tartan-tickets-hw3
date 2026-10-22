import {fileURLToPath} from 'node:url';
export default {
 outputFileTracingRoot: fileURLToPath(new URL('.',import.meta.url)),
 async headers() {
  return [{source:'/:path*',headers:[
   {key:'X-Content-Type-Options',value:'nosniff'},
   {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
   {key:'X-Frame-Options',value:'DENY'},
   {key:'Strict-Transport-Security',value:'max-age=31536000'}
  ]}];
 }
};
