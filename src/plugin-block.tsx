
/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './block/Edit';
import Save from './block/Save';

registerBlockType('crypto-chart-block/block', {
   title: __('My Block Local', 'crypto-chart-block'),
   edit: Edit,
   save: Save,
});