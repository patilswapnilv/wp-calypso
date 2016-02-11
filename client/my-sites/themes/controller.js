/**
 * External Dependencies
 */
import ReactDom from 'react-dom';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import omit from 'lodash/object/omit';

/**
 * Internal Dependencies
 */
import SingleSiteComponent from 'my-sites/themes/single-site';
import MultiSiteComponent from 'my-sites/themes/multi-site';
import LoggedOutComponent from 'my-sites/themes/logged-out';
import analytics from 'analytics';
import i18n from 'lib/mixins/i18n';
import trackScrollPage from 'lib/track-scroll-page';
import buildTitle from 'lib/screen-title/utils';
import { getAnalyticsData } from './helpers';
import ClientSideEffects from './client-side-effects';

function getProps( context ) {
	const { tier, site_id: siteId } = context.params;

	const title = buildTitle(
		i18n.translate( 'Themes', { textOnly: true } ),
		{ siteID: siteId } );

	const { basePath, analyticsPageTitle } = getAnalyticsData(
		context.path,
		tier,
		siteId
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

	return {
		title,
		tier,
		search: context.query.s,
		trackScrollPage: boundTrackScrollPage,
		runClientAnalytics
	};
}

function createElement( ThemesComponent, Head, store, props ) {
	return(
		<ReduxProvider store={ store }>
			<Head title={ props.title } tier={ props.tier || 'all' }>
				<ThemesComponent { ...omit( props, [ 'title', 'runClientAnalytics' ] ) } />
				<ClientSideEffects>
					{ props.runClientAnalytics }
				</ClientSideEffects>
			</Head>
		</ReduxProvider>
	);
};

export function singleSite( context, next ) {
	console.log( 'singlesite' );
	const Head = require( 'layout/head' );
	const { site_id: siteId } = context.params;
	const props = getProps( context );

	props.key = siteId;
	props.siteId = siteId;

	context.primary = createElement( SingleSiteComponent, Head, context.store, props );
	next();
}

export function multiSite( context, next ) {
	console.log( 'multisite' );
	const Head = require( 'layout/head' );
	const props = getProps( context );

	context.primary = createElement( MultiSiteComponent, Head, context.store, props );
	next();
}

export function loggedOut( context, next ) {
	console.log( 'loggedout' );
	const Head = require( 'my-sites/themes/head' );
	const props = getProps( context );

	context.primary = createElement( LoggedOutComponent, Head, context.store, props );
	next();
}

export function render( context, next ) {
	ReactDom.render(
		context.primary,
		document.getElementById( 'primary' )
	);
	next();
}
