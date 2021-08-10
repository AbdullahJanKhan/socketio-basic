import React from 'react';
import { Text, StyleSheet, TextInput, View } from 'react-native';
import ChatScreen from './chatScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { nanoid } from 'nanoid';

const Stack = createNativeStackNavigator();


export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Home" component={MainScreen} />
                <Stack.Screen name="Chat Room" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


function MainScreen({ navigation }) {

    const [username, setname] = React.useState('');

    const onPressRoom = (room) => {
        if (username.length > 0) {
            navigation.navigate('Chat Room', { username, room })
        } else {
            alert('Enter your name first')
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>Enter User Name</Text>
                <TextInput
                    value={username}
                    onChangeText={setname}
                    placeholder='Enter Name You Want to use'
                    style={styles.textArea}
                />

            </View>
            <Text>Select Any Room You Want To Join</Text>
            <View>
                <Text onPress={() => onPressRoom('english')} style={styles.textRoom}>1. English</Text>
                <Text onPress={() => onPressRoom('urdu')} style={styles.textRoom}>2. Urdu</Text>
                <Text onPress={() => onPressRoom('arabic')} style={styles.textRoom}>3. Arabic</Text>
            </View>
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
    textRoom: {
        borderWidth: 1,
        borderColor: '#566BAE',
        marginBottom: 5,
        padding: 5,
    },
    textArea: {
        borderWidth: 1,
        width: '90%',
        borderRadius: 15,
        padding: 5,
        marginBottom: 10,
    },

});
