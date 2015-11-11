angular.module('app')
.run(function($rootScope,$timeout){
	(function connect(){
	var url = 'wss://frozen-brushlands-5757.herokuapp.com'
	var connection = new WebSocket(url)
		connection.onclose = function(e){
		console.log('WebSocket Disconnected......')
		$timeout(connect,10*1000)
		}	

	connection.onmessage = function(e){
		console.log(e)
		console.log("New WebSocket Connected")
		var payload = JSON.parse(e.data)
		$rootScope.$broadcast('ws:'+payload.topic, payload.data)
	}

	})()
	
})