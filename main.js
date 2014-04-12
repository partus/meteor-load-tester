var _ = require("underscore")
var webpage = require('webpage')
var pages = [];
for(var i=0; i<50; i++){
	(function(){
		var pagen = i;
		pages[i]=webpage.create()
		pages[i].onConsoleMessage = function (msg) {
	    console.log('Page'+pagen+":", msg);
	}
	})()
};

var url = "http://www.fd.am/"

_.each(pages, function(page,num){
	page.open(url, function (status) {
		console.log("Status"+num+":",status)



		var interval = setInterval(function() {
				var ready = page.evaluate(function () {
					if (typeof Meteor !== 'undefined' && typeof(Meteor.status) !== 'undefined' && Meteor.status().connected) {
						console.log("page ready", document.cookie)
						return DDP._allSubscriptionsReady();
					}
					return null;
				})
				console.log("Before ready test")
				if(ready){
					console.log("ready")
					clearInterval(interval);
					page.evaluate(shopLooper);
				}
			},800)
		})

});



function shopLooper(){
	var shops=Shops.find().fetch()
	shopn = 0;
	Meteor.setInterval(function(){
		shopn++;
		if(shopn >= shops.length) shopn = 0;
		Session.set("shopId", shops[shopn]._id)
		console.log(Session.get("shopId"))
	},2000)

}