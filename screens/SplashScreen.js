import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = props => {
    let [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            AsyncStorage.getItem('user_id').then(value =>
                props.navigation.replace("Authentication")
            );
        }, 5000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 200, resizeMode: 'contain', margin: 30 }}
            />
            <ActivityIndicator
                animating={animating}
                color="#00FF00"
                size="large"
                style={styles.activityIndicator}
            />
        </View>
    );
};
export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});