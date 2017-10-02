import fs from 'fs'
import moment from 'moment'
const startDate = process.argv[2], endDate = process.argv[3], last = process.argv[4], output = process.argv[5]
const files = fs.readdirSync('/home/mlb/res/stock/twse/json') // array
const now = moment(endDate), end = moment(startDate).subtract(1,'days') 
let result = '', pros = ['open','close','high','low','volume','adj_close']
while(now.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')){
  // check if now.format exsit in files if true do readfile for lastDate times if else now.add(1,'days')
  let pDate = now.format('YYYY-MM-DD')
  if(files.indexOf(`${pDate}.json`) === -1) {
    console.log(`no such data`)
  }
  else{
    let i = 0, rawData = [], index = files.indexOf(`${pDate}.json`), stockId = []
    while(i <= last){ //read original data to rawData arr
      let tmp = JSON.parse(fs.readFileSync(`/home/mlb/res/stock/twse/json/${files[index - i]}`,'utf8'))
      rawData.push(tmp)
      i++
    }
    for (let id in rawData[0]){ // read stock id to arr
      if(id !== 'id'){
        stockId.push(id)
      }
    }
    stockId.sort()
    for (let id of stockId){
      if(rawData[0][id].close !== 'NULL' && rawData[1][id] && rawData[1][id].close !== 'NULL'){
        let label
        if (rawData[0][id].close - rawData[1][id].close > 0) label = 1  //set label
        else if (rawData[0][id].close - rawData[1][id].close < 0) label = -1
        else label = 0
        let rowdata = `${label} `, j = 1 
        for (let i = 1; i < rawData.length; i++){
          for(let pro of pros){
            if(rawData[i][id] && rawData[i][id][pro] !== 'NULL'){
              rowdata = `${rowdata}${j++}:${rawData[i][id][pro]} `
            }
          }
        }
        if (j === 31){
          result = `${result + rowdata}\n`
        }
        console.log(`${pDate} ${id} ${label}`)
      }
    }
  }
  now.subtract(1,'days') //date minus 1
}
fs.writeFileSync(output, result)
