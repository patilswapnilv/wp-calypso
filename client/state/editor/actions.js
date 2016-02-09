/**
 * Internal dependencies
 */
import { EDITOR_POST_EDIT } from 'state/action-types';

export function editPost( post, siteId, postId ) {
	return {
		type: EDITOR_POST_EDIT,
		post,
		siteId,
		postId
	};
}
