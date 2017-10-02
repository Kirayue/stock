'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startDate = process.argv[2],
    endDate = process.argv[3],
    last = process.argv[4],
    output = process.argv[5];
var files = _fs2.default.readdirSync('/home/mlb/res/stock/twse/json'); // array
var now = (0, _moment2.default)(endDate),
    end = (0, _moment2.default)(startDate).subtract(1, 'days');
var result = '',
    pros = ['open', 'close', 'high', 'low', 'volume', 'adj_close'];
while (now.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')) {
  // check if now.format exsit in files if true do readfile for lastDate times if else now.add(1,'days')
  var pDate = now.format('YYYY-MM-DD');
  if (files.indexOf(pDate + '.json') === -1) {
    console.log('no such data');
  } else {
    var i = 0,
        rawData = [],
        index = files.indexOf(pDate + '.json'),
        stockId = [];
    while (i <= last) {
      //read original data to rawData arr
      var tmp = JSON.parse(_fs2.default.readFileSync('/home/mlb/res/stock/twse/json/' + files[index - i], 'utf8'));
      rawData.push(tmp);
      i++;
    }
    for (var id in rawData[0]) {
      // read stock id to arr
      if (id !== 'id') {
        stockId.push(id);
      }
    }
    stockId.sort();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = stockId[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _id = _step.value;

        if (rawData[0][_id].close !== 'NULL' && rawData[1][_id] && rawData[1][_id].close !== 'NULL') {
          var label = void 0;
          if (rawData[0][_id].close - rawData[1][_id].close > 0) label = 1; //set label
          else if (rawData[0][_id].close - rawData[1][_id].close < 0) label = -1;else label = 0;
          var rowdata = label + ' ',
              j = 1;
          for (var _i = 1; _i < rawData.length; _i++) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = pros[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var pro = _step2.value;

                if (rawData[_i][_id] && rawData[_i][_id][pro] !== 'NULL') {
                  rowdata = '' + rowdata + j++ + ':' + rawData[_i][_id][pro] + ' ';
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
          }
          if (j === 31) {
            result = '' + result + rowdata + '\n';
          }
          console.log(pDate + ' ' + _id + ' ' + label);
        }
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
  }
  now.subtract(1, 'days'); //date minus 1
}
_fs2.default.writeFileSync(output, result);
