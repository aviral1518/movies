import * as React from "react";
import { StyleSheet, View, Image, ScrollView, Alert, Modal, TouchableOpacity } from "react-native";

import { connect as realmConnect } from "../realm";
import bind from "../redux/bind";

import Layout from "../constants/Layout";
import Theme, { shadowStyle } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import AppText from "./AppText";
import MoviePopup from "./MoviePopup";

class Movie extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			isFavourite: false,
			open: false,
			data: {
				id: -1,
				title: "",
				genre: "||",
				movieURL: "",
				plotSummary: "",
			},
		};

		this.addFavourite = this.addFavourite.bind(this);
		this.removeFavourite = this.removeFavourite.bind(this);
		this.deleteMovie = this.deleteMovie.bind(this);
		this.editMovie = this.editMovie.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	componentDidMount() {
		this.setState({ isFavourite: this.props.data.isFavourite, data: this.props.data });
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

	addFavourite() {
		const {
			id,
		} = this.props.data;

		this.state.realm.write(() => {
			let movie = this.state.realm.objects("Movie").filtered(`id = ${id}`)[0];
			let user = this.state.realm.objects("User").filtered(`username = "${this.props.user.username}"`)[0];
			user.favourites.push(movie);
			this.setState({ isFavourite: true });
			Alert.alert("Success", "Movie added to favourites successfully");
		});
	}

	removeFavourite() {
		const {
			id,
		} = this.props.data;

		this.state.realm.write(() => {
			let user = this.state.realm.objects("User").filtered(`username = "${this.props.user.username}"`)[0];
			user.favourites = user.favourites.filter(movie => movie.id !== id);
			this.setState({ isFavourite: false });
			Alert.alert("Success", "Movie removed from favourites successfully");
		});
	}

	editMovie(new_movie) {
		const {
			id,
		} = this.props.data;
		new_movie.id = id;
		new_movie.genre = "|" + new_movie.genre.map(item => item.trim()).join("|") + "|";

		this.state.realm.write(() => {
			let movie = this.state.realm.objects("Movie").filtered(`id = ${id}`)[0];
			movie.title = new_movie.title;
			movie.genre = new_movie.genre;
			movie.movieURL = new_movie.movieURL;
			movie.plotSummary = new_movie.plotSummary;
			Alert.alert("Success", "Movie updated successfully");
			this.onClose();
			this.setState({ data: new_movie });
		});
	}

	deleteMovie() {
		Alert.alert("Confirm", "Are you sure to delete this movie?", [
			{ text: "Cancel" },
			{
				text: "Yes",
				onPress: () => {
					const {
						id,
					} = this.props.data;

					this.state.realm.write(() => {
						let movie = this.state.realm.objects("Movie").filtered(`id = ${id}`)[0];
						this.state.realm.delete(movie);
						Alert.alert("Success", "Movie deleted successfully");
						this.onClose();
						this.props.onDelete();
					});
				},
			},
		]);
	}

	onClose() {
		this.setState({ open: false });
	};

	render() {
		const {
			id,
			title,
			genre,
			movieURL,
			plotSummary,
		} = this.state.data;

		const { showFavouriteIcon } = this.props;

		let genreString = genre.split("|");
		genreString = genreString.slice(1);
		genreString.pop();
		genreString = genreString.join(", ");

		const isFavourite = this.state.isFavourite;

		const HeartOutlined = !showFavouriteIcon ? null : (
			<TouchableOpacity onPress={() => this.addFavourite()}>
				<Image
					source={require("../assets/icons/heart-outlined.png")}
					style={[styles.buttonIcon, styles.favouriteButtonIcon]}
				/>
			</TouchableOpacity>
		);

		const HeartFilled = !showFavouriteIcon ? null : (
			<TouchableOpacity onPress={() => this.removeFavourite()}>
				<Image
					source={require("../assets/icons/heart-filled.png")}
					style={[styles.buttonIcon, styles.favouriteButtonIcon]}
				/>
			</TouchableOpacity>
		);

		const EditButton = this.props.user.type !== "ADMIN" ? null : (
			<TouchableOpacity onPress={() => this.setState({ open: true })}>
				<Image
					source={require("../assets/icons/edit.png")}
					style={[styles.buttonIcon, styles.editButtonIcon]}
				/>
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.open}
					onRequestClose={this.onClose.bind(this)}
					onDismiss={this.onClose.bind(this)}
				>
					<MoviePopup
						title="Edit movie"
						onClose={this.onClose}
						titlePlaceholder={title}
						genrePlaceholder={genreString}
						movieURLPlaceholder={movieURL}
						plotSummaryPlaceholder={plotSummary}
						affirmativeButtonLabel="Done"
						affirmativeAction={(movie) => this.editMovie(movie)}
						deleteMovie={() => this.deleteMovie()}
					/>
				</Modal>
			</TouchableOpacity>
		);

		return (
			<View style={styles.container}>
				<View style={styles.movieHeader}>
					<Image source={require("../assets/icons/movie-poster.png")} style={styles.poster}/>
					<View style={styles.information}>
						<View style={styles.titleRow}>
							<AppText style={styles.title} numberOfLines={1}>{title}</AppText>
							{
								isFavourite ? HeartFilled : HeartOutlined
							}
							{EditButton}
						</View>
						<View style={styles.genreContainer}>
							<AppText style={styles.genreLabel}>Genre</AppText>
							<ScrollView horizontal={true}>
								<AppText style={styles.genreText}>{genreString}</AppText>
							</ScrollView>
						</View>
						<View style={styles.horizontalBar}/>
					</View>
				</View>
				<AppText style={styles.description}>{plotSummary}</AppText>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 5 * Layout.ratio,
		paddingBottom: 10 * Layout.ratio,
		paddingHorizontal: 10 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
		backgroundColor: Theme.bright,
		borderRadius: 3 * Layout.ratio,

		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},

	movieHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 12 * Layout.ratio,
	},
	poster: {
		width: 52 * Layout.ratio,
		height: 74 * Layout.ratio,
		borderRadius: 6 * Layout.ratio,
		marginRight: 12 * Layout.ratio,
	},
	information: {
		flex: 1,
		alignSelf: "stretch",
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		flex: 1,
		fontSize: FontSize[18],
		fontWeight: "bold",
		color: Theme.text,
	},
	buttonIcon: {
		marginTop: 4,
		marginLeft: 12 * Layout.ratio,
	},
	favouriteButtonIcon: {
		height: 22 * Layout.ratio,
		width: 22 * 500 / 467 * Layout.ratio,
	},
	editButtonIcon: {
		height: 22 * Layout.ratio,
		width: 22 * 500 / 500 * Layout.ratio,
	},

	genreContainer: {
		marginTop: "auto",
		marginBottom: 4 * Layout.ratio,
	},
	genreLabel: {
		fontSize: FontSize[11],
		fontWeight: "bold",
		color: Theme.dim,
	},
	genreText: {
		fontSize: FontSize[11],
		color: Theme.text,
	},

	horizontalBar: {
		height: 1,
		backgroundColor: Theme.medium,
	},

	description: {
		fontSize: FontSize[14],
		color: Theme.text,
	},
});

export default bind(Movie);