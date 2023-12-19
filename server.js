const express = require('express')
const axios=require('axios')
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
require('dotenv').config()

const app=express()
const apiKey=process.env.API_KEY
class Block{
    constructor(timeStamp,blockReward){
        this.timeStamp=timeStamp;
        this.blockReward=blockReward;
    }
}

const fetchData =async ()=>{
    try{
      const listOfBlocks =[];
      for(let blockNumber=17469850; blockNumber<17469851;blockNumber++){
        const apiUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${apiKey}`
        const response = await axios.get(apiUrl);
        const rewardEther=response.data.result.blockReward/1000000000000000000;
        const timeStamp=response.data.result.timeStamp
        const block=new Block(timeStamp,rewardEther)
        listOfBlocks.push(block)
      }
      exportToCsv(listOfBlocks)
    }catch(error){
        console.error(error)
    }
}
const exportToCsv = (data) => {
    console.log("Hello")
    const csvWriter = createCsvWriter({
      path: 'block_data.csv',
      header: [
        { id: 'timeStamp', title: 'timestamp' },
        { id: 'blockReward', title: 'blockReward' }
      ]
    });
  
    csvWriter
      .writeRecords(data)
      .then(() => {
        console.log('CSV file created successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

(async()=>{
    try{
        await fetchData()
        app.listen(3000,()=>{
            console.log("Server is running");
        })
    }catch(erorr){
        console.error(error)
    }
})()