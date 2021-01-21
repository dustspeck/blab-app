import admob, {
  MaxAdContentRating,
  BannerAd,
  TestIds,
  BannerAdSize,
} from '@react-native-firebase/admob';
import {InterstitialAd, AdEventType} from '@react-native-firebase/admob';
import {RewardedAd, RewardedAdEventType} from '@react-native-firebase/admob';

import * as ADS from '../constants/adunits';

exports.ShowInterstitialAd = (props) => {
  if (!props.enabled_ads) {
    // const interstitialAd = InterstitialAd.createForAdRequest(
    //   TestIds.INTERSTITIAL,
    // );
    const interstitialAd = InterstitialAd.createForAdRequest(ADS.Interstitial);
    interstitialAd.onAdEvent((type, error) => {
      console.log('type:', type);
      if (props.enabled_ads) {
        props.postAction();
      } else if (type === AdEventType.LOADED) {
        console.log('type:', type);
        console.log('interstitialAd.show();');
        interstitialAd.show();
      }
      props.postAction();
    });
    interstitialAd.load();
  } else {
    props.postAction();
  }
};

exports.ShowRewardAd = (props) => {
  const rewardAd = RewardedAd.createForAdRequest(ADS.Reward);
  // const rewardAd = RewardedAd.createForAdRequest(TestIds.REWARDED);
  rewardAd.onAdEvent((type, error) => {
    if (type === RewardedAdEventType.LOADED) {
      rewardAd.show();
    }
    if (type === RewardedAdEventType.EARNED_REWARD) {
      console.log('++++++++++REWARDED');
      props.successAction();
    } else {
      console.log('++++++++++FAILED');
      props.failureAction();
    }
  });
  rewardAd.load();
};
