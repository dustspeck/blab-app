import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';

exports.removeElements = async (items) => {
  try {
    let newData = await AsyncStorage.getItem('db_blabbed_history');
    newData = JSON.parse(newData);
    newData = newData.data;
    let r_pid = null;
    items.forEach((delID) => {
      newData.splice(
        newData.findIndex((v) => {
          if (v.id == delID) {
            r_pid = v.thumbnail;
          }
          return v.id == delID;
        }),
        1,
      );
      console.log(r_pid);
      try {
        RNFS.unlink(`${r_pid}`);
      } catch (err) {
        throw err;
      }
    });
    await AsyncStorage.setItem(
      'db_blabbed_history',
      JSON.stringify({data: newData}),
    );
    return newData;
  } catch (err) {
    console.log(err);
  }
};
