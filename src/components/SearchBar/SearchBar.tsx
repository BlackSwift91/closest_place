import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
type SearchBarProps = {
  value: string;
  onChangeHandler: (val: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeHandler }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder="Search"
        placeholderTextColor="gray"
        value={value}
        onChangeText={val => onChangeHandler(val)}
        returnKeyType="search"
        onSubmitEditing={() => console.log('1234')}
      />
      <TouchableOpacity style={styles.clearContainer} onPress={() => onChangeHandler('')}>
        <MaterialCommunityIcons name="close-circle-outline" color={'#000000'} size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'space-between',
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 16,
    // backgroundColor: 'red',
  },
  clearContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 16,
    // backgroundColor: 'green',
    width: 60,
  },
});
