import React from 'react';
import {View, Text, Image, Pressable, Dimensions} from 'react-native';
import SelectorTick from './SelectorTick';

const BlabbedPreview = ({
  navigation,
  item,
  selected,
  setSelected,
  isSelection,
  setIsSelection,
}) => {
  const {width, height} = Dimensions.get('window');
  return (
    <Pressable
      onPress={() => {
        if (isSelection) {
          if (selected.includes(item.id)) {
            setSelected(selected.filter((v) => v !== item.id));
          } else {
            setSelected([...selected, item.id]);
          }
        } else navigation.navigate('ViewScreen', {post_url: item.post_url});
      }}
      onLongPress={() => {
        setIsSelection(true);
        setSelected([...selected, item.id]);
        console.log(selected);
      }}
      style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
      <Image
        style={
          selected.includes(item.id)
            ? {
                opacity: 0.35,
                width: (width * 47) / 150,
                height: (width * 47) / 150,
                backgroundColor: 'black',
                margin: width / 100,
                borderRadius: width / 25,
              }
            : {
                width: (width * 47) / 150,
                height: (width * 47) / 150,
                backgroundColor: 'black',
                margin: width / 100,
                borderRadius: width / 25,
              }
        }
        source={{uri: 'file:///' + item.thumbnail}}
      />
      {isSelection ? <SelectorTick selected={selected} item={item} /> : null}
    </Pressable>
  );
};

export default BlabbedPreview;
