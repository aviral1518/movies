import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

import AppText from "./AppText";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

export default class InputField extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			style,
			label,
			secureTextEntry = false,
			onChangeText,
			placeholder = "",
			value = "",
		} = this.props;

		return (
			<View style={style}>
				<AppText style={styles.label}>{label}</AppText>
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={Theme.dim}
					returnKeyType="done"
					selectionColor={Theme.text + "99"}
					selectTextOnFocus={false}
					onFocus={() => {
					}}
					onBlur={() => {
					}}
					style={styles.field}
					onChangeText={onChangeText}
					value={value}
					secureTextEntry={secureTextEntry}
					underlineColorAndroid="transparent"
					allowFontScaling={false}
					disableFullscreenUI={true}
				/>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	label: {
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: Theme.dim,
		marginLeft: 8 * Layout.ratio,
		marginBottom: 4 * Layout.ratio,
	},
	field: {
		alignSelf: "stretch",
		height: 50 * Layout.ratio,
		borderRadius: 8 * Layout.ratio,
		paddingHorizontal: 8 * Layout.ratio,
		fontSize: FontSize[16],
		color: Theme.text,
		backgroundColor: Theme.medium,
	},
});

const verify = {
	name: (text) => {
		text = text.trim();
		let error = "";
		if (text === "") error = "Name cannot be empty!";
		if (text.length < 4) error = "Name must be at least 4 characters long.";
		else if (!RegExp(/^[a-zA-Z .]+$/).test(text)) {
			error = "Name must contain only uppercase(A-Z) or lowercase(a-z) English letters, space " +
			        "character(\" \") or full-stop character(\".\").";
		}
		return {
			text,
			error,
		};
	},
	username: (text) => {
		text = text.trim();
		let error = "";
		if (text === "") error = "Username cannot be empty!";
		else if (!RegExp(/^[a-zA-Z0-9_]+$/).test(text)) {
			error = "Username must contain only uppercase(A-Z) or lowercase(a-z) English alphabets, digits(0-9) or " +
			       "underscore character(\"_\").";
		}
		return {
			text,
			error,
		};
	},
	password: (text) => {
		let error = "";
		if (text === "") error = "Password cannot be empty!";
		else if (text.length < 6) error = "Password must be at least 6 characters long.";
		return {
			text,
			error,
		};
	},
};

export { verify };