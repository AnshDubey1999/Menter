import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';

import Spacer from '../components/Spacer';

import { validateEmail, validateCode } from '../validation';

import { Auth } from 'aws-amplify';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ConfirmSignUpScreen = ( props ) => {

    const [state, setState] = useState({
        email: '',
        code: '',
    });

    const [error, setError] = useState({
        errorToDisplay: ''
    });

    async function onSubmit () {
        const emailError = validateEmail(state.email);
        const codeError = validateCode(state.code);
        let errorToDisplay = '';

        if(emailError) {
            errorToDisplay = emailError;
        }
        else if(codeError) {
            errorToDisplay = codeError;
        }

        if (errorToDisplay) {
            setError({ errorToDisplay });
        }
        else {
            try {
                const user = await Auth.confirmSignUp( state.email, state.code );
                setError({ errorToDisplay: '' });
                props.onStateChange('signIn');
            } catch(error) {
                Alert.alert(error.message);
            };
        }

    };

    if (props.authState == 'confirmSignUp') {
        return (
            <View style={styles.container} >
                <Text style={styles.confirmSignUpText}>Confirm Sign Up</Text>
                <Input
                    placeholder='Email'
                    placeholderTextColor='white'
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    leftIcon={ <Feather name="mail" color='white' size={30}/> }
                    leftIconContainerStyle={{ marginHorizontal: 10 }}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={ newValue => setState({...state, email: newValue.toLowerCase() }) }
                    value={ state.email }
                />
                <Input 
                    placeholder='Confirmation Code'
                    placeholderTextColor='white'
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    leftIcon={ <Feather name='lock' color='white' size={30}/> }
                    leftIconContainerStyle={{ marginHorizontal: 10 }}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={ newValue => setState({...state, code: newValue }) }
                    value={ state.code }
                />
                <Spacer 
                    space={5} 
                />
                <Button 
                    title='Proceed'
                    buttonStyle={styles.button}
                    onPress={ () => onSubmit() }
                />
                <Spacer space={8}/>
                <View style={styles.links}>
                    <TouchableOpacity onPress={ () => props.onStateChange( 'signUp', {} ) } >
                        <Text style={styles.resendCode}>Back to Sign up</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={ async () => {
                        try {
                            await Auth.resendSignUp(state.email);
                            console.log('code resent successfully');
                        } catch (err) {
                            Alert.alert(err.message);
                        }
                    }} >
                        <Text style={styles.resendCode}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
                <Spacer 
                    space={15}
                />
                <View style={styles.errorContainer}>
                    {error && error.errorToDisplay ? <Feather name="alert-triangle" color="#00ffff" size={25}/> : null}
                    {error && error.errorToDisplay ? <Text style={styles.error}>{error.errorToDisplay}</Text> : null}
                </View>
            </View>
        );
    }
    else {
        return <></>;
    };
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#23272a',
        flex: 1,
        width: windowWidth,
        height: windowHeight
    },
    confirmSignUpText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#DE3163',
        marginLeft: 20,
        marginVertical: 30,
        alignSelf: 'center'
    },
    input: {
        color: 'white'
    },
    inputContainer: {
        borderColor: 'white',
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 10
    },
    button: {
        marginHorizontal: 20, 
        backgroundColor: '#DE3163',
        borderRadius: 20
    },
    resendCode: {
        color: '#DE3163',
        fontSize: 18,
    },
    links: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 25
    },
    error: {
        color: '#00ffff',
        fontSize: 18,
        marginLeft: 10
    },
    errorContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center'
    }
});

export default ConfirmSignUpScreen;