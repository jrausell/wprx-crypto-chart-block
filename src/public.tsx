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
 * WordPress dependencies
 */
import { render } from "@wordpress/element";
import { __ } from '@wordpress/i18n';


import './public.scss';

const elements = document.getElementsByClassName( 'crypto-chart-block-wrap' );
console.log( elements )

for ( let i = 0; i < elements.length; i++ ) {
   console.log( 'elements', elements[ i ].dataset );
   const coins = elements[ i ].dataset.coins;
   const dates = elements[ i ].dataset.dates;
   const showTitle = elements[ i ].dataset.showTitle || false;
   const vscoin = elements[ i ].dataset.vscoin ?? 'usd';

	render( <CryptoChartBlock coins={coins} dates={dates} vscoin={vscoin} showTitle={showTitle} />, elements[ i ] );
}


/**
 * the chart in frontend
 */
export default function CryptoChartBlock({
   coins,
   dates,
   vscoin,
   showTitle
}) {

   coins = JSON.parse(coins);
   dates = JSON.parse(dates);

   //title hiden

   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: 'top' as const,
         },
         title: {
            display: false,
            text: coins.map(coin => coin.coin.charAt(0).toUpperCase() + coin.coin.slice(1)).join(' Vs ') + ' Vs ' + vscoin.toUpperCase(),
         },
      },
   };

   const labels = dates;

   const datasets = coins.map(coin => {
      if (coin) return {
         label: coin.coin,
         data: coin.prices,
         borderColor: coin.color,
         backgroundColor: coin.bgcolor
      }
   }) || [];

   return <Line options={options} data={{ labels, datasets }} />;
}