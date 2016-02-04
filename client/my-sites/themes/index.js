/**
 * External dependencies
 */
var page = require( 'page' ),
	transform = require( 'lodash/object/transform' );

/**
 * Internal dependencies
 */
var config = require( 'config' ),
	user = require( 'lib/user' )(),
	controller = require( 'my-sites/controller' ),
	setSection = require( 'state/ui/actions' ).setSection,
	themesController = require( './controller' );

const routing = {
	routes: [
		{ value: '/design/:site_id', enableLoggedOut: false },
		{ value: '/design/type/:tier/:site_id', enableLoggedOut: false },
		{ value: '/design/type/:tier', enableLoggedOut: true },
		{ value: '/design', enableLoggedOut: true },
	],
	middlewares: [
		{ value: ( context, next ) => {
			context.store.dispatch( setSection( 'design', { hasSidebar: !! user, isFullScreen: false } ) );
			next();
		}, enableLoggedOut: true },
		{ value: controller.navigation, enableLoggedOut: false },
		{ value: controller.siteSelection, enableLoggedOut: false },
		{ value: themesController.themes, enableLoggedOut: true },
	]
};

function getRouting( isLoggedIn ) {
	const testKey = isLoggedIn ? 'value' : 'enableLoggedOut';
	return transform( routing, ( acc, collection, collectionName ) => {
		acc[ collectionName ] = collection
			.filter( item => item[ testKey ] )
			.map( item => item.value );
	} );
}

module.exports = function() {
	if ( config.isEnabled( 'manage/themes' ) ) {
		const { routes, middlewares } = getRouting( user.get() );
		routes.forEach( route => page( route, ...middlewares ) );

		page( '/themes/:slug', ( context, next ) => {
			context.store.dispatch( setSection( 'themes', { hasSidebar: false, isFullScreen: true } ) );
			next();
		}, controller.navigation, controller.siteSelection, themesController.details );
	}
};
