"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _button = _interopRequireDefault(require("../../../../components/button"));

var _buttonGroup = _interopRequireDefault(require("../../../../components/button-group"));

var _menuDropdown = _interopRequireDefault(require("../../../../components/menu-dropdown"));

var _buttonTrigger = _interopRequireDefault(require("../../../../components/menu-dropdown/button-trigger"));

var _iconSettings = _interopRequireDefault(require("../../../../components/icon-settings"));

var _pageHeader = _interopRequireDefault(require("../../../../components/page-header"));

var _control = _interopRequireDefault(require("../../../../components/page-header/control"));

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Example =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Example, _React$Component);

  function Example() {
    _classCallCheck(this, Example);

    return _possibleConstructorReturn(this, _getPrototypeOf(Example).apply(this, arguments));
  }

  _createClass(Example, [{
    key: "render",
    value: function render() {
      var actions = function actions() {
        return _react.default.createElement(_control.default, null, _react.default.createElement(_buttonGroup.default, {
          variant: "list"
        }, _react.default.createElement(_button.default, {
          label: "Add Contact",
          variant: "neutral"
        }), _react.default.createElement(_menuDropdown.default, {
          assistiveText: {
            icon: 'More Options'
          },
          buttonVariant: "icon",
          iconCategory: "utility",
          iconName: "down",
          iconVariant: "border-filled",
          id: "page-header-related-list-add-contact-dropdown",
          openOn: "click",
          align: "right",
          options: [{
            label: 'Refresh List',
            value: 'A0'
          }, {
            label: 'Duplicate Selected Leads',
            value: 'B0'
          }, {
            label: 'Disabled Selected Leads',
            value: 'C0'
          }]
        })));
      };

      var controls = function controls() {
        return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_control.default, null, _react.default.createElement(_menuDropdown.default, {
          align: "right",
          assistiveText: {
            icon: 'Change view'
          },
          iconCategory: "utility",
          iconName: "settings",
          iconVariant: "more",
          id: "content-right-dropdown",
          options: [{
            label: 'Menu Item One',
            value: 'A0'
          }, {
            label: 'Menu Item Two',
            value: 'B0'
          }, {
            label: 'Menu Item Three',
            value: 'C0'
          }, {
            type: 'divider'
          }, {
            label: 'Menu Item Four',
            value: 'D0'
          }]
        }, _react.default.createElement(_buttonTrigger.default, null, _react.default.createElement(_button.default, {
          assistiveText: {
            icon: 'Change view'
          },
          iconCategory: "utility",
          iconName: "table",
          iconVariant: "more",
          variant: "icon"
        })))), _react.default.createElement(_control.default, null, _react.default.createElement(_buttonGroup.default, {
          variant: "list"
        }, _react.default.createElement(_button.default, {
          iconCategory: "utility",
          iconName: "chart",
          variant: "icon",
          iconVariant: "border-filled",
          assistiveText: {
            icon: 'Chart'
          }
        }), _react.default.createElement(_button.default, {
          iconCategory: "utility",
          iconName: "filterList",
          variant: "icon",
          iconVariant: "border-filled",
          assistiveText: {
            icon: 'Filter List'
          }
        }), _react.default.createElement(_menuDropdown.default, {
          triggerClassname: true,
          align: "right",
          assistiveText: {
            icon: 'List View Controls'
          },
          iconCategory: "utility",
          iconName: "sort",
          iconVariant: "more",
          id: "content-right-dropdown-2",
          options: [{
            label: 'Menu Item One',
            value: 'A0'
          }, {
            label: 'Menu Item Two',
            value: 'B0'
          }, {
            label: 'Menu Item Three',
            value: 'C0'
          }, {
            type: 'divider'
          }, {
            label: 'Menu Item Four',
            value: 'D0'
          }]
        }))));
      };

      var trail = [_react.default.createElement("a", {
        href: "javascript:void(0);"
      }, "Accounts"), _react.default.createElement("a", {
        href: "javascript:void(0);"
      }, "Company One")];
      return _react.default.createElement(_iconSettings.default, {
        iconPath: "/assets/icons"
      }, _react.default.createElement(_pageHeader.default, {
        info: "10 items \u2022 sorted by name",
        onRenderActions: actions,
        onRenderControls: controls,
        title: "Contacts (will truncate)",
        trail: trail,
        truncate: true,
        variant: "related-list"
      }));
    }
  }]);

  return Example;
}(_react.default.Component);

_defineProperty(Example, "displayName", 'RelatedListPageHeaderExample');

var _default = Example; // export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime

exports.default = _default;