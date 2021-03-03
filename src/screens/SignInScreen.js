import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import Feather from 'react-native-vector-icons/Feather';

import Spacer from '../components/Spacer';

import { validateEmail } from '../validation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignInScreen = ( props ) => {

    const [state, setState] = useState({
        email: '',
        password: ''
    });

    // console.log(props.authData.user.username);

    const [error, setError] = useState({
        errorToDisplay: ''
    });

    async function onSubmit () {
        const emailError = validateEmail(state.email);
        let errorToDisplay = '';
    
        if(emailError) {
            errorToDisplay = emailError;
        }

        if (errorToDisplay) {
            setError({ errorToDisplay });
        }
        else {
            try {
                const user = await Auth.signIn(state.email, state.password);
                setError({ errorToDisplay: '' });
                props.onStateChange( 'signedIn', user );
                console.log("Successfully signed in!");
            } catch(error) {
                Alert.alert(error.message);
            };
        }
    };

    if (props.authState === 'signIn') {
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image 
                        style={styles.logo}
                        source={require('../images/logoWithoutBackground.png')}
                    />
                </View>
                <Text style={styles.signInHeader}>Welcome.</Text>
                <Text style={styles.signInHeader2}>Sign in to continue!</Text>
                <View style={styles.inputBucket}>
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
                    <Spacer 
                        space={5} 
                    />
                    <Button 
                        title='Sign in'
                        buttonStyle={styles.button}
                        onPress={() => onSubmit()}
                    />
                    <Spacer 
                        space={15} 
                    />
                    <TouchableOpacity onPress={ () => props.onStateChange('forgotPassword', {}) } >
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <Spacer 
                        space={15} 
                    />
                    <View style={styles.errorContainer}>
                        {error && error.errorToDisplay ? <Feather name="alert-triangle" color="#00ffff" size={25}/> : null}
                        {error && error.errorToDisplay ? <Text style={styles.error}>{error.errorToDisplay}</Text> : null}
                    </View>
                </View>
                <Spacer 
                    space={5} 
                />
                <View style={styles.footer}>
                    <View style={styles.links}>
                        <Text style={styles.noAccountYet}>Don't have an account yet? </Text>
                        <TouchableOpacity onPress={ () => props.onStateChange('signUp', {}) } >
                            <Text style={styles.signUpLink}>Sign up</Text>
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
        backgroundColor: '#23272a',
        flex: 1,
        width: windowWidth,
        height: windowHeight
    },
    logo: {
        height: 200,
        width: 200,
    },
    logoContainer: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    signInHeader: {
        fontSize: 30,
        color: '#DE3163',
        marginLeft: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    signInHeader2: {
        fontSize: 20,
        color: '#DE3163',
        marginLeft: 20,
        alignSelf: 'center'
    },
    inputBucket: {
        marginVertical: 50
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
    forgotPassword: {
        color: '#DE3163',
        fontSize: 18,
        alignSelf:'center'
    },
    links: {
        marginHorizontal: 20,
        flexDirection: 'row'
    },
    footer: {
        justifyContent: 'flex-end',
        alignSelf: 'center',
        flex: 1,
        marginBottom: 30
    },
    noAccountYet: {
        color: 'white',
        fontSize: 18
    },
    signUpLink: {
        fontSize: 18,
        color: '#DE3163',
        textDecorationLine: 'underline'
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

export default SignInScreen;