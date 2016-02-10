/**
 * External Dependencies
 */
var ReactDom = require( 'react-dom' ),
	React = require( 'react' ),
	ReduxProvider = require( 'react-redux' ).Provider;

/**
 * Internal Dependencies
 */
var SingleSiteComponent = require( 'my-sites/themes/single-site' ),
	MultiSiteComponent = require( 'my-sites/themes/multi-site' ),
	LoggedOutComponent = require( 'my-sites/themes/logged-out' ),
	analytics = require( 'analytics' ),
	i18n = require( 'lib/mixins/i18n' ),
	trackScrollPage = require( 'lib/track-scroll-page' ),
	getCurrentUser = require( 'state/current-user/selectors' ).getCurrentUser,
	buildTitle = require( 'lib/screen-title/utils' ),
	getAnalyticsData = require( './helpers' ).getAnalyticsData,
	ClientSideEffects = require( './client-side-effects' );

var controller = {

	themes: function( context ) {
		const { tier, site_id } = context.params;
		const user = getCurrentUser( context.store.getState() );
		const title = buildTitle(
			i18n.translate( 'Themes', { textOnly: true } ),
			{ siteID: site_id } );
		const Head = user
			? require( 'layout/head' )
			: require( 'my-sites/themes/head' );

		let ThemesComponent;

		if ( user ) {
			ThemesComponent = site_id ? SingleSiteComponent : MultiSiteComponent;
		} else {
			ThemesComponent = LoggedOutComponent;
		}

		const { basePath, analyticsPageTitle } = getAnalyticsData(
			context.path,
			tier,
			site_id
		);

		const runClientAnalytics = function() {
			analytics.pageView.record( basePath, analyticsPageTitle );
		};

		const boundTrackScrollPage = function() {
			trackScrollPage(
				basePath,
				analyticsPageTitle,
				'Themes'
			);
		};

		ReactDom.render(
			<ReduxProvider store={ context.store }>
				<Head title={ title } tier={ tier || 'all' }>
					<ThemesComponent
						key={ site_id }
						siteId={ site_id }
						tier={ tier }
						search={ context.query.s }
						trackScrollPage={ boundTrackScrollPage } />
					<ClientSideEffects>
						{ runClientAnalytics }
					</ClientSideEffects>
				</Head>
			</ReduxProvider>,
			document.getElementById( 'primary' )
		);
	}
};

module.exports = controller;
