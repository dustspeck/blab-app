import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as COLORS from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const FloatingOptions = ({
  data,
  isSelection,
  setIsSelection,
  selected,
  setSelected,
  allSelected,
  setAllSelected,
  handleDelete,
  handleToTop,
}) => {
  return (
    <View style={Styles.floatBar}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={Styles.floatButton}
        onPress={handleToTop}>
        <Icon
          name="chevron-up"
          style={{
            flex: 1,
            alignSelf: 'center',
            textAlignVertical: 'center',
            fontSize: 30,
            color: '#aaa',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        style={
          isSelection
            ? {...Styles.floatButton, backgroundColor: '#eee'}
            : Styles.floatButton
        }
        onPress={() => {
          if (isSelection) {
            if (selected.length > 1) {
              Alert.alert(
                'Confirm',
                'Are you sure you want to dismiss the current selection?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      setIsSelection(!isSelection);
                      setSelected([]);
                    },
                  },
                  {text: 'No'},
                ],
              );
            } else {
              setIsSelection(!isSelection);
              setSelected([]);
            }
          } else {
            setIsSelection(!isSelection);
            setSelected([]);
          }
        }}>
        <Icon
          name="checkmark"
          style={
            isSelection
              ? {...Styles.selectionButtonIcon, color: '#222'}
              : Styles.selectionButtonIcon
          }
        />
      </TouchableOpacity>
      {isSelection && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={Styles.floatButton}
          onPress={() => {
            if (allSelected) {
              setSelected([]);
              setAllSelected(false);
            } else {
              let all = [];
              data.forEach((v) => {
                all.push(v.id);
              });
              setSelected(all);
              setAllSelected(true);
            }
          }}>
          <Icon
            name="checkmark-done"
            style={{
              flex: 1,
              alignSelf: 'center',
              textAlignVertical: 'center',
              fontSize: 30,
              color: '#aaa',
            }}
          />
        </TouchableOpacity>
      )}
      {isSelection && selected.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.5}
          style={Styles.floatButton}
          onPress={() => {
            handleDelete();
          }}>
          <Icon
            name="trash"
            style={{
              flex: 1,
              alignSelf: 'center',
              textAlignVertical: 'center',
              fontSize: 30,
              color: '#aaa',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const Styles = StyleSheet.create({
  floatBar: {
    position: 'absolute',
    bottom: width / 25,
    right: width / 25,
    opacity: 0.8,
    flexDirection: 'row-reverse',
    zIndex: 2,
  },
  floatButton: {
    backgroundColor: COLORS.GRAY_30,
    borderRadius: width / 3,
    marginHorizontal: width / 50,
    height: width / 8,
    width: width / 8,
  },
  selectionButtonIcon: {
    flex: 1,
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
    color: '#aaa',
  },
});
export default FloatingOptions;
