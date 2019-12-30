import Vue from 'vue'
import App from './App.vue'
import 'aws-sdk/lib/node_loader'; // Hack needed before the first import
import { config } from 'aws-sdk/lib/core'; // or any other `aws-sdk` export
// import S3 from 'aws-sdk/clients/s3';


import Rekognition from 'aws-sdk/clients/rekognition'

import AWS from "aws-sdk";


var albumBucketName = "ADDBUCKETNAME";
var bucketRegion = "eu-west-1";
var IdentityPoolId = "ADDIDENTITYPOOLID";
// const signedUrlExpireSeconds = 60 * 5
config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  }),

});
var rekognition = new Rekognition({
  region: 'eu-west-1',
  apiVersion: '2016-06-27'
});

let s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName }
});
// console.log(getDropzone('brad.jpg'));
// console.log(res);
window.s3 = s3;
window.rekognition = rekognition

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
