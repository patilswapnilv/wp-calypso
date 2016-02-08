/**
 * Internal dependencies
 */
import { isBusiness } from 'lib/products-values';

function emailForwardingPlanLimit( plan ) {
	let planLimit;
	if ( isBusiness( plan ) ) {
		planLimit = 100;
	} else {
		planLimit = 5;
	}

	return planLimit;
}

module.exports = { emailForwardingPlanLimit };
