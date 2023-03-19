
/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './block/Edit';
import Save from './block/Save';

import './plugin-block.scss';

registerBlockType('crypto-chart-block/editor', {
   title: 'Crypto Chart Block',
   category: 'common',
   textdomain: 'crypto-chart-block',
   supports: {
      multiple: true, // Use the block just once per post
      reusable: true, // Don't allow the block to be converted into a reusable block.
   },
   attributes: {
      vscoin: {
         type: "string",
         default: "usd"
      },
      coins: {
         type: "string",
         default: "[]"
      },
      dateFrom: {
         type: "string",
         default: ""
      },
      dateTo: {
         type: "string",
         default: ""
      },
      dates: {
         type: "string",
         default: "[]"
      },
      period: {
         type: "string",
         default: "daily"
      },
      steps: {
         type: "number",
         default: 30
      },
      showTitle: {
         type: "boolean",
         default: false
      }
   },
   edit: Edit,
   save: Save,
});
