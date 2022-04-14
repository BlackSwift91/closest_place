import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, Keyboard } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;

type PlaceItemProps = {
  value: string;
  onChangeHandler: (val: string) => void;
};

export const PlaceItem: React.FC<PlaceItemProps> = ({ item, onPressHandler }: any) => {
  return (
    <TouchableNativeFeedback
      onPress={async () => {
        await Keyboard.dismiss();
        onPressHandler(item);
      }}
      background={TouchableNativeFeedback.Ripple('#cccccc', false)}>
      <View style={styles.wrapper}>
        <View style={styles.distanceContainer}>
          <MaterialCommunityIcons name="map-marker" color={'#000000'} size={20} />
          <Text style={styles.distanceText}>{(Number(item.item.distance_meters) / 1000).toFixed(1)} км</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionMainText}>{item.item.structured_formatting.main_text}</Text>
          <Text style={styles.descriptionSecondaryText} numberOfLines={1} ellipsizeMode="tail">
            {item.item.structured_formatting.secondary_text}
          </Text>
        </View>
        <View style={styles.moveIcon}>
          <MaterialCommunityIcons name="arrow-top-left-thick" color={'#000000'} size={24} />
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: windowWidth - 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  distanceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  moveIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceText: {
    color: '#000000',
    fontSize: 12,
  },
  descriptionMainText: {
    fontSize: 14,
    color: '#000000',
  },
  descriptionSecondaryText: {
    fontSize: 12,
    color: '#000000',
  },
});
