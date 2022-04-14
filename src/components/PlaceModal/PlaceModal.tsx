import React from 'react';
import { Modal, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';

import { IPlaceInfo, IPlace } from '../../API';

const windowWidth = Dimensions.get('window').width;

type PlaceModalProps = {
  place: IPlace;
  info: IPlaceInfo;
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
};

export const PlaceModal: React.FC<PlaceModalProps> = ({ place, info, setModalVisible, modalVisible }) => {
  console.log(info);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity style={styles.centeredView} activeOpacity={1} onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.name}>{info.name}</Text>
              <Text style={styles.adress}>{`${place.item.structured_formatting.secondary_text}`}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: windowWidth - 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 25,
    alignItems: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 30,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  name: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'left',
    color: '#000000',
  },
  adress: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 40,
    color: '#000000',
  },
});
