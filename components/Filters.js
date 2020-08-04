import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';

import Layout from "../constants/Layout";
import Theme from '../constants/Theme';
import FontSize from "../constants/FontSize";

import AppText from '../components/AppText';

class Filter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: false,
		}
	}

	render() {
		const { onSelect, onUnselect } = this.props;

		return (
			<TouchableOpacity
				style={[styles.filter, this.state.selected ? styles.selectedFilter : {}]}
				onPress={() => {
					if (this.state.selected) {
						this.setState({ selected: false });
						onUnselect(this.props.label);
					}
					else {
						this.setState({ selected: true });
						onSelect(this.props.label);
					}
				}}
			>
				<AppText style={[styles.filterText, this.state.selected ? styles.selectedFilterText : {}]}>
					{this.props.label}
				</AppText>
			</TouchableOpacity>
		);
	}
}

export default class Filters extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {onSelect, onUnselect} = this.props;

		return (
			<View style={[styles.filtersContainer, this.props.style]}>
				<AppText style={styles.filtersLabel}>Filter by</AppText>
				<ScrollView horizontal={true}>
					<Filter label="Sci-fi" onSelect={onSelect} onUnselect={onUnselect} />
					<Filter label="Fantasy" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Action" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Comedy" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Horror" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Drama" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Mystery" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Thriller" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Biography" onSelect={onSelect} onUnselect={onUnselect}/>
					<Filter label="Tragedy" onSelect={onSelect} onUnselect={onUnselect}/>
				</ScrollView>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	filtersContainer: {
		flexDirection: "row",
		marginHorizontal: Layout.screenHorizontalOffset,
	},
	filtersLabel: {
		fontSize: FontSize[13],
		fontWeight: "bold",
		color: Theme.text,
		marginRight: 6 * Layout.ratio,
	},
	filter: {
		borderRadius: 2 * Layout.ratio,
		borderWidth: 1,
		borderColor: Theme.dim,
		paddingVertical: 2 * Layout.ratio,
		paddingHorizontal: 6 * Layout.ratio,
		marginRight: 6 * Layout.ratio,
	},
	filterText: {
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: Theme.text,
	},
	selectedFilter: {
		borderColor: Theme.primary,
		backgroundColor: Theme.primary,
	},
	selectedFilterText: {
		color: Theme.bright,
	},
});