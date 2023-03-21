
import './plugin-settings.scss';

/**
 * React dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
//CharJS package
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js'

/**
 * WordPress dependencies
 */
//Gutenberg components
import {
   Button,
   TextControl,
   SelectControl,
   RadioControl,
   FormToggle,
   Icon
} from '@wordpress/components';
//Localization
import { __ } from '@wordpress/i18n';

/**
 * Our libraries
 */
import { getMarketChart, lightenColor } from './utils/utils';
import cryptocoins from "./utils/cryptocoins.json";
import vscoins from "./utils/fiatcoins.json";
//the component to set the coin settions (coin, color)
import CoinSettings from "./components/CoinSettings";

import Edit from './block/Edit';
//Out TS types


/**
 * Code
 */

//The chart
ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);


/**
 * Settings page
 * Render React into the div#id we added with PHP in the settings page
 */
document.addEventListener('DOMContentLoaded', () => {
   const element = document.getElementById('crypto-chart-block-settings');
   if (typeof element == 'undefined' || element == null) return;

   //this string will be translated. 
   //TODO: Try to create a component
   ReactDOM.render(
      <div>
         <h2>{__('Crypto Chart Block', 'crypto-chart-block-settings')}</h2>
         <div style={{ maxWidth: '680px' }}>
            <App />
         </div>
      </div>
      , element);
})

/**
 * Our main component
 */
const App = () => {
   const [isSaving, setIsSaving] = useState(false);
   const [isLoading, setIsLoading] = useState(false);


   /**
    * Return the view rendered
    */
   return <div>
      <div className='bg-white p-10'>
         <p>{__('Add a chart showing the daily market prices from a start date to a end date.', 'crypto-chart-block')}</p>
         <p>{__('The market prices are fetched from CoinGeko free API.', 'crypto-chart-block')}</p>
      </div>

      <h3>{__('Chart Example', 'crypto-chart-block')}</h3>
      <div className='block-editor-block-list__block' style={{ maxWidth: '680px' }}>
         <Edit 
         className={false}
         isSelected={false}
         attributes={[]}
         setAttributes={null} 
         />
      </div>

   </div>
}
