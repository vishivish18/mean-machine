angular.module('app')
.service('UserSvc', function($http,$window){
	var svc = this
	svc.getUser= function(){
		return $http.get('api/users')
	}

	svc.login = function(username,password){
		return $http.post('api/sessions',{
			username : username, password : password
		}).then(function(val){			
			svc.token = val.data
			$window.sessionStorage["user_token"] = JSON.stringify(svc.token)
			$http.defaults.headers.common['x-auth'] = val.data
			return svc.getUser()
		})
	}


	svc.register = function (username,password){
		return $http.post('api/users',{
			username : username, password : password
		}).then(function(val){			
			return val;
			//return svc.login(username,password) This line is not workung. Why ?

		})
	}

})