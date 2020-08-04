import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { connect as realmConnect } from "../realm";
import bind from "../redux/bind";

import Layout from "../constants/Layout";
import Theme from '../constants/Theme';
import FontSize from "../constants/FontSize";

import User from '../components/User';

class UsersScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			users: [],
		};
	}

	componentDidMount() {
		realmConnect(realm => {
			this.setState({ realm });
			this.fetchUsers();
		});
	}

	componentWillUnmount() {
		const { realm } = this.state;
		if (realm !== null && !realm.isClosed) {
			realm.close();
		}
	}

	fetchUsers() {
		let users = this.state.realm.objects("User").filtered(`type = "USER"`);
		this.setState({ users });
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView
					contentContainerStyle={{
						paddingTop: Layout.screenVerticalOffset,
						paddingHorizontal: Layout.screenHorizontalOffset,
						flex: 1,
					}}
				>
					{
						this.state.users.map(user => (
							<User
								key={`user${user.username}`}
								data={user}
								onDelete={() => {
									realmConnect(realm => {
										this.setState({ realm });
										this.fetchUsers();
									});
								}}
							/>
						))
					}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.medium,
		paddingVertical: Layout.screenVerticalOffset,
	},
});

export default bind(UsersScreen);