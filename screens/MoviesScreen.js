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

class MoviesScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			movies: [],
			filters: []
		};
	}

	componentDidMount() {
		const navigation = this.props.navigation;
		this._unsubscribe = navigation.addListener("focus", e => {
			realmConnect(realm => {
				this.setState({ realm });
				this.fetchMovies(this.state.filters);
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

	fetchMovies(filters) {
		let filterString = filters.map(filter => `genre CONTAINS "|${filter}|"`).join(" OR ");
		let movies;
		if (filterString) movies = this.state.realm.objects("Movie").filtered(filterString);
		else movies = this.state.realm.objects("Movie");
		const user = this.state.realm.objects("User").filtered(`username = "${this.props.user.username}"`)[0];
		const favourites = user.favourites;
		movies = movies.map(movie => {
			const newMovie = movie;
			newMovie.isFavourite = favourites.some(favMovie => favMovie.id === movie.id);
			return newMovie;
		});
		this.setState({movies});
	}

	render() {
		return (
			<View style={styles.container}>
				<Filters
					style={styles.filtersContainer}
					onSelect={filter => {
						const filters = this.state.filters.slice();
						filters.push(filter);
						this.setState({filters});
						this.fetchMovies(filters);
					}}
					onUnselect={filter => {
						let filters = this.state.filters.slice();
						filters = filters.filter(item => item !== filter);
						this.setState({ filters });
						this.fetchMovies(filters);
					}}
				/>
				<ScrollView
					contentContainerStyle={{
						paddingTop: 4 * Layout.ratio,
						paddingHorizontal: Layout.screenHorizontalOffset,
						flex: 1,
					}}
				>
					{
						this.state.movies.map(movie => (
							<Movie
								key={`movie${movie.id}`}
								data={movie}
								showFavouriteIcon
								onDelete={() => {
									realmConnect(realm => {
										this.setState({ realm });
										this.fetchMovies(this.state.filters);
									});
								}}
							/>))
					}
				</ScrollView>
				<FAB
					style={{
						position: "absolute",
						bottom: 50 * Layout.ratio,
						right: 30 * Layout.ratio,
					}}
					onAdd={() => {
						realmConnect(realm => {
							this.setState({ realm });
							this.fetchMovies(this.state.filters);
						});
					}}
				/>
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

export default bind(MoviesScreen);