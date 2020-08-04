import * as React from "react";
import { StyleSheet, View, Image, Alert, ScrollView } from "react-native";
import Ripple from "react-native-material-ripple";

import { connect as realmConnect } from "../realm";
import bind from "../redux/bind";

import AppText from "../components/AppText";
import InputField, { verify } from "../components/InputField";

import Layout from "../constants/Layout";
import Theme, { shadowStyle } from "../constants/Theme";
import FontSize from "../constants/FontSize";

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			type: "ADMIN",
			username: "",
			password: "",
		};

		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidMount() {
		realmConnect(realm => this.setState({ realm }));
	}

	componentWillUnmount() {
		const { realm } = this.state;
		if (realm !== null && !realm.isClosed) {
			realm.close();
		}
	}

	handleLogin() {
		const {
			authenticateUser,
		} = this.props;

		let res = verify.username(this.state.username);
		if (res.error) return Alert.alert("Invalid username", res.error);
		const username = res.text;

		res = verify.password(this.state.password);
		if (res.error) return Alert.alert("Invalid password", res.error);
		const typedPassword = res.text;

		let user = this.state.realm.objects("User")
			.filtered(`username = "${this.state.username}" AND type = "${this.state.type}"`);
		if (user.length) {
			const { type, name, favourites, status, password } = user[0];

			if (typedPassword !== password) return Alert.alert("Passwords don't match",
				"Check if the password is typed correctly.");
			if (status === "BLOCKED") return Alert.alert("Account blocked",
				"This account has been blocked by the admin.");

			authenticateUser({
				type,
				name,
				username,
				password,
				favourites,
				status,
			});

			if (type === "ADMIN") this.props.navigation.navigate("AdminScreen");
			else this.props.navigation.navigate("UserScreen");
		}
		else Alert.alert("Invalid User.", "Check if the username or password is typed correctly.");
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.headerContainer}>
						<Image source={require("../assets/images/icon.png")} style={styles.headerIcon} />
						<AppText style={styles.headerText}>Welcome!</AppText>
					</View>
					<View style={styles.formContainer}>
						<View style={styles.accountTypesContainer}>
							<AppText style={styles.accountTypesTitle}>Select an account type</AppText>
							<View style={styles.accountTypesRow}>
								<Ripple
									onPress={() => { this.setState({ type: "ADMIN" }); }}
									onLongPress={() => { }}
									style={[
										styles.accountType,
										this.state.type === "ADMIN" ? styles.selectedAccountType : {},
									]}
									rippleColor={Theme.primary}
									rippleContainerBorderRadius={3 * Layout.ratio}
									rippleCentered={false}
								>
									<AppText style={[
										styles.accountTypeText,
										this.state.type === "ADMIN" ? styles.selectedAccountTypeText : {},
									]}>
										Admin
									</AppText>
								</Ripple>
								<Ripple
									onPress={() => { this.setState({ type: "USER" }); }}
									onLongPress={() => { }}
									style={[
										styles.accountType,
										this.state.type === "USER" ? styles.selectedAccountType : {},
									]}
									rippleColor={Theme.primary}
									rippleContainerBorderRadius={3 * Layout.ratio}
									rippleCentered={false}
								>
									<AppText style={[
										styles.accountTypeText,
										this.state.type === "USER" ? styles.selectedAccountTypeText : {},
									]}>
										User
									</AppText>
								</Ripple>
							</View>
						</View>
						<View style={styles.inputFieldsContainer}>
							<InputField
								label="Username"
								placeholder="Your unique username"
								onChangeText={text => this.setState({ username: text })} value={this.state.username}
								style={styles.inputField}
							/>
							<InputField
								label="Password"
								placeholder="Must be 6+ characters"
								secureTextEntry={true}
								onChangeText={text => this.setState({ password: text })} value={this.state.password}
								style={styles.inputField}
							/>
						</View>
						<Ripple
							onPress={() => this.handleLogin()}
							onLongPress={() => { }}
							style={styles.submitButton}
							rippleColor={Theme.bright}
							rippleContainerBorderRadius={3 * Layout.ratio}
							rippleCentered={false}
						>
							<AppText style={styles.submitButtonText}>Log in</AppText>
						</Ripple>
						<View style={styles.horizontalBar} />
						<View style={styles.footerContainer}>
							<AppText style={styles.footerText}>
								Don’t have an account yet?
							</AppText>
							<AppText
								style={styles.footerLink}
								onPress={() => { this.props.navigation.jumpTo("Signup"); }}
							>
								Signup
							</AppText>
							<Image
								source={require("../assets/icons/chevron.png")}
								style={styles.footerChevron}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.medium,
	},

	headerContainer: {
		alignItems: "center",
		paddingTop: Layout.screenVerticalOffset,
		paddingBottom: 66 * Layout.ratio,
		backgroundColor: Theme.primary,
	},
	headerIcon: {
		height: 70 * Layout.ratio,
		width: 70 * Layout.ratio,
		marginBottom: 10 * Layout.ratio,
	},
	headerText: {
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: Theme.bright,
	},

	formContainer: {
		width: "90%",
		marginLeft: "auto",
		marginRight: "auto",
		paddingTop: 8 * Layout.ratio,
		paddingHorizontal: 16 * Layout.ratio,
		paddingBottom: 12 * Layout.ratio,
		borderRadius: 8 * Layout.ratio,
		backgroundColor: Theme.bright,
		...shadowStyle,
		zIndex: 1,
		top: -35,
	},

	accountTypesContainer: {
		alignItems: "center",
		marginBottom: 16 * Layout.ratio,
	},
	accountTypesTitle: {
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: Theme.dim,
		marginBottom: 8 * Layout.ratio,
	},
	accountTypesRow: {
		height: 30 * Layout.ratio,
		flexDirection: "row",
		alignItems: "stretch",
	},
	accountType: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedAccountType: {
		borderWidth: 1,
		borderColor: Theme.primary,
		borderRadius: 3 * Layout.ratio,
	},
	accountTypeText: {
		fontSize: FontSize[14],
		color: Theme.dim,
	},
	selectedAccountTypeText: {
		color: Theme.primary,
		fontWeight: "bold",
	},

	inputFieldsContainer: {
		marginBottom: 10 * Layout.ratio,
	},
	inputField: {
		marginBottom: 16 * Layout.ratio,
	},

	submitButton: {
		alignItems: "center",
		paddingVertical: 8 * Layout.ratio,
		borderRadius: 3 * Layout.ratio,
		backgroundColor: Theme.primary,
		marginBottom: 16 * Layout.ratio,
	},
	submitButtonText: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: Theme.bright,
	},

	horizontalBar: {
		marginHorizontal: 45 * Layout.ratio,
		height: 1,
		backgroundColor: Theme.medium,
		marginBottom: 12 * Layout.ratio,
	},

	footerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	footerText: {
		fontSize: FontSize[10],
		color: Theme.text,
	},
	footerLink: {
		marginLeft: 4 * Layout.ratio,
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: Theme.primary,
	},
	footerChevron: {
		marginTop: 2.4,
		marginLeft: 1.5,
		height: 10 * Layout.ratio,
		width: 10 * 500 / 700 * Layout.ratio,
	},
});

export default bind(LoginScreen);