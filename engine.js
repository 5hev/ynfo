function getPairsArray(pairs) {
	Cookies.set('url', pairs);
	console.log(' > Saved to cookies (url): ', Cookies.get('url'));
	var aResult = [];	
	// split pairs (might be several names for one pair)
	var aPairs = pairs.split('-');
	//several exchanges, need to split pairs
	aPairs.forEach(function(item,i,aPairs){aResult[i]=aPairs[i].split(';');});
	if(aResult) {
		return aResult;
	} else {
		console.log(' # Error in getPairsArray().');
	}
}

function queryYobit(aPairs) {
	aPairs.forEach(function(item,i,aPairs){aPairs[i]=aPairs[i][0];});
	return aPairs.join('-');
}

function getValues(pairs)
	{	
		var URLproxy = 'https://cors-anywhere.herokuapp.com/';
		var URLyobit = 'yobit.net/api/3/ticker/';
		var URLnova =  'novaexchange.com/remote/v2/';
		var URLpolo =  'poloniex.com/public';
		var aPairs = getPairsArray(pairs);
		var rObjYobit;
		var rObjNova;
		var rObjPolo;
		
	//query Yobit		
		$.ajax({
			url: URLproxy + URLyobit + queryYobit(aPairs),
			headers: {'X-Requested-With': 'XMLHttpRequest'},
			success: function (response, status, jqHRXobject) {
				rObjYobit = $.parseJSON(response);
			}}
			);	
	//query Nova		
		$.ajax({
			url: URLproxy + URLnova + 'markets/',
			headers: {'X-Requested-With': 'XMLHttpRequest'},
			success: function (response, status, jqHRXobject) {
				rObjNova = $.parseJSON(response).markets;
			}}
			);	
	//query Polo		
		$.ajax({
			url: URLproxy + URLpolo + '?command=returnTicker',
			headers: {'X-Requested-With': 'XMLHttpRequest'},
			success: function (response, status, jqHRXobject) {
				rObjPolo = $.parseJSON(response);
			}}
			);	
		

	$('.start').empty();
	$('.start').append('<div class="res"><span class="res">Валюта</span><span class="res">YOBIT</span><span class="res">NOVA</span><span class="res">POLONIEX</span></div>');

			Object.keys(rObjYobit).forEach(function(key, id) {
				var keyDataNova = rObjNova.filter(function(el){return el.marketname == aPairs[id][1]})[0];
				var keyDataPolo = rObjPolo[aPairs[id][2]];
				var keyOldPrices = Cookies.get(key).split(';');
				
				$('.start').append('<div class="res' + id + '"><span class="res' + id + '_0"></span><span class="res' + id + '_1"></span><span class="res' + id + '_2"></span><span class="res' + id + '_3"></span></div>');
				
			$('.res' + id + '_0').html(key);
/*				
				if (keyOldPrices){
				keyOldPrices.forEach(
					function(item,i,keyOldPrices) {
						//$('.res' + id + '_' + i + 1).html('0.00% '+);

					}
				)
				} else {
*/
			$('.res' + id + '_1').html('0.00% ' + rObj[key].last.toFixed(9) + rObj[key].vol.toFixed(2));
			$('.res' + id + '_2').html('0.00% ' + keyDataNova.last_price.toFixed(9) + keyDataNova.volume24h.toFixed(2));
			$('.res' + id + '_3').html('0.00% ' + keyDataPolo.last.toFixed(9) + keyDataPolo.baseVolume.toFixed(2));
//				}
				
/*					if (Cookies.get(key) && Cookies.get(key) != rObj[key].last) {
						$('span[class^=res' + id).css("background-color", "#ffa500");
						$('span[class^=res' + id).animate({ backgroundColor: "#fff" }, 1000 );
						var newChange = rObj[key].last / Cookies.get(key);
						var newChangeStr = "";
						
						if (newChange >= 1) { 
							newChangeStr = "+" + (100 * (newChange - 1)).toFixed(2) + "%"; 
						} else {
							newChangeStr = (100 * (newChange - 1)).toFixed(2) + "%" ;
						}
						
						$('.res' + id + '_1').html(newChangeStr);
						Cookies.set(key + "_1", newChangeStr);
					} else if (Cookies.get(key + "_1")) {
						$('.res' + id + '_1').html(Cookies.get(key + "_1"));
					} else {
						$('.res' + id + '_1').html('0.00%');
					}
						
				if ((newChangeStr && newChangeStr.length > 6) || $('.res' + id + '_1').html().length > 6) {
					$('span[class^=res' + id).css("background-color", "#ff0");
				}
				$('.res' + id + '_2').html(rObj[key].last);
				$('.res' + id + '_3').html(rObj[key].vol.toFixed(2));
*/
				Cookies.set(key, rObj[key].last + ';' + keyDataNova.last_price + ';' + keyDataPolo.last, { expires: 7 });
				console.log(' > Saved to cookies: ', Cookies.get(key));
					})
		};
			
		$(document).ready(function(){  
			if (Cookies.get('url')) {
				$('#url').val(Cookies.get('url'));
			} else {
				Cookies.set('url','btc_rur-eth_btc-bitok_btc', { expires: 7 });
				console.log(' > Saved to cookies (url): ', Cookies.get('url'));
			}
			getValues(Cookies.get('url'));
			setInterval('getValues()',10000);  
        });
