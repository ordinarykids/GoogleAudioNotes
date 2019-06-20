/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Tip: Sign In should not happen in the Default Welcome Intent, instead
 * later in the conversation.
 * See `Action discovery` docs:
 * https://developers.google.com/actions/discovery/implicit#action_discovery
 */

'use strict';

const {dialogflow, SignIn, MediaObject, Image} = require('actions-on-google');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
admin.initializeApp();

const auth = admin.auth();
const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

const Fields = {
  COLOR: 'color',
  SEARCHTERMS: 'search_term'
};

const dbs = {
  user: db.collection('user'),
};

const app = dialogflow({
  clientId: process.env.CLIENT_ID,
  debug: true,
});

app.middleware(async (conv) => {
  const {email} = conv.user;
  if (!conv.data.uid && email) {
    try {
      conv.data.uid = (await auth.getUserByEmail(email)).uid;
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e;
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.data.uid = (await auth.createUser({email})).uid;
    }
  }
  if (conv.data.uid) {
    conv.user.ref = dbs.user.doc(conv.data.uid);
  }
});

app.intent('Default Welcome Intent', async (conv) => {
  const {payload} = conv.user.profile;
  const name = payload ? ` ${payload.given_name}` : '';
  conv.ask(`Hi${name}!`);







  // const ssml = '<speak>' +
  //   '<audio src="https://ww2.kqed.org/radio/wp-content/uploads/sites/50/2019/06/SFJailPhones-11k.mp3">your wave file</audio>. ' +
  //   '</speak>';
  // conv.ask(ssml);



  //conv.ask(`I am going to play some audio. Feel free to ask me to stop it and leave a note`);
  //conv.ask(`Hi<audio src="https://ww2.kqed.org/radio/wp-content/uploads/sites/50/2019/06/SFJailPhones-1_01.mp3">your wave file</audio>`);
  
  // conv.ask(new Suggestions('Red', 'Green', 'Blue'));

  // if (conv.user.ref) {
  //   const doc = await conv.user.ref.get();
  //   if (doc.exists) {
  //     const color = doc.data()[Fields.COLOR];
  //     return conv.ask(`Your favorite color was ${color} fool. ` +
  //       'Tell me another color to update it.');
  //   }
  // }

  // conv.ask(`What's your favorite color?`);

  if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
    conv.ask('Sorry, this device does not support audio playback.');
    return;
  }

  //getStuffFromKQED('space');
  
  // conv.ask('This is a media response example.');
  // conv.ask(new SimpleResponse("Here is a funky Jazz tune"));
  // conv.ask(new Suggestions(['suggestion 1', 'suggestion 2']));
  conv.ask(new MediaObject({
    name: 'KQED The Bay cut way down.. and smushed to 11k',
    url: 'https://ww2.kqed.org/radio/wp-content/uploads/sites/50/2019/06/SFJailPhones-11k.mp3',
    description: 'A funky Jazz tune',
    // icon: new Image({
    //   url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
    //   alt: 'Album cover of an ccean view',
    // }),
  }));



});




// async function getStuffFromKQED(param) {
//   const response = await fetch("https://projects-api.kqed.org/posts/news?tag=" + param);
//   const reader = response.body.getReader();
//   let result = await reader.read();
//   let total = 0;

//   while (!result.done) {
//     const value = result.value;
//     total += value.length;
//     console.log('Received chunk', value);
//     // get the next result

//     result = await reader.read();
//   }

//   return total;
// }


// function getStuffFromKQED(param) {
//   return fetch("https://projects-api.kqed.org/posts/news?tag=" + param)
//     .then(response => response.text())
//     .then(text => {
//       console.log(text);
//       let betterData = text.data[0].title;
//       console.log(betterData);
//     }).catch(err => {
//       console.error('fetch failed', err);
//     });
// }

function getStuffFromKQED(param) {
  const searchTerm = param;
  console.log("passed search term is " + searchTerm);
  return fetch('https://projects-api.kqed.org/posts/news?audio=true&tag=' + searchTerm)
  .then(function(response){
      return response.json();
  })
  .then(function(json){
      console.log(json.data[0].attributes.title);
      console.log(json.data[0].attributes.audioUrl);
      return  [json.data[0].attributes.audioUrl,json.data[0].attributes.title];
  });
}



app.intent('searchKQED', async (conv, {search_term}) => {
  conv.data[Fields.SEARCHTERMS] = search_term;
  const thisSearch = search_term;
  console.log("183 searchTerms " + thisSearch)
  const articleData = await getStuffFromKQED(thisSearch);

  conv.ask(`Here is a audio story for you called ${articleData[1]} `)
  conv.ask(new MediaObject({
    name: articleData[1],
    url: articleData[0],
    description: 'A funky Jazz tune',
    // icon: new Image({
    //   url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
    //   alt: 'Album cover of an ccean view',
    // }),
  }));

 
});



app.intent('Play Live Stream', async (conv, {search_term}) => {
  // conv.data[Fields.SEARCHTERMS] = search_term;
  // const thisSearch = search_term;
  // console.log("183 searchTerms " + thisSearch)
  //const articleData = await getStuffFromKQED(thisSearch);

  conv.ask(`Here is the KQED live stream`)
  conv.ask(new MediaObject({
    name: 'KQED Live Stream',
    url: 'https://streams.kqed.org/kqedradio',
    description: 'Morning Edition',
    icon: new Image({
      url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
      alt: 'Album cover of an ccean view',
    }),
  }));

 
});



app.intent('Give Color', async (conv, {color}) => {
  conv.data[Fields.COLOR] = color;

  await getStuffFromKQED('ghost-ship-trial');

  if (conv.user.ref) {
    await conv.user.ref.set({[Fields.COLOR]: color});
    conv.close(`I got ${color} as your favorite color.`);
    return conv.close(`Since you are signed in, I'll remember it next time.`);
  }
  conv.ask(new SignIn(`To save ${color} as your favorite color for next time`));
});

// app.intent('kqedPause', async (conv, {color}) => {
//   conv.ask(`pausing`);   
//   conv.ask('This is a media response example.');
//   conv.ask(new MediaObject({
//     name: 'Jazz in Paris',
//     url: 'https://ww2.kqed.org/radio/wp-content/uploads/sites/50/2019/06/SFJailPhones-11k.mp3',
//     description: 'A funky Jazz tune',
//     icon: new Image({
//       url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
//       alt: 'Album cover of an ccean view',
//   }),
// }));
// });



app.intent('Get Sign In', async (conv, params, signin) => {
  if (signin.status !== 'OK') {
    return conv.close(`Let's try again next time.`);
  }
  const color = conv.data[Fields.COLOR];
  await conv.user.ref.set({[Fields.COLOR]: color});
  conv.close(`I saved ${color} as your favorite color. ` +
    `Since you are signed in, I'll remember it next time.`);
});




app.intent('kqedPause', async (conv, params, signin) => {
    conv.ask(`whats up with this pause. `)
  
  // if (signin.status !== 'OK') {
  //   return conv.close(`Let's try again next time.`);
  // }
  // const color = conv.data[Fields.COLOR];
  // await conv.user.ref.set({[Fields.COLOR]: color});
  // conv.close(`I saved ${color} as your favorite color. ` +
  //   `Since you are signed in, I'll remember it next time.`);
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
