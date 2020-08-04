import { AUTHENTICATE_USER } from "./types";

const initialState = {
	user: {
		name: "",
		username: "",
		password: "",
		type: "",
		favourites: [],
		status: "",
	},
};

function applyAuthenticateUser(state, user) {
	const {
		name,
		username,
		password,
		type,
		favourites,
	} = user;

	return {
		...state,
		user: {
			name,
			username,
			password,
			type,
			favourites,
		},
	};
}

function reducer(state = initialState, action) {
	switch (action.type) {
		case AUTHENTICATE_USER:
			return applyAuthenticateUser(state, action.user);
		default:
			return state;
	}
}

export default reducer;