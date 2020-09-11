# Blab for IG
React Native

## Build Notes

after npn i change sdk version in node_modules/react-native-share-menu/android/build.gradle to 28.0.3

blab>
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

delete drawable-* & raw folders from res folder

blab/android>
gradlew assembleRelease 

More:
https://medium.com/@hasangi/making-a-signed-apk-for-your-react-native-application-98e8529678db
