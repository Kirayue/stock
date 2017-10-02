'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var predictResultPath = process.argv[2],
    stockCodeListPath = process.argv[3],
    distPath = process.argv[4];

var pre_predictResult = _child_process2.default.execSync('tail -n +2 ' + predictResultPath, { encoding: 'utf8' }).split('\n');
pre_predictResult.pop();
var stockCodeList = _fs2.default.readFileSync(stockCodeListPath, 'utf8').split('\n');
stockCodeList.pop();
var date = stockCodeList.shift();
var data = JSON.parse(_fs2.default.readFileSync('/home/mlb/res/stock/twse/json/' + date + '.json'));
var decisions = [];
var predictResult = pre_predictResult.map(function (value, index, arr) {
  var temp = value.split(' ');
  return [stockCodeList[index]].concat(_toConsumableArray(temp));
}); //[stockid, label, pro of -1, pro of 0, pro of 1]

var over50 = predictResult.filter(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 5);

  var _ref2$ = _ref2[4];
  var value = _ref2$ === undefined ? 0 : _ref2$;
  return value > 0.5;
});
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = over50[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _step$value = _slicedToArray(_step.value, 5);

    var id = _step$value[0];
    var p = _step$value[4];

    var weight = void 0,
        life = void 0;
    if (p >= 0.9) weight = 5;else if (p >= 0.8) weight = 4;else if (p >= 0.7) weight = 3;else if (p >= 0.6) weight = 2;else weight = 1;

    life = Math.floor(Math.random() * 7 + 1);
    decisions.push({ code: id, type: 'buy', weight: weight, life: life, open_price: data[id].close, close_high_price: data[id].close * 1.3, close_low_price: data[id].close * 0.7 });
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

var lower50 = predictResult.filter(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 4);

  var _ref4$ = _ref4[2];
  var value = _ref4$ === undefined ? 0 : _ref4$;
  return value > 0.5;
});
var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  for (var _iterator2 = lower50[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    var _step2$value = _slicedToArray(_step2.value, 4);

    var id = _step2$value[0];
    var p = _step2$value[2];

    var _weight = void 0,
        _life = void 0;
    if (p >= 0.9) _weight = 5;else if (p >= 0.8) _weight = 4;else if (p >= 0.7) _weight = 3;else if (p >= 0.6) _weight = 2;else _weight = 1;
    _life = Math.floor(Math.random() * 7 + 1);
    decisions.push({ code: id, type: 'short', weight: _weight, life: _life, open_price: data[id].close, close_high_price: data[id].close * 1.3, close_low_price: data[id].close * 0.7 });
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

_fs2.default.writeFileSync(distPath, JSON.stringify(decisions, null, '\t'));
