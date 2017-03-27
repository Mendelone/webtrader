define(["exports","jquery","jquery-ui","websockets/binary_websockets","navigation/menu","charts/chartWindow","jquery-growl","common/util"],function(a,b,c,d,e,f){"use strict";function g(a){return a&&a.__esModule?a:{"default":a}}function h(){k["default"].send({active_symbols:"brief"}).then(function(b){a.get_symbols=n=b.active_symbols;{var c=[];_(b.active_symbols).groupBy("market").map(function(a){var b=_.head(a),d={name:b.market,display_name:b.market_display_name};return d.submarkets=_(a).groupBy("submarket").map(function(a){var b=_.head(a),d={name:b.submarket,display_name:b.submarket_display_name};return d.instruments=_.map(a,function(a){return c.push(a.symbol),{symbol:a.symbol,display_name:a.display_name}}),d}).value(),d}).value()}o=p.map(function(a){return{display_name:a.display_name,name:a.name,submarkets:a.submarkets.map(function(a){return{display_name:a.display_name,instruments:a.instruments.filter(function(a){return-1!==c.indexOf(a.symbol)})}}).filter(function(a){return 0!==a.instruments.length})}}).filter(function(a){return 0!==a.submarkets.length}),o=l["default"].sortMenu(o);var d=j["default"]("#nav-menu").find(".instruments");d.find("> ul").remove();var e=j["default"]("<ul>").appendTo(d);l["default"].refreshMenu(e,o,i)})}function i(a){var b=a.data("delay_amount"),c=a.data("symbol"),d=a.data("display_name");m["default"].addNewWindow({instrumentCode:c,instrumentName:d,timePeriod:"1d",type:"candlestick",delayAmount:b})}Object.defineProperty(a,"__esModule",{value:!0}),a.getSpecificMarketData=a.isMarketDataPresent=a.getMarketData=a.init=a.get_symbols=void 0;var j=g(b),k=(g(c),g(d)),l=g(e),m=g(f),n=a.get_symbols=[],o=[],p=[],q=a.init=function(){return k["default"].cached.send({trading_times:(new Date).toISOString().slice(0,10)}).then(function(a){p=l["default"].extractChartableMarkets(a),h(),require(["websockets/binary_websockets"],function(a){a.events.on("login",h),a.events.on("logout",h)});j["default"]("#nav-menu").find(".instruments").on("mouseleave",h);return p})},r=a.getMarketData=function(){return o},s=a.isMarketDataPresent=function(a,b){var c=!1;b||(b=o);var d=this;return j["default"].each(b,function(b,e){return e.submarkets||e.instruments?c=d.isMarketDataPresent(a,e.submarkets||e.instruments):j["default"].trim(e.display_name)==j["default"].trim(a)&&(c=!0),!c}),c},t=a.getSpecificMarketData=function(a,b){var c={};b||(b=o);var d=this;return j["default"].each(b,function(b,e){return e.submarkets||e.instruments?c=d.getSpecificMarketData(a,e.submarkets||e.instruments):j["default"].trim(e.display_name)==j["default"].trim(a)&&(c=e),j["default"].isEmptyObject(c)}),c};a["default"]={init:q,getMarketData:r,isMarketDataPresent:s,getSpecificMarketData:t,get_symbols:n}});