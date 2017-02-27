define(["jquery","windows/windows","websockets/binary_websockets","charts/chartingRequestMap","common/rivetsExtra","moment","lodash","jquery-growl","common/util"],function(a,b,c,d,e,f,g){"use strict";function h(){if(s)return void s.moveToTop();var c="There was a market data disruption during the contract period. For real-money accounts we will attempt to correct this and settle the contract properly, otherwise the contract will be cancelled and refunded. Virtual-money contracts will be cancelled and refunded.".i18n(),d=a('<div class="data-disruption-dialog">'+c+"</div>");s=b.createBlankWindow(d,{title:" There was an error ".i18n(),height:200,resizable:!1,collapsable:!1,minimizable:!1,maximizable:!1,destroy:function(){s&&s.dialog("destroy").remove(),s=null},"data-authorized":"true"}),s.dialog("open"),window.dd=s}function i(a,b,c){var d=[],e="",f=0;if(c.history){e="line";for(var h=c.history,i=h.times,j=h.prices,k=0;k<i.length;++k)d.push([1e3*i[k],1*j[k]]),f=Math.max(f,j[k].substring(j[k].indexOf(".")+1).length)}c.candles&&(e="candlestick",d=c.candles.map(function(a){return[1e3*a.epoch,1*a.open,1*a.high,1*a.low,1*a.close]}));var l=c.title,m=a.find(".transaction-chart")[0],c={credits:{href:"https://www.binary.com",text:"Binary.com"},chart:{type:"line",renderTo:m,backgroundColor:null,width:0,height:0,marginLeft:20,marginRight:20,events:{load:function(){this.credits.element.onclick=function(){window.open("https://www.binary.com","_blank")}}}},title:{text:l,style:{fontSize:"16px"}},tooltip:{xDateFormat:"%A, %b %e, %H:%M:%S GMT",valueDecimals:f||void 0},xAxis:{type:"datetime",categories:null,startOnTick:!1,endOnTick:!1,min:d.length?g.first(d)[0]:null,max:d.length?g.last(d)[0]:null,labels:{overflow:"justify",format:"{value:%H:%M:%S}"}},yAxis:{labels:{align:"left",x:0,y:-2},title:""},series:[{name:l,data:d,type:e}],exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1},navigator:{enabled:!0},plotOptions:{line:{marker:{radius:2}},candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0}},rangeSelector:{enabled:!1}},n=new Highcharts.Chart(c);return n.addPlotLineX=function(a){n.xAxis[0].addPlotLine({value:a.value,id:a.id||a.value,label:{text:a.label||"label",x:a.text_left?-15:5},color:a.color||"#e98024",zIndex:4,width:a.width||2})},n.addPlotLineY=function(a){n.yAxis[0].addPlotLine({id:a.id||a.label,value:a.value,label:{text:a.label,align:"center"},color:a.color||"green",zIndex:4,width:2})},m.chart=n}function j(a,b){return c.send({ticks_history:a,granularity:0,style:"ticks",start:b,end:b+2,count:1})["catch"](function(a){})}function k(b,d){return new Promise(function(e,f){return r[d]?(r[d].moveToTop(),void e()):void c.send({proposal_open_contract:1,contract_id:b}).then(function(a){var b=a.proposal_open_contract;return void 0===b.underlying&&void 0===b.longcode?void h(b):(b.transaction_id=d,b.symbol=b.underlying,m(b),void e())})["catch"](function(b){a.growl.error({message:b.message}),f()})})}function l(a,b){{var c=a.proposal_open_contract,d=c.contract_id;c.bid_price}d==b.contract_id&&(c.validation_error?b.validation=c.validation_error:c.is_expired?b.validation="This contract has expired".i18n():c.is_valid_to_sell&&(b.validation="Note: Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.".i18n()),b.fwd_starting=c.is_forward_starting&&1*c.date_start>1*c.current_spot_time?"* Contract is not yet started.".i18n():"",1*b.table.date_expiry>=1*c.current_spot_time?(b.table.current_spot=c.current_spot,b.table.current_spot_time=c.current_spot_time,b.table.bid_price=c.bid_price,b.sell.bid_prices.length>40&&b.sell.bid_prices.shift(),b.sell.bid_prices.push(c.bid_price),void 0!==c.bid_price&&(b.sell.bid_price.value=c.bid_price,b.sell.bid_price.unit=c.bid_price.split(/[\.,]+/)[0],b.sell.bid_price.cent=c.bid_price.split(/[\.,]+/)[1]),b.sell.is_valid_to_sell=!1,b.sell.is_valid_to_sell=c.is_valid_to_sell,b.chart.manual_reflow()):b.table.current_spot_time=b.table.date_expiry,"SPREAD"===b.table.contract_type&&(b.table.profit=c.bid_price-c.buy_price,b.table.profit_point=b.table.profit/b.table.per_point,b.table.entry_tick&&(b.table.current_spot=b.table.entry_tick+b.table.profit_point*b.table.direction),c.is_sold&&(b.table.status="Closed",b.table.is_sold=c.is_sold,b.table.exit_tick=b.table.entry_tick+b.table.profit_point*b.table.direction,b.table.exit_tick_time=c.sell_timeS)),c.sell_price&&(b.table.sell_spot=c.sell_spot,b.table.sell_time=c.sell_time,b.table.sell_price=c.sell_price,b.table.final_price=c.sell_price),!b.chart.barrier&&c.barrier&&(b.chart.barrier=c.barrier,b.chart.barrier&&b.chart.chart.addPlotLineY({value:1*b.chart.barrier,label:"Barrier (".i18n()+b.chart.barrier+")"})),!b.chart.high_barrier&&c.high_barrier&&(b.chart.high_barrier=c.high_barrier,b.chart.high_barrier&&b.chart.chart.addPlotLineY({value:1*b.chart.high_barrier,label:"High Barrier (".i18n()+b.chart.high_barrier+")"})),!b.chart.low_barrier&&c.low_barrier&&(b.chart.low_barrier=c.low_barrier,b.chart.low_barrier&&b.chart.chart.addPlotLineY({value:1*b.chart.low_barrier,label:"Low Barrier (".i18n()+b.chart.low_barrier+")",color:"red"})))}function m(d){require(["text!viewtransaction/viewTransaction.html"],function(f){var g=a(f).i18n(),h=o(d,g),i=function(a){l(a,h)},j=b.createBlankWindow(g,{title:d.display_name+" ("+d.transaction_id+")",width:700,minWidth:490,minHeight:480,height:480,destroy:function(){},close:function(){k&&k.unbind(),c.proposal_open_contract.forget(d.contract_id),c.events.off("proposal_open_contract",i);for(var b=0;b<h.onclose.length;++b)h.onclose[b]();a(this).dialog("destroy").remove(),r[d.transaction_id]=void 0},open:function(){c.proposal_open_contract.subscribe(d.contract_id),c.events.on("proposal_open_contract",i)},resize:function(){h.chart.manual_reflow()},"data-authorized":"true"});j.dialog("open");var k=e.bind(g[0],h);r[d.transaction_id]=j})}function n(b,d){b.sell.sell_at_market_enabled=!1,require(["text!viewtransaction/viewTransactionConfirm.html","css!viewtransaction/viewTransactionConfirm.css"]),c.send({sell:b.contract_id,price:0}).then(function(c){var f=c.sell;require(["text!viewtransaction/viewTransactionConfirm.html","css!viewtransaction/viewTransactionConfirm.css"],function(c){var g=b.table.buy_price,h={longcode:b.longcode,buy_price:g,sell_price:f.sold_for,return_percent:(100*(f.sold_for-g)/g).toFixed(2)+"%",transaction_id:f.transaction_id,balance:f.balance_after,currency:b.table.currency},i=a(c).i18n();d.after(i);var j=e.bind(i[0],h);b.onclose.push(function(){j&&j.unbind()})})})["catch"](function(b){a.growl.error({message:b.message})})}function o(a,b){var d={route:{value:"table",update:function(a){d.route.value=a}},contract_id:a.contract_id,longcode:a.longcode,validation:a.validation_error||!a.is_valid_to_sell&&"Resale of this contract is not offered".i18n()||a.is_expired&&"This contract has expired".i18n()||"-",table:{is_expired:a.is_expired,currency:(a.currency||"USD")+" ",current_spot_time:a.current_spot_time,current_spot:a.current_spot,contract_type:a.contract_type,date_start:a.date_start,date_expiry:a.date_expiry,entry_tick:a.entry_tick||a.entry_spot,entry_tick_time:a.entry_tick_time,exit_tick:a.exit_tick,exit_tick_time:a.exit_tick_time,buy_price:a.buy_price,bid_price:void 0,final_price:a.is_sold?a.sell_price&&formatPrice(a.sell_price):void 0,tick_count:a.tick_count,prediction:a.prediction,sell_time:1*a.sell_spot_time||void 0,sell_spot:a.sell_spot,sell_price:a.is_sold?a.sell_price:void 0,purchase_time:a.purchase_time,is_sold_at_market:!1},chart:{chart:null,symbol:a.symbol,display_name:a.display_name,barrier:a.barrier,high_barrier:a.high_barrier,low_barrier:a.low_barrier,loading:"Loading "+a.display_name+" ...",type:"ticks"},sell:{bid_prices:[],bid_price:{unit:void 0,cent:void 0,value:void 0},sell_at_market_enabled:!0,is_valid_to_sell:!1},onclose:[]};if(0===a.contract_type.indexOf("SPREAD")){var e=a.shortcode.toUpperCase(),f=e.replace(a.underlying.toUpperCase()+"_","").split("_");d.table.contract_type="SPREAD",d.table.status=a.is_sold?"Closed":"Open",d.table.per_point=f[1],d.table.stop_loss=f[3],d.table.stop_profit=f[4],d.table.is_point="POINT"===f[5],d.table.is_up="U"===a.shortcode["spread".length],d.table.direction=d.table.is_up?1:-1,d.table.amount_per_point=d.table.is_up?"+"+d.table.per_point:"-"+d.table.per_point,d.table.is_sold=a.is_sold,d.table.exit_tick_time=d.table.is_sold?a.sell_time:void 0,d.table.profit=parseFloat(a.sell_price?a.sell_price:a.bid_price)-parseFloat(a.buy_price),d.table.profit_point=d.table.profit/d.table.per_point,d.table.pro_los="Profit/Loss ("+d.table.currency.replace(" ","")+")",d.table.request={proposal:1,symbol:a.underlying,currency:a.currency,contract_type:f[0],amount_per_point:d.table.per_point,stop_loss:d.table.stop_loss,stop_profit:d.table.stop_profit,stop_type:f[5].toLowerCase()}}return d.sell.sell=function(){n(d,b)},d.chart.manual_reflow=function(){var a=-1*(b.find(".longcode").height()+b.find(".tabs").height()+b.find(".footer").height())-16;if(d.chart.chart){var c=b,e=(c.find(".transaction-chart"),c.width()-10),f=c.height();d.chart.chart.setSize(e,f+a,!1),d.chart.chart.hasUserSize=null,d.chart.chart.series[0]&&0===d.chart.chart.series[0].data.length?d.chart.chart.showLoading():d.chart.chart.hideLoading()}},q(d,b).then(function(){d.table.sell_time&&d.chart.chart.addPlotLineX({value:1e3*d.table.sell_time,label:"Sell Time".i18n()})}),c.events.on_till("transaction",function(a){var b=a.transaction;return"sell"===b.action&&b.contract_id==d.contract_id?(c.send({proposal_open_contract:1,contract_id:d.contract_id}).then(function(a){l(a,d)})["catch"](function(a){}),!0):void 0}),d}function p(b,e){var f=d.keyFor(b.chart.symbol,e);if(d[f])d.subscribe(f);else{var g={symbol:b.chart.symbol,subscribe:1,granularity:e,style:0===e?"ticks":"candles"};d.register(g)["catch"](function(b){a.growl.error({message:b.message})})}var h=void 0,i=void 0;if(0===e){var j=null;h=c.events.on("tick",function(a){if(a.tick&&a.tick.symbol===b.chart.symbol){var c=b.chart.chart,d=a.tick;c&&c.series[0].addPoint([1e3*d.epoch,1*d.quote]),1*d.epoch>1*b.table.date_expiry&&(j&&(b.table.exit_tick=j.quote,b.table.exit_tick_time=1*j.epoch,b.validation="This contract has expired".i18n(),b.table.is_expired=!0),l()),j=d}})}else i=c.events.on("ohlc",function(a){var c=d.keyFor(a.ohlc.symbol,a.ohlc.granularity);if(f==c){var e=b.chart.chart;if(e){var g=e.series[0],h=g.data[g.data.length-1],i=a.ohlc,j=[1e3*i.open_time,1*i.open,1*i.high,1*i.low,1*i.close];h.x!=j[0]?g.addPoint(j,!0,!0):h.update(j,!0),1*i.epoch>1*b.table.date_expiry&&l()}}});var k=!1,l=function(){k||(k=!0,d.unregister(f),h&&c.events.off("tick",h),i&&c.events.off("candles",i))};b.onclose.push(l)}function q(a,b){var d=(a.table,Math.min(1*a.table.date_expiry,f.utc().unix())-(a.table.purchase_time||a.table.date_start)),e=0,h=0;e=3600>=d?0:7200>=d?60:21600>=d?120:86400>=d?300:3600,h=0===e?Math.max(3,30*d/3600|0):3*e;var k={ticks_history:a.chart.symbol,start:1*(a.table.purchase_time||a.table.date_start)-h,end:a.table.date_expiry?1*a.table.date_expiry+h:"latest",style:"ticks",count:4999};return 0!==e&&(k.granularity=e,k.style="candles",a.chart.type="candles"),a.table.is_expired||p(a,e),c.send(k).then(function(d){a.chart.loading="";var e={title:a.chart.display_name};d.history&&(e.history=d.history),d.candles&&(e.candles=d.candles);var f=i(b,a,e);d.history&&!a.table.entry_tick_time&&(a.table.entry_tick_time=d.history.times.filter(function(b){return 1*b>1*a.table.date_start})[0],a.table.entry_tick||(a.table.entry_tick=d.history.prices.filter(function(b,c){return 1*d.history.times[c]>1*a.table.date_start})[0])),(d.candles&&!a.table.entry_tick_time||0===a.table.contract_type.indexOf("SPREAD"))&&(a.table.entry_tick=void 0,j(a.chart.symbol,a.table.date_start).then(function(b){var d=b.history;1===d.times.length&&(a.table.entry_tick_time=d.times[0],0===a.table.contract_type.indexOf("SPREAD")&&c.send(a.table.request).then(function(b){a.table.spread=b.proposal.spread,a.table.decPlaces=(/^\d+(\.\d+)?$/.exec(d.prices[0])[1]||"-").length-1,a.table.entry_tick=parseFloat(1*d.prices[0]+a.table.direction*a.table.spread/2),a.table.stop_loss_level=a.table.entry_tick+a.table.stop_loss/(a.table.is_point?1:a.table.per_point)*-a.table.direction,a.table.stop_profit_level=a.table.entry_tick+a.table.stop_profit/(a.table.is_point?1:a.table.per_point)*a.table.direction,a.table.is_sold&&(a.table.exit_tick=a.table.entry_tick+a.table.profit_point*a.table.direction),c.send({forget:b.proposal.id})})["catch"](function(a){}),f.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot".i18n()}))})),d.history&&!a.table.exit_tick_time&&a.table.is_expired&&"SPREAD"!=a.table.contract_type&&(a.table.exit_tick_time=g.last(d.history.times.filter(function(b){return 1*b<=1*a.table.date_expiry})),a.table.exit_tick=g.last(d.history.prices.filter(function(b,c){return 1*d.history.times[c]<=1*a.table.date_expiry}))),d.candles&&!a.table.exit_tick_time&&a.table.is_expired&&j(a.chart.symbol,a.table.date_expiry-2).then(function(b){var c=b.history;1===c.times.length&&(a.table.exit_tick_time=c.times[0],0!==a.table.contract_type.indexOf("SPREAD")&&(a.table.exit_tick=c.prices[0],f.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot".i18n(),text_left:!0})))}),a.table.purchase_time&&f.addPlotLineX({value:1e3*a.table.purchase_time,label:"Purchase Time".i18n()}),a.table.entry_tick_time&&f.addPlotLineX({value:1e3*a.table.entry_tick_time,label:"Entry Spot".i18n()}),a.table.exit_tick_time&&f.addPlotLineX({value:1e3*a.table.exit_tick_time,label:"Exit Spot".i18n(),text_left:!0}),a.table.date_expiry&&f.addPlotLineX({value:1e3*a.table.date_expiry,label:"End Time".i18n()}),a.table.date_start&&f.addPlotLineX({value:1e3*a.table.date_start,label:"Start Time".i18n(),text_left:!0}),a.chart.barrier&&f.addPlotLineY({value:1*a.chart.barrier,label:"Barrier (".i18n()+a.chart.barrier+")"}),a.chart.high_barrier&&f.addPlotLineY({value:1*a.chart.high_barrier,label:"High Barrier (".i18n()+a.chart.high_barrier+")"}),a.chart.low_barrier&&f.addPlotLineY({value:1*a.chart.low_barrier,label:"Low Barrier (".i18n()+a.chart.low_barrier+")",color:"red"}),a.chart.chart=f,a.chart.manual_reflow()})["catch"](function(b){a.chart.loading=b.message})}var r={};require(["css!viewtransaction/viewTransaction.css"]),require(["text!viewtransaction/viewTransaction.html"]);var s=null;return{init:k}});