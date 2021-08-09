import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { io } from 'socket.io-client';
export default function App() {
  const [socket, setsocket] = React.useState(io('ws://localhost:8900'))
  const [msgs, setmsgs] = React.useState([])
  const [newmsgs, setnewmsgs] = React.useState('')
  React.useEffect(() => {
    socket.emit("addUser", Math.random());
    socket.on('rcv-msg', (msgs) => {
      setmsgs(msgs)
    })
    console.log(socket)
  }, [])
  const handleOnpress = (e) => {
    e.preventDefault()
    console.log(socket)
    socket.emit('newMsg', [...msgs, newmsgs])
    setmsgs([...msgs, newmsgs])
  }


  return (
    <View style={styles.container}>
      <TextInput
        multiline={true}
        numberOfLines={10}
        value={msgs.map((line) => {
          return line + '\n'
        })}
        placeholder='Your Messages Go Here'
        style={styles.textArea}
      />
      <TextInput
        value={newmsgs}
        onChangeText={(text) => setnewmsgs(text)}
        placeholder='Enter Your Message here'
        style={styles.textArea}
      />
      <Button title='Send' onPress={handleOnpress} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    borderWidth: 1,
    width: '90%',
    borderRadius: 15,
    padding: 5,
    marginBottom: 10,
  },
});
