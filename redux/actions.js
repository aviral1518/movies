import { AUTHENTICATE_USER } from "./types";

function authenticateUser(user) {
	return {
		type: AUTHENTICATE_USER,
		user,
	};
}

const actionCreators = {
	authenticateUser,
};

export { actionCreators };