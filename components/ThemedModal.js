import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';

const ThemedModal = ({visible, heading, text, action}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        onPress={() => {}}>
        <View flex={1} justifyContent="center">
          <View
            style={{
              height: null,
              width: '75%',
              borderRadius: 10,
              backgroundColor: 'white',
              alignSelf: 'center',
              padding: 30,
              paddingBottom: 15,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{heading}</Text>
            <Text>{text}</Text>
            <Text
              onPress={action}
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                alignSelf: 'flex-end',
                padding: 10,
                paddingTop: 15,
                paddingBottom: 5,
              }}>
              OK
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ThemedModal;
