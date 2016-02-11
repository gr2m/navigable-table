require('bootstrap/dist/css/bootstrap.css')
require('./demo.css')

var jQuery = require('jquery')
var navigableTable = require('../navigable-table')
var editableTable = require('editable-table')
var expandableInput = require('expandable-input')

expandableInput(jQuery)
editableTable(jQuery)
navigableTable(jQuery)

window.$ = window.jQuery = jQuery
