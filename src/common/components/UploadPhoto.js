import React, {useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const UploadPhoto = props => {
  const [imageModal, setImageModal] = useState(false);
  const [image, setImage] = useState('');

  const takePhotoFromCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,

      ...props.options,
    };
    setImageModal(false);
    setTimeout(async () => {
      const {
        assets: [result],
      } = await launchCamera(options);
      setImage(result);
      props.handleChange(result);
    }, 500);
  };

  const takePhotoFromLibrary = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      ...props.options,
    };
    console.log(options);
    setImageModal(false);
    const {
      assets: [result],
    } = await launchImageLibrary(options);
    setImage(result);
    console.log(result);
    props.handleChange(result);
  };
  const ModalIcons = ({source, title, onPress}) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.modalIcon}>
          <Entypo name={source} size={80} color={'black'} />
        </View>
        <Text style={styles.iconText}>{title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={[!props.renderButton && styles.container, props.ContainerStyle]}>
      {!props.renderButton ? (
        <>
          <View style={props.imageContainer}>
            <Image
              source={
                image
                  ? {uri: image.uri}
                  : props.image
                  ? {uri: props.image}
                  : props.placeholder || {
                      uri: 'https://wtwp.com/wp-content/uploads/2015/06/placeholder-image.png',
                    }
              }
              style={styles.image}
            />
          </View>
          {!props.disabled && (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.iconStyle, props.iconStyle]}
              onPress={() => setImageModal(true)}>
              <Entypo
                name="camera"
                color={props.iconColor || 'black'}
                size={17}
              />
            </TouchableOpacity>
          )}
        </>
      ) : (
        props.renderButton(() => setImageModal(true))
      )}
      <Modal transparent={true} visible={imageModal} animationType="slide">
        <TouchableOpacity
          style={styles.headModalContainer}
          onPress={() => setImageModal(false)}
          activeOpacity={0.6}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeadText}>Choose Picture From</Text>
            <View style={styles.modalIconContainer}>
              <ModalIcons
                source={'image'}
                title="Phone Storage"
                onPress={takePhotoFromLibrary}
              />
              <ModalIcons
                source={'camera'}
                title="Open Camera"
                onPress={takePhotoFromCamera}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UploadPhoto;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  iconStyle: {
    position: 'absolute',
    bottom: 15,
    right: 5,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: 'white',
    borderWidth: 0,
    padding: 5,
  },
  container: {
    alignSelf: 'center',
  },
  headModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    height: '26%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: '5%',
    justifyContent: 'space-between',
  },
  modalHeadText: {
    fontSize: 20,
    marginVertical: '2%',
    marginHorizontal: '2%',
    textAlign: 'center',
  },
  modalIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
