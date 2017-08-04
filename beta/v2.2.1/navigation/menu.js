define(["exports","jquery","lodash","./navigation","../common/util"],function(a,b,c,d){"use strict";function e(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(a,"__esModule",{value:!0}),a.refreshMenu=a.sortMenu=a.extractChartableMarkets=a.extractFilteredMarkets=void 0;var f=e(b),g=e(c),h=(e(d),a.extractFilteredMarkets=function(a,b){var c=a.trading_times.markets.map(function(a){var c={name:a.name,display_name:a.name};return c.submarkets=a.submarkets.map(function(a){var c={name:a.name,display_name:a.name},d=a.symbols;return b&&b.filter&&(d=d.filter(b.filter)),c.instruments=d.map(function(a){return{symbol:a.symbol,display_name:a.name,delay_amount:a.delay_amount||0,events:a.events,times:a.times,settlement:a.settlement,feed_license:a.feed_license||"realtime"}}),c}).filter(function(a){return a.instruments.length>0}),c});return c}),i=a.extractChartableMarkets=function(a){return h(a,{filter:function(a){return"chartonly"!==a.feed_license}})||[]},j=a.sortMenu=function(a){var b=sortAlphaNum("display_name");if(f["default"].isArray(a)){var c={forex:1,indices:2,stocks:3,commodities:4,volidx:5};a=g["default"].sortBy(a,function(a){return c[a.name.toLowerCase()]}),a.forEach(function(a){f["default"].isArray(a.submarkets)&&(a.submarkets.sort(b),a.submarkets.forEach(function(a){f["default"].isArray(a.instruments)&&a.instruments.sort(b)}))})}return a},k=a.refreshMenu=function(a,b,c){var d="<ul>"+b.map(function(a){return"<li><div>"+a.display_name+"</div><ul>"+a.submarkets.map(function(a){return"<li><div>"+a.display_name+"</div><ul>"+a.instruments.map(function(a){return"<li symbol='"+a.symbol+"'><div>"+a.display_name+"</div></li>"}).join("")+"</ul></li>"}).join("")+"</ul></li>"}).join("")+"</ul>",e=f["default"](d);a.find("> ul").menu("destroy").remove(),a.append(e),e.find("li[symbol]").on("click",function(a){var b=f["default"](a.target).text(),d=f["default"](a.target).closest("li").attr("symbol");e.fadeOut(),setTimeout(function(){return e.show()},500),c(d,b)}),e.menu()};a["default"]={extractChartableMarkets:i,extractFilteredMarkets:h,sortMenu:j,refreshMenu:k}});