/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { EDITOR_POST_EDIT } from 'state/action-types';

function posts( state = {}, action ) {
	switch ( action.type ) {
		case EDITOR_POST_EDIT:
			const { post, siteId, postId = '' } = action;
			state = Object.assign( {}, state, {
				[ siteId ]: Object.assign( {}, state[ siteId ] )
			} );

			state[ siteId ][ postId ] = Object.assign( {}, state[ siteId ][ postId ], post );
			return state;
	}

	return state;
}

export default combineReducers( {
	posts
} );
