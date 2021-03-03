import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, ConfirmSignIn, ForgotPassword } from 'aws-amplify-react-native';

import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ConfirmSignUpScreen from './src/screens/ConfirmSignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Amplify.configure(awsconfig);

Amplify.configure({ ...awsconfig, 
  Analytics: {
    disabled: true,
} });

console.disableYellowBox=true;

const App = function() {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return(
    <SafeAreaView style={styles.safeContainer}>
        <StatusBar 
          barStyle = 'light-content'
          backgroundColor='#23272a'
        />
        <Authenticator usernameAttributes="email" hideDefault={true} onStateChange={ authState => console.log(authState) } >
          <SignUpScreen />
          <SignInScreen />
          <ConfirmSignUpScreen />
          <ConfirmSignIn />
          <ForgotPasswordScreen />
          <DashboardScreen />
        </Authenticator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex : 1, 
    backgroundColor: '#23272a',
    marginTop: -StatusBar.currentHeight 
  }
});

export default App;

