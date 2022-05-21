# Blab for IG

<a href='https://github.com/21VAibhavGArg/blab-app/raw/master/dist/apks/app-release-ads-19-01-2021.apk'><img alt="download" src="https://img.shields.io/badge/apk-download-green"></a> <a href='https://github.com/21VAibhavGArg/blab-app/raw/master/dist/apks/app-release-ads-19-01-2021.apk'><img alt="download" src="https://img.shields.io/badge/app-react%20antive-blue"></a>

<img src='/dist/screenshots/featured.png' height='300px'><br/>

Send Public or Private Image or Video Instagram Posts of accounts that you follow with anyone on the internet without downloading.

### Main Features

- Add Private Instagram Posts to your Story
- Share Private Posts/Videos to friends
- Download Private/Public Instagram Posts
- Repost Posts directly with the caption
- Save and Search Instagram Posts with username
  ..more

### Why Blab?

Instagram's Private Account feature helps protect your private posts from being shared amongst the people you would not like to share them with. On the other hand, imagine the mess it creates when you want to share the best meme video you found on a meme page but that account is private. You would want to put the meme video or image on your story and share it among all your friends but sadly you just can not. A few of the options you are left with are, ask your friends to follow that private Instagram account or record the screen if it is a video or take a screenshot if it is an image and share that. Sigh, too much work!

### What does the app do?

That is exactly where BLAB comes into play! Found a private post, either an image or video, which you would like to put on your Instagram story? Or would like to share it in your WhatsApp group? Just Blab it!

### How to use?

Tap on the overflow icon and select "Share to..."
Select "Blab" from the apps list
Select from the different options to share

Sharing and/or Downloading of Private Instagram Posts of the accounts that you follow, will require you to log in to your Instagram account.
Whereas, you can share and download public posts without logging in to your Instagram account.

It takes a maximum of 3-4 taps or 5-6 seconds to Blab a private Instagram Post. When you share an Instagram Post using Blab, we generate a unique link to that post which can be shared on any social media. Using the link, your friends can also view the meme/post without even logging into their Instagram account. For security purposes, the link may also get expired after a few days or weeks of creating it.

## Screenshots

<div>
<img src='/dist/screenshots/tab1.png' height='300px'>
<img src='/dist/screenshots/tab2.png' height='300px'>
<img src='/dist/screenshots/tab3.png' height='300px'>
<img src='/dist/screenshots/tab4.png' height='300px'>
</div>

### Build Notes

- `npm i`
- update SDK version to `28.0.3` in `node_modules/react-native-share-menu/android/build.gradle`
- `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
- delete all `drawable` & `raw` folders from `android/app/src/main/res`
- `cd android`
- `gradlew assembleRelease`
