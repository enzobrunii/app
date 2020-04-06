import { StyleSheet } from 'react-native';

export const panelStyles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 20,
    paddingBottom: 10,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
});

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    minWidth: 50,
  },
  locationButton: {
    marginTop: 12,
    marginBottom: StyleSheet.hairlineWidth,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  layerButton: {
    marginTop: 0,
    marginBottom: StyleSheet.hairlineWidth,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  infoButton: {
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: '90%',
    marginHorizontal: 'auto',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: 0,
    borderRadius: 8,
  },
  modalTitle: {
    backgroundColor: 'rgba(66, 135, 244, 1)',
    color: 'rgb(255, 255, 255)',
    width: '100%',
    textAlign: 'center',
    lineHeight: 35,
    borderTopEndRadius: 6,
    borderTopStartRadius: 6,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  modalBody: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 10,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderLeftWidth: 1,
    borderLeftColor: 'black',
  },
  modalButtonContainer: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderLeftWidth: 1,
    borderLeftColor: 'black',
  },
  modalButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(66, 135, 244, 1)',
    paddingVertical: 12,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    margin: 10,
    minWidth: 50,
    borderRadius: 10,
  },
});

const CIRCLE_WIDTH = 60;

export const mapInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    // borderWidth: 1,
  },
  counterContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: 1,
    padding: 20,
  },
  circle: {
    width: CIRCLE_WIDTH,
    height: CIRCLE_WIDTH,
    borderRadius: CIRCLE_WIDTH / 2,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positive: {
    backgroundColor: '#79BC6A',
  },
  neutral: {
    backgroundColor: '#EEC20B',
  },
  negative: {
    backgroundColor: '#E50000',
  },
  counter: {
    color: '#FFF',
  },
  text: {
    fontSize: 18,
  },
});
