/**
 * External dependencies
 */
var page = require( 'page' );

/**
 * Internal dependencies
 */
var config = require( 'config' ),
	user = require( 'lib/user' )(),
	controller = require( 'my-sites/controller' ),
	themesController = require( './controller' );

const isLoggedIn = !! user.get();
const routes = isLoggedIn
	? {
		'/design*': [ controller.navigation, controller.siteSelection ],
		'/design': [ themesController.multiSite, themesController.render ],
		'/design/:siteId': [ themesController.singleSite, themesController.render ],
		'/design/type/:tier': [ themesController.multiSite, themesController.render ],
		'/design/type/:tier/:siteId': [ themesController.singleSite, themesController.render ],

	}
	: {
		'/design': [ themesController.loggedOut, themesController.render ],
		'/design/type/:tier': [ themesController.loggedOut, themesController.render ]
	};
// TODO: Append 'themes/' routes that are the same for both logged in and out:
//'themes': [ themesController.something ]
//'/theme/:name': [ themesController.details ]

module.exports = function() {
	if ( config.isEnabled( 'manage/themes' ) ) {
		// Does iterating over Object.keys preserve order? If it doesn't, use lodash's mapValues
		Object.keys( routes ).forEach( route => {
			page( route, ...routes[ route ] );
		} )
	}
};
