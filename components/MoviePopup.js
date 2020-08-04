import * as React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Ripple from "react-native-material-ripple";

import AppText from "./AppText";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

class InputField extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			style,
			label,
			multiline = false,
			secureTextEntry = false,
			onChangeText,
			placeholder = "",
			value = "",
		} = this.props;

		return (
			<View style={[styles.fieldContainer, style]}>
				<AppText style={styles.fieldLabel}>{label}</AppText>
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={Theme.dim}
					selectionColor={Theme.text + "99"}
					selectTextOnFocus={false}
					returnKeyType="done"
					onChangeText={onChangeText}
					value={value}
					onFocus={() => {
					}}
					onBlur={() => {
					}}
					multiline={multiline}
					secureTextEntry={secureTextEntry}
					style={[styles.field, this.props.multiline ? { fontSize: FontSize[13] } : {}]}
					underlineColorAndroid="transparent"
					allowFontScaling={false}
					disableFullscreenUI={true}
				/>
			</View>
		);
	}
}

const WIDTH = 300 * Layout.ratio;

export default class MoviePopup extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			top: Layout.window.height,
			title: "",
			genre: "",
			movieURL: "",
			plotSummary: "",
		};
	}

	componentDidMount() {
		const {
			titlePlaceholder = "",
			genrePlaceholder = "",
			movieURLPlaceholder = "",
			plotSummaryPlaceholder = "",
		} = this.props;

		this.setState({
			title: titlePlaceholder,
			genre: genrePlaceholder,
			movieURL: movieURLPlaceholder,
			plotSummary: plotSummaryPlaceholder,
		})
	}

	render() {
		const {
			style,
			title,
			onClose,
			deleteMovie,
			affirmativeButtonLabel,
			affirmativeAction,
		} = this.props;

		return (
			<View style={[styles.container, style, { top: this.state.top }]}
			      onLayout={({ nativeEvent: { layout: { height } } }) => {
				      const top = (Layout.window.height - height) / 2;
				      if (top !== this.state.top) this.setState({ top });
			      }}
			>
				<View style={styles.header}>
					<AppText style={styles.title}>{title}</AppText>
					<AppText
						style={styles.cross}
						onPress={onClose}
					>&times;</AppText>
				</View>
				<View style={styles.fields}>
					<InputField
						label="Title"
						placeholder="Name of the movie"
						onChangeText={text => this.setState({ title: text })} value={this.state.title}
					/>
					<InputField
						label="Genre (comma separated)"
						placeholder="action, horror, ..."
						onChangeText={text => this.setState({ genre: text })} value={this.state.genre}
					/>
					<InputField
						label="Movie URL"
						placeholder="Link to the movie"
						onChangeText={text => this.setState({ movieURL: text })} value={this.state.movieURL}
					/>
					<InputField
						label="Plot summary"
						placeholder="Description of the plot"
						multiline={true}
						secureTextEntry={false}
						onChangeText={text => this.setState({ plotSummary: text })} value={this.state.plotSummary}
					/>
				</View>
				{
					deleteMovie &&
					<AppText
						style={styles.deleteButtonLabel}
						onPress={deleteMovie}
					>
						Delete this movie
					</AppText>
				}
				<View style={styles.footer}>
					<AppText
						style={styles.negativeButtonLabel}
						onPress={onClose}
					>
						Cancel
					</AppText>
					<AppText
						style={styles.affirmativeButtonLabel}
						onPress={() => affirmativeAction({
							title: this.state.title,
							genre: this.state.genre.split(","),
							movieURL: this.state.movieURL,
							plotSummary: this.state.plotSummary,
						})}
					>
						{affirmativeButtonLabel}
					</AppText>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		left: (Layout.window.width - WIDTH) / 2,
		width: WIDTH,
		padding: 10 * Layout.ratio,
		backgroundColor: Theme.bright,
		borderRadius: 2 * Layout.ratio,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.22,
		shadowRadius: 24,
		elevation: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15 * Layout.ratio,
	},
	title: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: Theme.text,
	},
	cross: {
		marginLeft: "auto",
		fontSize: FontSize[24],
	},

	fields: {},
	fieldContainer: {
		marginBottom: 12 * Layout.ratio,
	},
	fieldLabel: {
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: Theme.dim,
		marginLeft: 8 * Layout.ratio,
	},
	field: {
		alignSelf: "stretch",
		fontSize: FontSize[16],
		color: Theme.text,
		paddingBottom: 5 * Layout.ratio,
		borderBottomWidth: 1,
		borderBottomColor: Theme.dim,
		textAlignVertical: "top",
	},

	deleteButtonLabel: {
		fontSize: FontSize[11],
		fontWeight: "bold",
		color: Theme.danger,
		marginBottom: 14 * Layout.ratio,
		marginLeft: "auto",
		marginRight: "auto",
	},

	footer: {
		flexDirection: "row",
		marginTop: 8 * Layout.ratio,
	},
	negativeButtonLabel: {
		fontSize: FontSize[13],
		color: Theme.dim,
	},
	affirmativeButtonLabel: {
		marginLeft: "auto",
		fontSize: FontSize[13],
		color: Theme.primary,
	},
});