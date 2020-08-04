import * as React from "react";
import { StyleSheet, Image, Modal, Alert } from "react-native";
import Ripple from "react-native-material-ripple";

import { connect as realmConnect } from "../realm";
import bind from "../redux/bind";
import MoviePopup from "./MoviePopup";

import Layout from "../constants/Layout";
import Theme, { shadowStyle } from "../constants/Theme";
import FontSize from "../constants/FontSize";

const SIZE = 56;

class FAB extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			open: false,
		};

		this.onClose = this.onClose.bind(this);
		this.addMovie = this.addMovie.bind(this);
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

	onClose() {
		this.setState({ open: false });
	};

	addMovie(movie) {
		let movies = this.state.realm.objects("Movie");
		movie.genre = "|" + movie.genre.map(item => item.trim()).join("|") + "|";
		movie.id = movies.length + 1;

		try {
			this.state.realm.write(() => {
				this.state.realm.create("Movie", movie);
				this.onClose();
				Alert.alert("Success", "Movie added successfully!");
				this.props.onAdd();
			});
		}
		catch (e) {
			console.log(e);
			Alert.alert("Error on creation", "An unknown problem occurred while trying to add the movie in database");
		}


	}

	render() {
		const { user } = this.props;

		if (user.type !== "ADMIN") return null;

		return (
			<Ripple
				onPress={() => {
					this.setState({ open: true });
				}}
				style={[styles.button, this.props.style]}
				rippleColor={Theme.bright}
				rippleContainerBorderRadius={SIZE / 2}
				rippleCentered={true}
			>
				<Image source={require("../assets/icons/add.png")} style={{ width: 20, height: 20, }}/>
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.open}
					onRequestClose={this.onClose.bind(this)}
					onDismiss={this.onClose.bind(this)}
				>
					<MoviePopup
						title="Add a movie"
						onClose={this.onClose}
						affirmativeButtonLabel="Add"
						affirmativeAction={(movie) => this.addMovie(movie)}
					/>
				</Modal>
			</Ripple>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		height: SIZE * Layout.ratio,
		width: SIZE * Layout.ratio,
		borderRadius: SIZE / 2 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Theme.bright,
		...shadowStyle,
	},
});

export default bind(FAB);