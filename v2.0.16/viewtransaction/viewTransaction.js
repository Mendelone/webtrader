define(["jquery","windows/windows","websockets/binary_websockets","common/rivetsExtra","moment","lodash","jquery-growl","common/util"],function(a,b,c,d,e,f){"use strict";function g(a,b){var c=[],d="";if(b.history){d="line";for(var e=b.history,g=e.times,h=e.prices,i=0;i<g.length;++i)c.push([1e3*g[i],1*h[i]])}b.candles&&(d="candlestick",c=b.candles.map(function(a){return[1e3*a.epoch,1*a.open,1*a.high,1*a.low,1*a.close]}));var j=b.title,k=a.find(".transaction-chart")[0],b={credits:{href:"https://www.binary.com",text:"Binary.com"},chart:{type:"live",renderTo:k,backgroundColor:null,width:0,height:0,events:{load:function(){this.credits.element.onclick=function(){window.open("http://www.binary.com","_blank")}}}},title:{text:j,style:{fontSize:"16px"}},tooltip:{xDateFormat:"%A, %b %e, %H:%M:%S GMT"},xAxis:{type:"datetime",categories:null,startOnTick:!1,endOnTick:!1,min:f.first(c)[0],max:f.last(c)[0],labels:{overflow:"justify",format:"{value:%H:%M:%S}"}},yAxis:{labels:{align:"left",x:0,y:-2},title:""},series:[{name:j,data:c,type:d}],exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1},navigator:{enabled:!0},plotOptions:{line:{marker:{radius:2}},candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0}},rangeSelector:{enabled:!1}},l=new Highcharts.Chart(b);return l.addPlotLineX=function(a){l.xAxis[0].addPlotLine({value:a.value,id:a.id||a.value,label:{text:a.label||"label",x:a.text_left?-15:5},color:a.color||"#e98024",width:a.width||2})},l.addPlotLineY=function(a){l.yAxis[0].addPlotLine({id:a.id||a.label,value:a.value,label:{text:a.label,align:"center"},color:a.color||"green",width:2})},k.chart=l}function h(a){return c.cached.send({trading_times:(new Date).toISOString().slice(0,10)}).then(function(b){for(var c=b.trading_times.markets,d=0;d<c.length;++d)for(var e=c[d].submarkets,f=0;f<e.length;++f)for(var g=e[f].symbols,h=0;h<g.length;++h)if(g[h].symbol===a)return g[h].name;return"Transaction"})}function i(b,d){require(["text!viewtransaction/viewTransaction.html"]),c.cached.send({proposal_open_contract:1,contract_id:b}).then(function(a){var b=a.proposal_open_contract;b.transaction_id=d,b.symbol=b.underlying,h(b.symbol).then(function(a){b.symbol_name=a,j(b)})["catch"](function(a){})})["catch"](function(b){a.growl.error({message:b.message})})}function j(c){require(["text!viewtransaction/viewTransaction.html"],function(e){var f=a(e),g=k(c,f),h=b.createBlankWindow(f,{title:c.symbol_name+" ("+c.transaction_id+")",width:700,minWidth:300,minHeight:350,destroy:function(){},close:function(){i&&i.unbind()},resize:function(){g.chart.manual_reflow()},close:function(){i.unbind()},"data-authorized":"true"});h.dialog("open");var i=d.bind(f[0],g)})}function k(a,b){var c={route:{value:"table",update:function(a){c.route.value=a}},longcode:a.longcode,validation:a.validation_error||!a.is_valid_to_sell&&"Resale of this contract is not offered"||a.is_expired&&"This contract has expired"||"-",table:{currency:(a.currency||"USD")+" ",now:e.utc().unix(),date_start:a.date_start,date_expiry:a.date_expiry,entry_tick:a.entry_tick,entry_tick_time:a.entry_tick_time,exit_tick:a.exit_tick,exit_tick_time:a.exit_tick_time,current_tick:void 0,buy_price:a.buy_price&&formatPrice(a.buy_price),bid_price:void 0,sell_price:a.sell_price&&formatPrice(a.sell_price),tick_count:a.tick_count,prediction:a.prediction},chart:{chart:null,symbol:a.symbol,symbol_name:a.symbol_name,barrier:a.barrier,high_barrier:a.high_barrier,low_barrier:a.low_barrier,loading:"Loading "+a.symbol_name+" ..."}};return c.chart.manual_reflow=function(){var a=-1*(b.find(".longcode").height()+b.find(".tabs").height()+b.find(".footer").height())-16;if(c.chart.chart){var d=b,e=d.width(),f=d.height();c.chart.chart.setSize(e,f+a,!1),c.chart.chart.hasUserSize=null}},l(c,b),c}function l(a,b){var d=(a.table,a.table.date_expiry-a.table.date_start),e=0,h=0;e=3600>d?0:7200>=d?60:21600>=d?120:86400>=d?300:3600,h=0===e?3:3*e;var i={ticks_history:a.chart.symbol,start:a.table.date_start-h,end:a.table.date_expiry?1*a.table.date_expiry+h:"latest",style:0===e?"ticks":"candles",count:4999};c.send(i).then(function(c){a.chart.loading="";var d={title:a.chart.symbol_name};c.history&&(d.history=c.history),c.candles&&(d.candles=c.candles);var e=g(b,d);c.history&&!a.table.entry_tick_time&&(a.table.entry_tick_time=c.history.times.filter(function(b){return 1*b>=1*a.table.date_start})[0]),c.history&&!a.table.exit_tick_time&&(a.table.exit_tick_time=f.last(c.history.times.filter(function(b){return 1*b<=1*a.table.date_expiry}))),a.table.entry_tick_time&&e.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot"}),a.table.exit_tick_time&&e.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot",text_left:!0}),a.table.date_expiry&&e.addPlotLineX({value:1e3*a.table.date_expiry,label:"End Time"}),a.table.date_start&&e.addPlotLineX({value:1e3*a.table.date_start,label:"Start Time",text_left:!0}),a.chart.barrier&&e.addPlotLineY({value:1*a.chart.barrier,label:"Barrier ("+a.chart.barrier+")"}),a.chart.high_barrier&&e.addPlotLineY({value:1*a.chart.high_barrier,label:"High Barrier ("+a.chart.high_barrier+")"}),a.chart.low_barrier&&e.addPlotLineY({value:1*a.chart.low_barrier,label:"Low Barrier ("+a.chart.low_barrier+")",color:"red"}),a.chart.chart=e,a.chart.manual_reflow()})["catch"](function(b){a.chart.loading=b.message})}return require(["css!viewtransaction/viewTransaction.css"]),require(["text!viewtransaction/viewTransaction.html"]),{init:i}});