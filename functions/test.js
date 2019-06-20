
'use strict';

const {dialogflow, SignIn, MediaObject, Image} = require('actions-on-google');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dotenv = require('dotenv');
const fetch = require('node-fetch');



function getStuffFromKQED(param) {
    const searchTerm = param;
    return fetch('https://projects-api.kqed.org/posts/news?audio=true&tag=' + searchTerm)
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        console.log(json.data[0].attributes.title);
        console.log(json.data[0].attributes.audioUrl);
    });
    
  }

  
  console.log(getStuffFromKQED('state-budget'));


// fetch('https://projects-api.kqed.org/posts/news?tag=')
// .then(function(response){
//     return response.json();
// })
// .then(function(json){
//     console.log(json);
// });

