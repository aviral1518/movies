import * as React from 'react';
import { StyleSheet, View, Image, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';

import { connect as realmConnect } from "../realm";
import bind from "../redux/bind";

import Layout from "../constants/Layout";
import Theme, { shadowStyle } from '../constants/Theme';
import FontSize from "../constants/FontSize";

import AppText from "./AppText";
import MoviePopup from "./MoviePopup";

class Movie extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			status: "UNBLOCKED",
		};

		this.deleteUser = this.deleteUser.bind(this);
	}

	componentDidMount() {
		this.setState({ status: this.props.data.status });
		realmConnect(realm => {
			this.setState({ realm });
		});
	}

	componentWillUnmount() {
		const { realm } = this.state;
		if (realm !== null && !realm.isClosed) {
			realm.close();
		}
	}

	blockUser() {
		Alert.alert("Confirm", "Are you sure to block this user?", [
			{ text: "Cancel" },
			{
				text: "Yes", onPress: () => {
				const {
					username,
				} = this.props.data;

				this.state.realm.write(() => {
					let user = this.state.realm.objects("User").filtered(`username = "${username}"`)[0];
					user.status = "BLOCKED";
					Alert.alert("Success", "User blocked successfully");
					this.setState({status: "BLOCKED"});
				});
			}
			},
		]);
	}

	unblockUser() {
		Alert.alert("Confirm", "Are you sure to unblock this user?", [
			{ text: "Cancel" },
			{
				text: "Yes", onPress: () => {
				const {
					username,
				} = this.props.data;

				this.state.realm.write(() => {
					let user = this.state.realm.objects("User").filtered(`username = "${username}"`)[0];
					user.status = "UNBLOCKED";
					Alert.alert("Success", "User unblocked successfully");
					this.setState({ status: "UNBLOCKED" });
				});
			}
			},
		]);
	}

	deleteUser() {
		Alert.alert("Confirm", "Are you sure to delete this user?", [
			{text: "Cancel"},
			{text: "Yes", onPress: () => {
				const {
					username,
				} = this.props.data;

				this.state.realm.write(() => {
					let user = this.state.realm.objects("User").filtered(`username = "${username}"`)[0];
					this.state.realm.delete(user);
					Alert.alert("Success", "User deleted successfully");
					this.props.onDelete();
				});
			}},
		]);
	}

	render() {
		const {
			name,
			username,
			status,
		} = this.props.data;

		return (
			<View style={styles.container}>
				<View style={styles.left}>
					<AppText style={styles.name}>{name}</AppText>
					<AppText style={styles.username}>@{username}</AppText>
				</View>
				<View style={styles.right}>
					<AppText
						style={styles.block}
						onPress={() => {
							this.state.status === "BLOCKED" ? this.unblockUser() : this.blockUser()
						}}
					>{
						this.state.status === "BLOCKED" ? "Unblock" : "Block"
					}</AppText>
					<AppText style={styles.del} onPress={() => this.deleteUser()}>Delete</AppText>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10 * Layout.ratio,
		paddingHorizontal: 16 * Layout.ratio,
		marginBottom: 10 * Layout.ratio,
		backgroundColor: Theme.bright,
		borderRadius: 3 * Layout.ratio,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},

	left: {
		flex: 1,
	},
	right: {
		alignItems: "flex-end",
	},

	name: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: Theme.text,
	},
	username: {
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: Theme.dim,
	},
	block: {
		fontSize: FontSize[13],
		fontWeight: "bold",
		color: Theme.dimmer,
	},
	del: {
		marginTop: "auto",
		fontSize: FontSize[13],
		fontWeight: "bold",
		color: Theme.danger,
	},
});

export default bind(Movie);