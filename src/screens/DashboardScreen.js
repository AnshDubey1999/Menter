import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import Feather from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DashboardScreen = ( props ) => {
    if(props.authState === 'signedIn') {
        return (
            <View>
                <Button 
                    onPress={ () => props.onStateChange('signIn', {}) }
                    title="Sign out"
                />
            </View>
        )
    }
    else {
        return <></>;
    }
};

const styles = StyleSheet.create({

});

export default DashboardScreen;
