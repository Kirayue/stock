'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var predictDate = process.argv[2],
    last = process.argv[3],
    featurePath = process.argv[4],
    stockCodeList = process.argv[5];
var files = _fs2.default.readdirSync('/home/mlb/res/stock/twse/json'); // array
var pDate = (0, _moment2.default)(predictDate).subtract(1, 'days');
var result = '',
    pros = ['open', 'close', 'high', 'low', 'volume', 'adj_close'];
while (files.indexOf(pDate.format('YYYY-MM-DD') + '.json') === -1) {
  // if there is not such data
  //check if pDate not exsits in files pDate.substract(1,'days')
  pDate.subtract(1, 'days');
}
// generate feature
var i = 0,
    rawDatas = [],
    index = files.indexOf(pDate.format('YYYY-MM-DD') + '.json'),
    stockId = [];
while (i < last) {
  // read original data to rawData arr
  var tmp = JSON.parse(_fs2.default.readFileSync('/home/mlb/res/stock/twse/json/' + files[index - i], 'utf8'));
  rawDatas.push(tmp);
  i++;
}
for (var id in rawDatas[0]) {
  // read stock id to arr exclude id property
  if (id !== 'id') {
    stockId.push(id);
  }
}
stockId.sort();
var codeList = [];
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = stockId[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _id = _step.value;

    var label = 0;
    var rowdata = label + ' ',
        j = 1;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = rawDatas[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var rawData = _step2.value;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = pros[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var pro = _step3.value;

            if (rawData[_id] && rawData[_id][pro] !== 'NULL') {
              rowdata = '' + rowdata + j++ + ':' + rawData[_id][pro] + ' ';
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (j === 31) {
      result = '' + result + rowdata + '\n';
      codeList.push(_id);
    }
    //console.log(`${pDate.format('YYYY-MM-DD')} ${id} ${label}`)
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

codeList.unshift(pDate.format('YYYY-MM-DD'));
_fs2.default.writeFileSync(stockCodeList, codeList.join('\n'));
_fs2.default.writeFileSync(featurePath, result);
