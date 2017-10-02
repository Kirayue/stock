import fs from 'fs'
import moment from 'moment'
const predictDate = process.argv[2], last = process.argv[3], featurePath = process.argv[4], stockCodeList = process.argv[5]
const files = fs.readdirSync('/home/mlb/res/stock/twse/json') // array
const pDate = moment(predictDate).subtract(1,'days') 
let result = '', pros = ['open','close','high','low','volume','adj_close']
while(files.indexOf(`${pDate.format('YYYY-MM-DD')}.json`) === -1){  // if there is not such data
  //check if pDate not exsits in files pDate.substract(1,'days')
  pDate.subtract(1,'days') 
}
// generate feature
let i = 0, rawDatas = [], index = files.indexOf(`${pDate.format('YYYY-MM-DD')}.json`), stockId = []
while(i < last){ // read original data to rawData arr
  let tmp = JSON.parse(fs.readFileSync(`/home/mlb/res/stock/twse/json/${files[index - i]}`,'utf8'))
  rawDatas.push(tmp)
  i++
}
for (let id in rawDatas[0]){ // read stock id to arr exclude id property
  if(id !== 'id'){
    stockId.push(id)
  }
}
stockId.sort()
let codeList = []
for (let id of stockId){
  let label = 0
  let rowdata = `${label} `, j = 1 
  for (let rawData of rawDatas){
    for(let pro of pros){
      if(rawData[id] && rawData[id][pro] !== 'NULL'){
        rowdata = `${rowdata}${j++}:${rawData[id][pro]} `
      }
    }
  }
  if (j === 31){
    result = `${result}${rowdata}\n`
    codeList.push(id)
  }
  //console.log(`${pDate.format('YYYY-MM-DD')} ${id} ${label}`)
}
codeList.unshift(pDate.format('YYYY-MM-DD'))
fs.writeFileSync(stockCodeList, codeList.join('\n'))
fs.writeFileSync(featurePath, result)

