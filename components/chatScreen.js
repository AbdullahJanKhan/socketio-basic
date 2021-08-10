import React from 'react';
import { Button, StyleSheet, TextInput, View, Text, FlatList, Platform, TouchableHighlight } from 'react-native';
import { io } from 'socket.io-client';
import { nanoid } from 'nanoid';


export default function App({ navigation, route }) {
    const roomname = route.params.room
    const username = route.params.username
    const userId = nanoid(10)

    const [socket] = React.useState(io('ws://localhost:8900'))
    const [msgs, setmsgs] = React.useState([])
    const [newmsgs, setnewmsgs] = React.useState('')
    React.useEffect(() => {
        socket.emit("join-room", roomname);
        socket.emit("addUser", { username, userId, roomname });
        socket.on('rcv-msg', (new_msgs) => {
            console.log(msgs, new_msgs)
            setmsgs(new_msgs)
        })
    }, [])
    const handleOnpress = (e) => {
        e.preventDefault()
        socket.emit('newMsg', [...msgs, newmsgs], roomname)
        setmsgs([...msgs, newmsgs])
        setnewmsgs('')
    }


    return (
        <View style={styles.container}>
            <Text>Welcome, to {roomname.toUpperCase()} Room</Text>
            <FlatList
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({ highlighted }) => (
                        <View
                            style={[
                                styles.separator,
                                highlighted && { marginLeft: 0 }
                            ]}
                        />
                    ))
                }
                data={msgs}
                renderItem={({ item, index, separators }) => (
                    <TouchableHighlight
                        key={index}
                        onPress={() => console.log(item, ' is pressed')}
                        onShowUnderlay={separators.highlight}
                        onHideUnderlay={separators.unhighlight}>
                        <View style={{ backgroundColor: 'white' }}>
                            <Text>{item}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            />
            {
                // <TextInput
                // multiline={true}
                // numberOfLines={10}
                // value={msgs.map((word) => {
                //     return word + '\n'
                // })}
                // placeholder='Your Messages Go Here'
                // style={styles.textArea}
                // />
            }
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
    separator: {
        borderWidth: 1,
        borderColor: 'green'
    },
});
