
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
  
    getStuffFromKQED('space');
    
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
  