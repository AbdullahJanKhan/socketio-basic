import React from 'react';
import { Button, StyleSheet, TextInput, View, Text, FlatList, Platform, TouchableHighlight } from 'react-native';
import io from 'socket.io-client';
import { AntDesign } from '@expo/vector-icons';

export default function App({ navigation, route }) {
    const roomname = route.params.room
    const username = route.params.username
    const userId = route.params.userId

    const [socket] = React.useState(io('https://diewithme-13.herokuapp.com/'))
    const [msgs, setmsgs] = React.useState([])
    const [newmsgs, setnewmsgs] = React.useState('')

    // setting header | join room | add user | rcv msg
    React.useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <AntDesign name="stepbackward" size={24} color="black" onPress={() => { socket.emit('leave-room', roomname); navigation.goBack() }} />
            ),
        });
        console.log(socket)

        socket.emit("join-room", roomname);
        socket.emit("addUser", { username, userId, roomname });
        socket.on('rcv-msg', (new_msgs) => {
            console.log(msgs, new_msgs, 'test')
            setmsgs(new_msgs)
        })
        socket.on('newUser', (msgs) => {
            console.log(msgs)
            setmsgs(msgs)
        })
        socket.on('newUserAdded', msg => {
            console.log(msg)
        })
    }, [])
    // typing event
    React.useEffect(() => {
        socket.on('isTyping', (username) => {
            navigation.setOptions({
                headerRight: () => (
                    <Text>{username.length > 0 ? username + ' is Typing...' : ''}</Text>
                ),
            });
        })
    })
    // send message event
    const handleOnpress = (e) => {
        e.preventDefault()
        socket.emit('newMsg', [...msgs, newmsgs], roomname)
        socket.emit('typing', '', roomname)
        setmsgs([...msgs, newmsgs])
        setnewmsgs('')
    }
    // on item press
    const itemPress = (item) => {
        const data = {
            uid: userId,
            lid: item.userId
        }
        console.log(data)
        socket.emit('msgLike', data)
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
                keyExtractor={item => String(item._id)}
                renderItem={({ item, index, separators }) => (
                    <TouchableHighlight
                        onPress={() => itemPress(item)}
                        onShowUnderlay={separators.highlight}
                        onHideUnderlay={separators.unhighlight}>
                        <View style={{ backgroundColor: 'white' }}>
                            <Text>{item.data}</Text>
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
                onChangeText={(text) => {
                    setnewmsgs(text);
                    socket.emit('typing', username, roomname)
                }}
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
