import {View, Text, StyleSheet, Modal, Button} from 'react-native';

const GarmentModal = ({modalVisible, closeModal}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Garment</Text>
          <Text style={styles.modalText}>
            Choose an option to upload your garment.
          </Text>
          <Button title="Close" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

export default GarmentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  uploadContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#EDE7F6",
  },
  placeholderText: {
    marginTop: 8,
    color: "#000000",
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
