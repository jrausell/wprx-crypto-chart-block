import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import dayjs from 'dayjs';
import { getMarketChart, lightenColor } from '../utils/utils';
import { HexColorPicker } from "react-colorful";

/**
 * WordPress dependencies
 */
import {
   Component,
   Fragment
} from '@wordpress/element';
import {
   Button,
   TextControl,
   SelectControl,
   RadioControl,
   FormToggle,
   Icon
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Our libraries
 */
import cryptocoins from "../utils/cryptocoins.json";
import vscoins from "../utils/fiatcoins.json";


/**
 * Code
 */
export default function CoinSettings ({ id, coinElement, labelsElement, vscoin, period, steps, dateFrom, dateTo, updateCoin, removeCoin })
{

   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);

   const [coin, setCoin] = useState<string>(coinElement?.coin);
   const [prices, setPrices] = useState<Array<any>>(coinElement?.prices || []);
   const [labels, setLabels] = useState<Array<any>>(labelsElement ?? []);
   const [color, setColor] = useState<string>(coinElement?.color || '#497bb1');
   const [openColorPicker, setOpenColorPicker] = useState(false);

   const colors = [
      { name: 'red', color: '#f00' },
      { name: 'white', color: '#fff' },
      { name: 'blue', color: '#00f' },
   ];

   function callbackUpdateCoin() {
      console.log('CallBack Update ->', coin, prices, labels, color)
      updateCoin(id, coin, prices, labels, color);
   }

   useEffect(() => {
      console.log('INIT CoinSettings', id, vscoin, period, steps)

      setIsLoading(false);
   }, []);

   useEffect(() => {
      if(isLoading) return;

      if (coin && prices && !isSaving) callbackUpdateCoin();
   }, [prices, isSaving]);

   useEffect(() => {
      if(isLoading) return;
      if (!coin || coin == '') return;

      setIsSaving(true)

      getMarketChart(coin, vscoin, steps, period, dateFrom, dateTo)
      .then((response) => {
         let newlabels = [];
         let newprices = [];
         for (const currency of response.prices) {
            newlabels.push(dayjs(currency[0]).format('DD/MM/YYYY'));
            newprices.push(currency[1]);
         }

         setLabels(newlabels);
         setPrices(newprices);
      })
      
      setIsSaving(false);

   }, [coin, vscoin, period, steps, color]);

   return <div
      key={Date.now()}
      className='coin-settings p-10'
      style={{ border: '4px solid', borderColor: color }}>

      <SelectControl
         className=""
         value={coin}
         disabled={isSaving || isLoading}
         options={cryptocoins}
         onChange={(newVal:string) => setCoin(newVal)}
         __nextHasNoMarginBottom
      />

      <div className="flex gap-10">
         <div className='relative'>
            <TextControl
               value={color}
               readOnly
               size="8"
               onClick={() => setOpenColorPicker(true)}
               style={{ backgroundColor: color }}
            />
            {openColorPicker && <div className='absolute' style={{ backgroundColor: 'white', padding: '10px' }}>
               <HexColorPicker color={color} onChange={setColor} />
               <button type='button' style={{ cursor: 'pointer', backgroundColor: '#1d8de2', color: 'white' }} onClick={() => setOpenColorPicker(false)}>Save</button>
            </div>}
         </div>

         <div>
            <button type='button' className='btn' style={{ height: '30px', cursor: 'pointer', backgroundColor: '#ff9393', color: 'white' }} onClick={() => removeCoin(id)}>Del</button>
         </div>
      </div>

   </div>

}