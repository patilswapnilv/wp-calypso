/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { link, meta, title, unreadCount } from '../reducer';
import {
	DOCUMENT_HEAD_LINK_SET,
	DOCUMENT_HEAD_META_SET,
	DOCUMENT_HEAD_TITLE_SET,
	DOCUMENT_HEAD_UNREAD_COUNT_SET,
} from 'state/action-types';

describe( 'reducer', () => {
	describe( '#title()', () => {
		test( 'should default to an empty string', () => {
			const state = title( undefined, {} );

			expect( state ).to.equal( '' );
		} );

		test( 'should properly set a new title', () => {
			const newState = title( undefined, { type: DOCUMENT_HEAD_TITLE_SET, title: 'new title' } );

			expect( newState ).to.equal( 'new title' );
		} );
	} );

	describe( '#unreadCount()', () => {
		test( 'should default to a zero', () => {
			const state = unreadCount( undefined, {} );

			expect( state ).to.equal( 0 );
		} );

		test( 'should properly set a new unread count', () => {
			const newState = unreadCount( undefined, {
				type: DOCUMENT_HEAD_UNREAD_COUNT_SET,
				count: 123,
			} );

			expect( newState ).to.equal( 123 );
		} );
	} );

	describe( '#meta()', () => {
		test( 'should default to "og:site_name" set to "WordPress.com" array', () => {
			const state = meta( undefined, {} );

			expect( state ).to.eql( [ { property: 'og:site_name', content: 'WordPress.com' } ] );
		} );

		test( 'should set a new meta tag', () => {
			const state = deepFreeze( [ { content: 'some content', type: 'some type' } ] );
			const newState = meta( state, {
				type: DOCUMENT_HEAD_META_SET,
				meta: [
					{
						content: 'another content',
						type: 'another type',
					},
				],
			} );

			const expectedState = [ { content: 'another content', type: 'another type' } ];

			expect( newState ).to.eql( expectedState );
		} );
	} );

	describe( '#link()', () => {
		test( 'should default to an empty array', () => {
			const state = link( undefined, {} );

			expect( state ).to.eql( [] );
		} );

		test( 'should set a new link tag', () => {
			const state = deepFreeze( [ { rel: 'some-rel', href: 'https://wordpress.org' } ] );
			const newState = link( state, {
				type: DOCUMENT_HEAD_LINK_SET,
				link: [
					{
						rel: 'another-rel',
						href: 'https://automattic.com',
					},
				],
			} );

			const expectedState = [ { rel: 'another-rel', href: 'https://automattic.com' } ];

			expect( newState ).to.eql( expectedState );
		} );
	} );
} );
