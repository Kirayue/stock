import fs from 'fs'
import cp from 'child_process'

const predictResultPath = process.argv[2], stockCodeListPath = process.argv[3], distPath = process.argv[4]

const pre_predictResult = cp.execSync(`tail -n +2 ${predictResultPath}`,{encoding:'utf8'}).split('\n')
pre_predictResult.pop()
const stockCodeList = fs.readFileSync(stockCodeListPath,'utf8').split('\n')
stockCodeList.pop()
const date = stockCodeList.shift()
const data = JSON.parse(fs.readFileSync(`/home/mlb/res/stock/twse/json/${date}.json`))
const decisions = []
const predictResult = pre_predictResult.map((value, index, arr) => {
  let temp = value.split(' ')
  return [stockCodeList[index], ...temp]
}) //[stockid, label, pro of -1, pro of 0, pro of 1]

const over50 = predictResult.filter(([,,,,value = 0]) => value > 0.5)
for (let [id,,,, p] of over50){
  let weight, life 
  if(p >= 0.9) weight = 5
  else if (p >= 0.8) weight = 4
  else if (p >= 0.7) weight = 3
  else if (p >= 0.6) weight = 2
  else weight = 1

  life = Math.floor(Math.random() * 7 + 1)
  decisions.push({code: id, type:'buy' , weight: weight, life:life, open_price:data[id].close, close_high_price:data[id].close + 5, close_low_price:data[id].close - 5})
}
const lower50 = predictResult.filter(([,,value = 0,,]) => value > 0.5)
for (let [id,, p,,] of lower50){
  let weight, life
  if(p >= 0.9) weight = 5
  else if (p >= 0.8) weight = 4
  else if (p >= 0.7) weight = 3
  else if (p >= 0.6) weight = 2
  else weight = 1
  life = Math.floor(Math.random() * 7 + 1)
  decisions.push({code: id, type:'short' , weight: weight, life:life, open_price:data[id].close, close_high_price:data[id].close + 5, close_low_price:data[id].close - 5})
}
fs.writeFileSync(distPath, JSON.stringify(decisions, null, '\t'))

