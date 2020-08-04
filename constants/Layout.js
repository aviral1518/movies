import { Dimensions } from "react-native";

const ratio = 1;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
	ratio,
	window: {
		width,
		height,
	},
	tabBar: {
		titleBarOffset: 16 * ratio,
		tabBarOffset: 12 * ratio,
		tabBarHeight: 44 * ratio,
		IndicatorHeight: 3 * ratio,
		IndicatorBorderRadius: 5 * ratio,
	},
	screenHorizontalOffset: 16 * ratio,
	screenVerticalOffset: 20 * ratio,
};
