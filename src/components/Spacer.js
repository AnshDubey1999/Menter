import React from 'react';
import { View, StyleSheet } from 'react-native';

const Spacer = ( props ) => {
    return(
        <View style={{ marginVertical: props.space }}>
        </View>
    );
}

export default Spacer;