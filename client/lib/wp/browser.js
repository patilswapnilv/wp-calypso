/**
 * External dependencies
 */
import debugFactory from 'debug';
const debug = debugFactory( 'calypso:wp' );
import Dispatcher from 'dispatcher';
import wpcomFactory from 'wpcom-unpublished';

/**
 * Internal dependencies
 */
import { actions as ActionTypes } from 'lib/oauth-store/constants';
import wpcomUndocumented from 'lib/wpcom-undocumented';
import config from 'config';
import wpcomSupport from 'lib/wp/support';

let requestHandler,
	wpcom;

if ( config.isEnabled( 'oauth' ) ) {
	const oauthToken = require( 'lib/oauth-token' );
	requestHandler = require( 'lib/wpcom-xhr-wrapper' );

	wpcom = wpcomUndocumented( oauthToken.getToken(), requestHandler );
} else {
	const requestHandler = require( 'wpcom-proxy-request' );

	wpcom = wpcomUndocumented( requestHandler );

	// Upgrade to "access all users blogs" mode
	wpcom.request( {
		metaAPI: { accessAllUsersBlogs: true }
	}, function( error ) {
		if ( error ) {
			throw error;
		}
		debug( 'Proxy now running in "access all user\'s blogs" mode' );
	} );
}

if ( config.isEnabled( 'support-user' ) ) {
	wpcom = wpcomSupport( wpcom );
}

/**
 * Expose `wpcom`
 */
module.exports = wpcom;
