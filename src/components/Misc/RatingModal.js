import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Linking,
  Alert,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as COLORS from '../../constants/colors';
import * as Constants from '../../constants/misc';

import {hasRated} from '../../sharedMethods/DBManager';

const {width, height} = Dimensions.get('window');

const RatingModal = ({showMenu, setShowMenu}) => {
  const [star, setStar] = useState(5);

  const handleSubmitReview = async () => {
    await hasRated(true);
    if (star > 3) {
      Linking.canOpenURL('https://play.google.com').then((supperted) => {
        if (supperted) {
          Linking.openURL(
            `https://play.google.com/store/apps/details?id=${Constants.PSID}`,
          );
        }
      });
    } else {
      ToastAndroid.show(
        `Thank you for your valuable feedback! We're constantly improving.`,
        ToastAndroid.LONG,
      );
    }
    setShowMenu(!showMenu);
  };
  return (
    <Modal
      animationType="slide"
      visible={showMenu}
      transparent={true}
      onRequestClose={() => {
        setShowMenu(!showMenu);
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View style={Styles.reviewTray}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setShowMenu(!showMenu);
            }}
            style={Styles.closeButton}>
            <Icon name="close" style={{fontSize: width / 12, color: '#666'}} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: width / 22,
                fontWeight: 'bold',
                color: '#ddd',
              }}>
              DID YOU LIKE THE APP?
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 5,
            }}>
            <Text
              style={{
                fontSize: width / 28,
                color: '#ddd',
              }}>
              Tell others what you think about this app.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              margin: width / 20,
            }}>
            <RateStar point={1} star={star} setStar={setStar} />
            <RateStar point={2} star={star} setStar={setStar} />
            <RateStar point={3} star={star} setStar={setStar} />
            <RateStar point={4} star={star} setStar={setStar} />
            <RateStar point={5} star={star} setStar={setStar} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={Styles.playButton}
              onPress={() => {
                handleSubmitReview();
              }}>
              <Text style={Styles.playButtonText}>SUBMIT REVIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const RateStar = ({point, star, setStar}) => (
  <Icon
    name="star"
    onPress={() => {
      setStar(point);
    }}
    style={{
      fontSize: star >= point ? width / 10 : width / 12,
      color: star < point ? COLORS.DIS_PRIMARY_COLOR : COLORS[`RATE_${star}`],
    }}
  />
);

const Styles = StyleSheet.create({
  reviewTray: {
    backgroundColor: COLORS.GRAY_25,
    position: 'absolute',
    bottom: 0,
    height: width / 1.25,
    width: width,
    borderTopLeftRadius: width / 16,
    borderTopRightRadius: width / 16,
  },
  playButton: {
    width: width / 2,
    height: width / 10,
    backgroundColor: '#048243',
    borderRadius: width / 36,
  },
  playButtonText: {
    fontSize: width / 24,
    fontWeight: 'bold',
    color: '#ccc',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  closeButton: {
    height: width / 12,
    width: width / 12,
    marginTop: width / 48,
    marginLeft: (width * 43) / 48,
  },
});

export default RatingModal;
