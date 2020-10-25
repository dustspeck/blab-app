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

exports.startupCounter = async () => {
  try {
    let new_data = {value: 1};
    let previous_data = await AsyncStorage.getItem('startup_count');
    if (previous_data) {
      previous_data = JSON.parse(previous_data);
      let previous_value = previous_data.value;
      new_data = {value: previous_value + 1};
    }
    await AsyncStorage.setItem('startup_count', JSON.stringify(new_data));
    return new_data.value;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.hasRated = async (done = false) => {
  try {
    let has_rated = done;
    let db_hasrated = await AsyncStorage.getItem('has_rated');
    if (JSON.parse(db_hasrated) && !has_rated) {
      has_rated = db_hasrated;
    } else {
      await AsyncStorage.setItem('has_rated', JSON.stringify(has_rated));
    }
    return has_rated;
  } catch (error) {
    return null;
  }
};
