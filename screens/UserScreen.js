import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions, StyleSheet } from "react-native";

import Layout from '../constants/Layout';
import Theme  from '../constants/Theme';
import FontSize from '../constants/FontSize';

import MoviesScreen from "./MoviesScreen";
import FavouritesScreen from "./FavouritesScreen";
import AppText from "../components/AppText";

const Tab = createMaterialTopTabNavigator();

export default function UserScreen({ navigation, route }) {
	return (
		<Tab.Navigator
			tabBarPosition="top"
			tabBarOptions={{
				showIcon: false,
				showLabel: true,
				activeTintColor: Theme.bright,
				inactiveTintColor: Theme.dim,
				style: styles.tabBar,
				tabStyle: {},
				indicatorStyle: styles.indicator,
				labelStyle: styles.tabBarLabel,
				allowFontScaling: false,
			}}
			initialRouteName="Signup"
			backBehavior="none"
			lazy={false}
			keyboardDismissMode="auto"
			swipeEnabled={true}
			initialLayout={{ width: Dimensions.get("window").width }}
		>
			<Tab.Screen
				name="Movies" component={MoviesScreen}
				options={{tabBarLabel: ({focused, color}) => (
					<AppText style={[styles.tabBarLabel, focused ? styles.focusedTabBarLabel : {}]}>Movies</AppText>
				)}}
			/>
			<Tab.Screen
				name="Favourites" component={FavouritesScreen}
				options={{ tabBarLabel: ({focused, color}) => (
					<AppText style={[styles.tabBarLabel, focused ? styles.focusedTabBarLabel : {}]}>Favourites</AppText>
				)}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		height: 46 * Layout.ratio,
		backgroundColor: Theme.primary,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4,
		shadowRadius: 4,
		elevation: 4,
	},
	tabBarLabel: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: Theme.dim,
	},
	focusedTabBarLabel: {
		color: Theme.bright,
	},
	indicator: {
		borderTopLeftRadius: 5 * Layout.ratio,
		borderTopRightRadius: 5 * Layout.ratio,
		backgroundColor: Theme.bright,
	},
});