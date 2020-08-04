import * as Realm from "realm";
import userSchema from "./userSchema";
import movieSchema from "./movieSchema";

function connect(cb) {
	Realm.open({
		schema: [userSchema, movieSchema],
		schemaVersion: 2,
	}).then(realm => {
		cb(realm);
	});
}

export { connect };