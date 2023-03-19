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
 * Wordpress
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import {
   Button,
   TextControl,
   SelectControl,
   RadioControl,
   FormToggle,
   DatePicker,
   Icon
} from '@wordpress/components';

/**
 * Our libraries
 */
import { getMarketChart, lightenColor } from '../utils/utils';
import cryptocoins from "../utils/cryptocoins.json";
import vscoins from "../utils/fiatcoins.json";
//the component to set the coin settions (coin, color)
import CoinSettings from "../components/CoinSettings";
//Out TS types

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
 * Code
 */
export default function Edit({
   className,
   isSelected,
   attributes,
   setAttributes
}) {

   const [isSaving, setIsSaving] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   const maxCoins = 3;
   const [cont, setCont] = useState(0);

   const currentDate = new Date();
   const currentDateTime = currentDate.getTime();
   const last30DaysDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
   const last30DaysDateTime = last30DaysDate.getTime();
   const [openDatePickerFrom, setOpenDatePickerFrom] = useState(false);
   const [openDatePickerTo, setOpenDatePickerTo] = useState(false);

   const [vscoin, setVscoin] = useState(attributes.vscoin || 'usd');
   const [period, setPeriod] = useState(attributes.period || 'daily');
   const [steps, setSteps] = useState(attributes.steps || 30);
   const [dateFrom, setDateFrom] = useState(attributes.dateFrom || last30DaysDateTime);
   const [dateTo, setDateTo] = useState(attributes.dateTo || currentDateTime);
   const [showTitle, setShowTitle] = useState<boolean>(attributes.showTitle || false);

   const [labels, setLabels] = useState<any>(JSON.parse(attributes.dates) || []);
   const [data, setData] = useState<ChartData<'line'>>();
   const [options, setOptions] = useState<ChartOptions<'line'>>();

   const [coins, setCoins] = useState<Array<any>>(JSON.parse(attributes.coins) || []);

   const colors = [
      '#497bb1',
      '#b06748',
      '#92b048',
      '#cfc74c'
   ]

   /**
    * Add a new empty coin in the coins array
    */
   function addCoin() {
      const color = colors.find(color => { 
         if(
            !coins.find(coin => { 
               if( coin.color == color ) return true; 
            })
         ) return color;
      }) || '#49abb1';
      
      coins.push({
         id: Date.now() + cont,
         coin: '',
         prices: [],
         color,
         bgcolor: lightenColor(color, 40)
      })
      setCont(cont + 1)

      console.log('Added coin', coins, labels)
   }

   /**
    * Remove a coin from the coins array using id prop
    */
   function removeCoin(id: string) {
      console.log('removeCoin()', id)
      setCoins(coins.filter(coin => coin.id !== id) || []);
   }

   /**
    * Update a coin in the coins array
    * finds the coin using the id prop and update the rest of props
    */
   function updateCoin(id: string, newCoin: object, newPrices: Array<any>, newLabels: Array<any>, newColor: string) {
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


   //load arrays and jsons on mount
   useEffect(() => {
      console.log('MOUNT Edit', attributes, data)

      setIsLoading(false);
   }, [])


   /**
    * When showTitle var change update the chart options
    * BUG: title = false don't update the chart
    */
   useEffect(() => {
      //if(isLoading) return;

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
    * When the coins array change
    * update the "data" State to update the chart
    */
   useEffect(() => {
      //if(isLoading) return;
      if (!coins || !labels) return;

      generateChartData()

   }, [coins]);

   function generateChartData(){

      console.log('generateChartData() ', coins);
      const datasets = coins.map(coin => {
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

      //console.log('useEffect COINS', data)

   }

   
   /**
    * Update Block Attributes on any change
    */
   useEffect(() => {
      if(isLoading) return;
      saveAllBlockAttributes();
   }, [showTitle, period, steps, vscoin, data]);

   function saveAllBlockAttributes(){

      // vscoin: {
      //    type: "string",
      //    default: "usd"
      // },
      setAttributes({vscoin: vscoin});
      // coins: {
      //    type: "string",
      //    default: "[]",
      // },
      setAttributes({coins: JSON.stringify(coins)});
      // dateFrom: {
      //    type: "string",
      //    default: "",
      // },
      setAttributes({dateFrom: dateFrom});
      // dateTo: {
      //    type: "string",
      //    default: "",
      // },
      setAttributes({dateTo: dateTo});
      // dates: {
      //    type: "string",
      //    default: "[]",
      // },
      setAttributes({dates: JSON.stringify(labels)});
      // period: {
      //    type: "string",
      //    default: "daily",
      // },
      setAttributes({period: period});
      // steps: {
      //    type: "number",
      //    default: 30,
      // },
      setAttributes({steps: parseInt(steps)});
      // showTitle: {
      //    type: "boolean",
      //    default: false,
      // }
      setAttributes({showTitle: Boolean(showTitle)});

      //console.log('BLOCK ATTR: ', attributes)

   }


   return (
      <div {...useBlockProps()}>
         <div className='wrap p-10' style={{ backgroundColor: 'rgb(250, 250, 250)' }}>

            <h5 className='m-0 p-0 text-14'>Settings:</h5>
   
            <div className='grid grid-5 gap-10 flex-align-end'>
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
                  onChange={(newVal: string) => setVscoin(newVal)}
                  __nextHasNoMarginBottom
               />
   
               <SelectControl
                  className=""
                  label={__('Period', 'crypto-chart-block')}
                  value={period}
                  options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }]}
                  onChange={(newVal: string) => setPeriod(newVal)}
                  __nextHasNoMarginBottom
               />
   
               {false && <SelectControl
                  className=""
                  label={__('Days', 'crypto-chart-block')}
                  value={steps}
                  options={[{ label: '15', value: '15' }, { label: '30', value: '30' }, { label: '90', value: '90' }]}
                  onChange={(newVal: number) => setSteps(newVal)}
                  __nextHasNoMarginBottom
               />}
   
               <div className='relative'>
                  <TextControl
                  label={__('From Date', 'crypto-chart-block')}
                  type="date"
                  value={dateFrom}
                  readOnly={true}
                  onClick={() => setOpenDatePickerFrom(true)}
                  />
                  {openDatePickerFrom && <div className='absolute bg-white p-10 top-0 left-0 z-10 shadow'>
                     <DatePicker
                        currentDate={ new Date() }
                        onChange={ ( date ) => {
                              const dateFormat= new Date(date);
                              const newDate = dateFormat.getFullYear()+"-"+(dateFormat.getMonth()+1 + '').padStart(2, '0')+"-"+(dateFormat.getDate() + '').padStart(2, '0');
                              console.log('new date To', newDate)
                              setDateFrom( newDate )
                           }
                        }
                     />
                     <button onClick={() => setOpenDatePickerFrom(false)}>close</button>
                  </div>}
               </div>
   
               <div className='relative'>
                  <TextControl
                  label={__('to Date', 'crypto-chart-block')}
                  type="date"
                  value={dateTo}
                  readOnly={true}
                  onClick={() => setOpenDatePickerTo(true)}
                  />
                  {openDatePickerTo && <div className='absolute bg-white p-10 top-0 left-0 z-10 shadow'>
                     <DatePicker
                        currentDate={ new Date() }
                        onChange={ ( date ) => {
                              const dateFormat= new Date(date);
                              const newDate = dateFormat.getFullYear()+"-"+(dateFormat.getMonth()+1 + '').padStart(2, '0')+"-"+(dateFormat.getDate() + '').padStart(2, '0');
                              console.log('new date To', newDate)
                              setDateTo( newDate )
                           }
                        }
                     />
                     <button onClick={() => setOpenDatePickerTo(false)}>close</button>
                  </div>}
               </div>
   
            </div>
   
            <h5 className='m-0 p-0 text-14'>Crypto coins:</h5>
   
            <div className='grid grid-4 gap-20 mb-10'>
               {dateFrom && dateTo && coins && coins.map(coin => {
                  //Make sure "coin" exist and this is not reacting before setCoins is updated
                  if (coin) return <CoinSettings
                     key={coin.id}
                     id={coin.id}
                     coinElement={coin}
                     labelsElement={labels}
                     vscoin={vscoin}
                     period={period}
                     steps={steps}
                     dateFrom={dateFrom}
                     dateTo={dateTo}
                     updateCoin={updateCoin}
                     removeCoin={removeCoin}
                     className="bg-white rounded-lg"
                  />
               })}
   
               {maxCoins > coins.length && 
                  <div 
                  onClick={() => addCoin()}
                  className="relative flex flex-justify-center flex-align-center bg-white"
                  style={{ border: '4px solid #f2f2f2', cursor: 'pointer', minHeight: '78px' }}
                  >
                     Add Coin
                  </div>
               }
            </div>
   
            <div>
               {labels && labels.length > 0 && coins && coins.length > 0 && coins[0].coin != '' && data && data.hasOwnProperty('datasets') && <div style={{ maxWidth: '600px', backgroundColor: '#f2f2f2', padding: '10px' }}>
                  <Line options={options} data={data} />
               </div>}
            </div>
         </div>
      </div>
   );
}