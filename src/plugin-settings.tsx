
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
/**
 * WordPress dependencies
 */
import {
   Component,
   Fragment
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';


//Settings page
document.addEventListener('DOMContentLoaded', () => {
   const element = document.getElementById('crypto-chart-block-settings');
   if (typeof element == 'undefined' || element == null) return;

   //this string will be translated. 
   //TODO: Try to create a component
   ReactDOM.render(
      <div>
         <h2>{__('Crypto Chart Block', 'crypto-chart-block-settings')}</h2>
         <Chart/>
      </div>
   , element);
})



const Chart = () => {
   const [coin, setCoin] = useState('bitcoin');
   const [vscoin, setVscoin] = useState('usd');
   const [historic, setHistoric] = useState([]);

   useEffect(() => {
      getHistoric();
   }, [coin]);

   useEffect(() => {
      getHistoric();
   }, []);

   function getHistoric() {
      const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vscoin}&days=30&interval=daily`;
      console.log(coin, url)
      axios.get(url)
      .then((response) => {
         console.log(url, response.data.prices)
         setHistoric(response.data.prices)
      })
   }

   return <div>
      <div>
         <select
         value={coin}
         onChange={(e) => setCoin(e.target.value)}>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="dogecoin">Dogecoin</option>
         </select>
      </div>
      <div>
         {historic}
      </div>
   </div>
}

