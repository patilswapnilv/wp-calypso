/**
 * Internal dependencies
 */
import { getSitePost } from 'state/posts/selectors';

export function getEditedPost( state, siteId, postId ) {
	if ( ! state.editor.posts[ siteId ] ) {
		return null;
	}

	const edits = state.editor.posts[ siteId ][ postId || '' ];
	if ( ! postId ) {
		return edits || null;
	}

	const post = getSitePost( state, siteId, postId );
	return Object.assign( {}, post, edits );
}
