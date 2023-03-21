
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export async function getMarketChart(coin, vscoin, days, interval, dateFrom, dateTo) {

   const dateFromTime = Math.floor(new Date(dateFrom).getTime() / 1000);
   const dateToTime = Math.floor(new Date(dateTo).getTime() / 1000);

   //const url = new URL(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vscoin}&days=${days}&interval=${interval}`); //get last X days before today
   const url = new URL(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=${vscoin}&from=${dateFromTime}&to=${dateToTime}`);

   const response = await fetch(url);
   const data = await response.json();

   let dailyLabels = [];
   let dailyPrices = [];
   let lastDate;
   let lastPrice;
   for (const item of data.prices) {
      const dateFromTime = new Date(parseInt(item[0]));
      const date = dateFromTime.getFullYear() + '-' + dateFromTime.getMonth() + '-' + dateFromTime.getDate();
      if (!lastDate) {
         lastDate = date;
      }
      //get last price from date
      if (lastDate !== date) {
         dailyLabels.push(date)
         dailyPrices.push(item)
      }
      lastDate = date;
      lastPrice = item[1];
   }

   //TODO: check if data is valid or error returned

   return { prices: dailyPrices, dates: dailyLabels };
}

/**
 * returns a ligthen shade from color prop
 */
//method from https://stackoverflow.com/a/62640342/10324485
export function lightenColor(color, percentage) {
   color = color.replace(/^#/, '')
   if (color.length === 3) color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]

   let [r, g, b] = color.match(/.{2}/g);
   ([r, g, b] = [parseInt(r, 16) + percentage, parseInt(g, 16) + percentage, parseInt(b, 16) + percentage])

   r = Math.max(Math.min(255, r), 0).toString(16)
   g = Math.max(Math.min(255, g), 0).toString(16)
   b = Math.max(Math.min(255, b), 0).toString(16)

   const rr = (r.length < 2 ? '0' : '') + r
   const gg = (g.length < 2 ? '0' : '') + g
   const bb = (b.length < 2 ? '0' : '') + b

   return `#${rr}${gg}${bb}`
}

/**
 * Handles a click-outside element
 */
export function onOutsideClick(callback) {
   const ref = React.useRef();

   React.useEffect(() => {
      const handleClick = (event) => {
         if (ref.current && !ref.current.contains(event.target)) {
            callback();
         }
      };

      document.addEventListener('click', handleClick, true);

      return () => {
         document.removeEventListener('click', handleClick, true);
      };
   }, [ref]);

   return ref;
};