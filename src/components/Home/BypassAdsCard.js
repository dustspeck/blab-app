import React, {useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import * as COLORS from '../../constants/colors';
import * as Constants from '../../constants/misc';

import CTACard from '../Misc/CTACard';

import {hasBypassedAdDays} from '../../sharedMethods/DBManager';
import {ShowRewardAd} from '../../sharedMethods/AdsProvider';

const {height, width} = Dimensions.get('window');

const BypassAdsCard = ({setHasBypassAds, has_bypassads}) => {
  const [seen_ads, setSeenAds] = useState(0);
  const [loading_ad, setLoadingAd] = useState(false);

  const bypassAdAction = async () => {
    setLoadingAd(true);
    ShowRewardAd({
      successAction: () => {
        console.log(seen_ads);
        if (seen_ads >= Constants.BYPASS_ADS_AFTER_ADS - 1) {
          // if (seen_ads > 0) {
          hasBypassedAdDays(true);
          setHasBypassAds(true);
        } else {
          setSeenAds(seen_ads + 1);
        }
        setLoadingAd(false);
      },
      failureAction: () => {
        setLoadingAd(false);
      },
    });
  };

  return (
    <CTACard
      icon={
        loading_ad ? 'time-outline' : has_bypassads ? 'checkmark' : 'rocket'
      }
      text={
        has_bypassads
          ? `REMOVED ADS FOR ${Constants.BYPASS_ADS_FOR_DAYS} DAYS `
          : `REMOVE ADS FOR ${Constants.BYPASS_ADS_FOR_DAYS} DAYS `
      }
      subText={
        has_bypassads
          ? `All ads are disabled. Cheers.`
          : `Earn ${
              Constants.BYPASS_ADS_FOR_DAYS - seen_ads
            } more points in a row to remove ads`
      }
      disabled={loading_ad || has_bypassads}
      action={bypassAdAction}
    />
  );
};

export default BypassAdsCard;
