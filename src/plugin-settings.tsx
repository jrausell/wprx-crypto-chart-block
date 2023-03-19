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
         <App />
      </div>
      , element);
})

/**
 * Our main component
 */
const App = () => {
   const [isSaving, setIsSaving] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const maxCoins = 3;

   const [showTitle, setShowTitle] = useState<boolean>(false);
   const [coins, setCoins] = useState<Array<any>>([]);
   const [vscoin, setVscoin] = useState('usd');
   const [period, setPeriod] = useState('daily');
   const [steps, setSteps] = useState(30);
   const [cont, setCont] = useState(0);

   const [data, setData] = useState<ChartData<'line'>>();
   const [labels, setLabels] = useState<any>([]);
   const [options, setOptions] = useState<ChartOptions<'line'>>();

   /**
    * Add a new empty coin in the coins array
    */
   function addCoin() {
      coins.push({
         id: Date.now() + cont,
         coin: null,
         prices: [],
         color: '#497bb1',
         bgcolor: lightenColor('#497bb1', 40)
      })
      setCont(cont + 1)
   }

   /**
    * Remove a coin from the coins array using id prop
    */
   function removeCoin(id:string) {
      console.log('removeCoin()', id)
      setCoins(coins.filter(coin => coin.id !== id) || []);
   }

   /**
    * Update a coin in the coins array
    * finds the coin using the id prop and update the rest of props
    */
   function updateCoin(id:string, newCoin:object, newPrices:Array<any>, newLabels:Array<any>, newColor:string) {
      console.log('updateCoin()', id, newCoin, newPrices, newLabels, newColor);
      setCoins(coins.map(coin => {
         if (coin.id !== id) return coin;

         return {
            ...coin,
            coin: newCoin,
            prices: newPrices,
            color: newColor,
            bgcolor: lightenColor(newColor, 40)
         }
      }));

      setLabels(newLabels);

   }

   /**
    * When the coins array change
    * update the "data" State to update the chart
    */
   useEffect(() => {
      if (!coins || !labels) return;

      console.log('Coins effect: ', coins);
      const datasets = coins.map(coin => {
         console.log('setData() dataset coin: ', coin)
         if (coin) return {
            label: coin.coin,
            data: coin.prices,
            borderColor: coin.color,
            backgroundColor: coin.bgcolor
         }
      }) || [];

      setData({
         labels,
         datasets
      });

   }, [coins]);

   /**
    * When showTitle var change update the chart options
    * BUG: title = false don't update the chart
    */
   useEffect(() => {
      setOptions({
         responsive: true,
         plugins: {
            legend: {
               position: 'top' as const,
            },
            title: {
               display: showTitle,
               text: coins.map(coin => coin.coin.charAt(0).toUpperCase() + coin.coin.slice(1)).join(' Vs ') + ' Vs ' + vscoin.toUpperCase(),
            },
         },
      });
   }, [showTitle]);


   /**
    * Return the view rendered
    */
   return <div>
      <div className='flex flex-align-end'>
         <SelectControl
            className=""
            label={__('Title', 'crypto-chart-block')}
            value={showTitle}
            options={[{ label: 'Visible', value: true }, { label: 'Hidden', value: false }]}
            onChange={(newVal: boolean) => setShowTitle(newVal)}
            __nextHasNoMarginBottom
         />

         <SelectControl
            className=""
            label={__('Vs Coin', 'crypto-chart-block')}
            value={vscoin}
            options={vscoins}
            onChange={(newVal:string) => setVscoin(newVal)}
            __nextHasNoMarginBottom
         />

         <SelectControl
            className=""
            label={__('Period', 'crypto-chart-block')}
            value={period}
            options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }]}
            onChange={(newVal:string) => setPeriod(newVal)}
            __nextHasNoMarginBottom
         />

         <SelectControl
            className=""
            label={__('Steps', 'crypto-chart-block')}
            value={steps}
            options={[{ label: '15', value: '15' }, { label: '30', value: '30' }, { label: '90', value: '90' }]}
            onChange={(newVal:number) => setSteps(newVal)}
            __nextHasNoMarginBottom
         />

         {maxCoins > coins.length && <Button variant="secondary" onClick={() => addCoin()}>Add Coin</Button> }
      </div>

      <div>
         {coins && coins.map(coin => {
            //Make sure "coin" exist and this is not reacting before setCoins is updated
            if (coin) return <CoinSettings
               key={coin.id}
               id={coin.id}
               coinElement={coin}
               vscoin={vscoin}
               period={period}
               steps={steps}
               updateCoin={updateCoin}
               removeCoin={removeCoin}
            />
         })}
      </div>

      <div>
         {data && <div style={{ maxWidth: '600px', backgroundColor: '#f2f2f2', padding: '10px' }}>
            <Line options={options} data={data} />
         </div>}
      </div>

   </div>
}

