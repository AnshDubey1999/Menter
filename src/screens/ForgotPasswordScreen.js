import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { Auth } from 'aws-amplify';

import Spacer from '../components/Spacer';

import { validateEmail, validatePassword } from '../validation';
import { Alert } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ForgotPasswordScreen = ( props ) => {

    const [state, setState] = useState({
        email: '',
        toCodeState: false,
        code: '',
        newPassword: ''
    });

    const [error, setError] = useState({
        errorToDisplay1: '',
        errorToDisplay2: ''
    });

    async function onSubmitEmail() {
        const emailError = validateEmail(state.email);
        let errorToDisplay1 = '';
    
        if(emailError) {
            errorToDisplay1 = emailError;
        }

        if (errorToDisplay1) {
            setError({ ...error, errorToDisplay1 });
        }
        else { 
            console.log("Sending request!");
            await Auth.forgotPassword(state.email)
            .then(data => {
                setState({...state, toCodeState: true});
                setError({...error, errorToDisplay1: ''});
            })
            .catch(err => Alert.alert(err.message));
        }
    };

    async function onSubmitCode() {
        const passwordError = validatePassword(state.newPassword);
        let errorToDisplay2 = '';
    
        if(passwordError) {
            errorToDisplay2 = passwordError;
        }

        if (errorToDisplay2) {
            setError({ ...error, errorToDisplay2 });
        }
        else { 
            await Auth.forgotPasswordSubmit(state.email, state.code, state.newPassword)
            .then(data => {
                console.log("Sent request successfully!");
                setState({...state, toCodeState: false});
                setError({errorToDisplay1: '', errorToDisplay2: ''})
                props.onStateChange('signIn');
            })
            .catch(err => Alert.alert(err.message));
        }
    };

    if ( props.authState == 'forgotPassword' ) {
        if(!state.toCodeState) {
            return (
                <View style={styles.container}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
                    <Spacer 
                        space={5} 
                    />
                    <Button 
                        title='Proceed'
                        buttonStyle={styles.button}
                        onPress={ () => onSubmitEmail() }
                    />
                    <Spacer 
                        space={15} 
                    />
                    <View style={styles.errorContainer}>
                            {error && error.errorToDisplay1 ? <Feather name="alert-triangle" color="#00ffff" size={25} style={{marginBottom: 15}}/> : null}
                            {error && error.errorToDisplay1 ? <Text style={styles.error}>{error.errorToDisplay1}</Text> : null}
                    </View>
                    <TouchableOpacity onPress={ () => props.onStateChange('signIn', {}) } >
                        <Text style={styles.backToSignIn}>Back to Sign in</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            return(
                <View style={styles.container}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    <Text style={styles.activationText}>An activation code has been sent to your email!</Text>
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
                        disabled={true}
                    />
                    <Input
                        placeholder='Confirmation Code'
                        placeholderTextColor='white'
                        inputStyle={styles.input}
                        inputContainerStyle={styles.inputContainer}
                        leftIcon={ <Feather name="lock" color='white' size={30}/> }
                        leftIconContainerStyle={{ marginHorizontal: 10 }}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={ newValue => setState({...state, code: newValue }) }
                        value={ state.code }
                    />
                    <Input 
                        placeholder='New Password'
                        placeholderTextColor='white'
                        inputStyle={styles.input}
                        inputContainerStyle={styles.inputContainer}
                        leftIcon={ <Feather name='lock' color='white' size={30}/> }
                        leftIconContainerStyle={{ marginHorizontal: 10 }}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={ newValue => setState({...state, newPassword: newValue})}
                        value={ state.newPassword }
                    />
                    <Spacer 
                        space={5} 
                    />
                    <Button 
                        title='Submit'
                        buttonStyle={styles.button}
                        onPress={ () => onSubmitCode() }
                    />
                    <Spacer 
                        space={15} 
                    />
                    <View style={styles.errorContainer}>
                            {error && error.errorToDisplay2 ? <Feather name="alert-triangle" color="#00ffff" size={25} style={{marginBottom: 15}}/> : null}
                            {error && error.errorToDisplay2 ? <Text style={styles.error}>{error.errorToDisplay2}</Text> : null}
                    </View>
                    <TouchableOpacity onPress={ () => props.onStateChange('signIn', {}) } >
                        <Text style={styles.backToSignIn}>Back to Sign in</Text>
                    </TouchableOpacity>
                </View>
            ) 
        }
    }
    else {
        return <></>;
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#23272a',
        flex: 1,
        width: windowWidth,
        height: windowHeight
    },
    forgotPasswordText: {
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
    backToSignIn: {
        color: '#DE3163',
        fontSize: 18,
        alignSelf:'center'
    },
    error: {
        color: '#00ffff',
        fontSize: 18,
        marginLeft: 10,
        marginBottom: 15
    },
    errorContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center'
    },
    activationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00ffff',
        marginHorizontal: 20,
        marginBottom: 30,
        alignSelf: 'center'
    }
});

export default ForgotPasswordScreen;