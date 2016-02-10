/**
 * External Dependencies
 */
import ReactDom from 'react-dom';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

/**
 * Internal Dependencies
 */
import SingleSiteComponent from 'my-sites/themes/single-site';
import MultiSiteComponent from 'my-sites/themes/multi-site';
import LoggedOutComponent from 'my-sites/themes/logged-out';
import analytics from 'analytics';
import i18n from 'lib/mixins/i18n';
import trackScrollPage from 'lib/track-scroll-page';
import { getCurrentUser } from 'state/current-user/selectors';
import buildTitle from 'lib/screen-title/utils';
import { getAnalyticsData } from './helpers';
import ClientSideEffects from './client-side-effects';

export function themes( context ) {
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
