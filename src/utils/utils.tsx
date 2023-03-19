
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
   for(const item of data.prices) {
      const dateFromTime = new Date(parseInt(item[0]));
      const date = dateFromTime.getFullYear() + '-' + dateFromTime.getMonth() + '-' + dateFromTime.getDate();
      if(!lastDate){
         lastDate = date;
      }
      //get last price from date
      if(lastDate !== date){
         dailyLabels.push(date)
         dailyPrices.push(item)
      }
      lastDate = date;
      lastPrice = item[1];
   }

   //TODO: check if data is valid or error returned

   return {prices: dailyPrices, dates: dailyLabels};
}

//method from https://stackoverflow.com/a/62640342/10324485
export function lightenColor(col, amt){
   col = col.replace(/^#/, '')
   if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]
 
   let [r, g, b] = col.match(/.{2}/g);
   ([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt])
 
   r = Math.max(Math.min(255, r), 0).toString(16)
   g = Math.max(Math.min(255, g), 0).toString(16)
   b = Math.max(Math.min(255, b), 0).toString(16)
 
   const rr = (r.length < 2 ? '0' : '') + r
   const gg = (g.length < 2 ? '0' : '') + g
   const bb = (b.length < 2 ? '0' : '') + b
 
   return `#${rr}${gg}${bb}`
 }
