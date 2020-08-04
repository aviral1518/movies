import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { connect as realmConnect } from "../realm";
import bind from "../redux/bind";

import Layout from "../constants/Layout";
import Theme from '../constants/Theme';
import FontSize from "../constants/FontSize";

import Filters from '../components/Filters';
import Movie from '../components/Movie';
import FAB from '../components/FAB';

class FavouritesScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			movies: [],
		};
	}

	componentDidMount() {
		const navigation = this.props.navigation;
		this._unsubscribe = navigation.addListener("focus", e => {
			realmConnect(realm => {
				this.setState({ realm });
				this.fetchMovies();
			});
		});
	}

	componentWillUnmount() {
		this._unsubscribe();
		const { realm } = this.state;
		if (realm !== null && !realm.isClosed) {
			realm.close();
		}
	}

	fetchMovies() {
		const user = this.state.realm.objects("User").filtered(`username = "${this.props.user.username}"`)[0];
		let movies = user.favourites;
		const favourites = user.favourites;
		movies = movies.map(movie => {
			const newMovie = movie;
			newMovie.isFavourite = favourites.some(favMovie => favMovie.id === movie.id);
			return newMovie;
		});
		this.setState({ movies });
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView
					contentContainerStyle={{
						paddingTop: 4 * Layout.ratio,
						paddingHorizontal: Layout.screenHorizontalOffset,
						flex: 1,
					}}
				>
					{
						this.state.movies.map(movie => (<Movie key={`movie${movie.id}`} data={movie}/>))
					}
				</ScrollView>
				<FAB style={{
					position: "absolute",
					bottom: 50 * Layout.ratio,
					right: 30 * Layout.ratio,
				}}/>
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

	filtersContainer: {
		marginBottom: 16 * Layout.ratio,
	},
});

export default bind(FavouritesScreen);