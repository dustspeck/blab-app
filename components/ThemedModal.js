import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {Button} from 'react-native-share';

const ThemedModal = ({visible, heading, text, buttons}) => {
  // let actions = [];
  return (
    <Modal visible={visible} transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        onPress={() => {}}>
        <View flex={1} justifyContent="center">
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
              {heading}
            </Text>
            <Text style={{color: '#eee'}}>{text}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              {buttons &&
                buttons.map((button) => (
                  <Text
                    key={button.text}
                    onPress={button.action}
                    style={{
                      color: '#eee',
                      fontWeight: 'bold',
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      margin: 5,
                      marginTop: 15,
                      padding: 15,
                      paddingBottom: 5,
                    }}>
                    {button.text}
                  </Text>
                ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ThemedModal;
