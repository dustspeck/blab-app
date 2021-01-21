import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';

const SettingsCard = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Modal transparent={true} visible={visible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: null,
              width: '75%',
              borderRadius: 10,
              backgroundColor: '#252525',
              alignSelf: 'center',
              padding: 25,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: '#eee',
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: 10,
              }}>
              Settings
            </Text>
            <Text>Test</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsCard;
