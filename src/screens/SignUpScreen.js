import React,  { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';

import Spacer from '../components/Spacer';

import { validateEmail, validatePassword } from '../validation';

import { Auth } from 'aws-amplify';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUpScreen = ( props ) => {

    const [state, setState] = useState({
        email: '',
        password: '',
    });

    // console.log(props.authData.user.username);

    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState({
        errorToDisplay: ''
    });

    async function onSubmit () {
        const emailError = validateEmail(state.email);
        const passwordError = validatePassword(state.password);
        const confirmPasswordError = state.password === confirmPassword ? "" : "The passwords don't match.";
        let errorToDisplay = '';
    
        if(emailError) {
            errorToDisplay = emailError;
        }
        else if(passwordError) {
            errorToDisplay = passwordError;
        } 
        else if(confirmPasswordError) {
            errorToDisplay = confirmPasswordError;
        }

        if (errorToDisplay) {
            setError({ errorToDisplay });
        }
        else {
            try {
                const user = await Auth.signUp({
                    username: state.email,
                    password: state.password,
                });
                setError({ errorToDisplay: '' });
                props.onStateChange( 'confirmSignUp', user );
            } catch(error) {
                Alert.alert(error.message);
            };
        }
    };

    if (props.authState === 'signUp') {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image 
                        style={styles.logo}
                        source={require('../images/logoWithoutBackground.png')}
                    />
                </View>
                <Text style={styles.signUpHeader}>Create Account.</Text>
                <Text style={styles.signUpHeader2}>Sign up to get started!</Text>
                <View style={styles.inputBucket} >
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
                        placeholder='Password'
                        placeholderTextColor='white'
                        inputStyle={styles.input}
                        inputContainerStyle={styles.inputContainer}
                        leftIcon={ <Feather name='lock' color='white' size={30}/> }
                        leftIconContainerStyle={{ marginHorizontal: 10 }}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={ newValue => setState({...state, password: newValue})}
                        value={ state.password }
                    />
                    <Input 
                        placeholder='Confirm Password'
                        placeholderTextColor='white'
                        inputStyle={styles.input}
                        inputContainerStyle={styles.inputContainer}
                        leftIcon={ <Feather name='lock' color='white' size={30}/> }
                        leftIconContainerStyle={{ marginHorizontal: 10 }}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={ newValue => setConfirmPassword(newValue)}
                        value={confirmPassword}
                    />
                    <Spacer 
                        space={5} 
                    />
                    <Button 
                        title='Sign up'
                        buttonStyle={styles.button}
                        onPress={ () => onSubmit() }
                    />
                    <Spacer 
                        space={10} 
                    />
                    <TouchableOpacity onPress={ () => props.onStateChange('confirmSignUp', {}) } >
                        <Text style={styles.confirmCode}>Confirm code</Text>
                    </TouchableOpacity>
                    <Spacer 
                        space={15}
                    />
                    <View style={styles.errorContainer}>
                        {error && error.errorToDisplay ? <Feather name="alert-triangle" color="#00ffff" size={25}/> : null}
                        {error && error.errorToDisplay ? <Text style={styles.error}>{error.errorToDisplay}</Text> : null}
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.links}>
                        <Text style={styles.alreadyHaveAccount}>Already have an account? </Text>
                        <TouchableOpacity onPress={ () => props.onStateChange('signIn', {}) } >
                            <Text style={styles.signInLink}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    else {
        return <></>;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: '#23272a'
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
    links: {
        marginHorizontal: 20,
        flexDirection: 'row'
    },
    button: {
        marginHorizontal: 20, 
        backgroundColor: '#DE3163',
        borderRadius: 20
    },
    logo: {
        height: 200,
        width: 200,
    },
    logoContainer: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    inputBucket: {
        marginTop: 50
    },
    signUpHeader: {
        fontSize: 30,
        color: '#DE3163',
        marginLeft: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    signUpHeader2: {
        fontSize: 20,
        color: '#DE3163',
        marginLeft: 20,
        alignSelf: 'center'
    },
    alreadyHaveAccount: {
        color: 'white',
        fontSize: 18
    },
    signInLink: {
        fontSize: 18,
        color: '#DE3163',
        textDecorationLine: 'underline'
    },
    footer: {
        justifyContent: 'flex-end',
        alignSelf: 'center',
        flex: 1,
        marginBottom: 10
    },
    confirmCode: {
        color: '#DE3163',
        fontSize: 18,
        alignSelf:'center'
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

export default SignUpScreen;

