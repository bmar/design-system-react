"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _combobox = _interopRequireDefault(require("../../../../../components/combobox"));

var _iconSettings = _interopRequireDefault(require("../../../../../components/icon-settings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var accounts = [{
  id: '1',
  label: 'Acme',
  subTitle: 'Account • San Francisco',
  type: 'account'
}, {
  id: '2',
  label: 'Salesforce.com, Inc.',
  subTitle: 'Account • San Francisco',
  type: 'account'
}, {
  id: '3',
  label: "Paddy's Pub",
  subTitle: 'Account • Boston, MA',
  type: 'account'
}, {
  id: '4',
  label: 'Tyrell Corp',
  subTitle: 'Account • San Francisco, CA',
  type: 'account'
}, {
  id: '5',
  label: 'Paper St. Soap Company',
  subTitle: 'Account • Beloit, WI',
  type: 'account'
}, {
  id: '6',
  label: 'Nakatomi Investments',
  subTitle: 'Account • Chicago, IL',
  type: 'account'
}, {
  id: '7',
  label: 'Acme Landscaping',
  type: 'account'
}, {
  id: '8',
  label: 'Acme Construction',
  subTitle: 'Account • Grand Marais, MN',
  type: 'account'
}];

var Example =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Example, _React$Component);

  function Example(props) {
    var _this;

    _classCallCheck(this, Example);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Example).call(this, props));
    _this.state = {
      inputValue: '',
      selection: [accounts[0]]
    };
    return _this;
  }

  _createClass(Example, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement(_iconSettings.default, {
        iconPath: "/assets/icons"
      }, _react.default.createElement(_combobox.default, {
        id: "combobox-unique-id",
        events: {
          onSelect: function onSelect(event, data) {
            console.log('onSelect', data);

            _this2.setState({
              inputValue: '',
              selection: data.selection
            });
          }
        },
        labels: {
          label: 'Search',
          placeholder: 'Search Salesforce'
        },
        menuPosition: "relative",
        options: accounts,
        selection: this.state.selection,
        value: this.state.inputValue,
        variant: "readonly"
      }));
    }
  }]);

  return Example;
}(_react.default.Component);

Example.displayName = 'ComboboxExample';
var _default = Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime

exports.default = _default;