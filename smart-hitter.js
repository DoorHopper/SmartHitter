shQueue = []
shRunning = []

isRunning = function(name){
	console.log('isRunning');
	var response = false;
	for(var i = 0; i<shRunning.length && !response; i++){
		if(shRunning[i] == name){
			response = true;
		}
	}
	return response;
}

addToQueue = function(name, url, data){
	console.log('addToQueue')
	shQueue.push({
		name: name,
		url: url,
		data: data
	})
}

addToRunning = function(name){
	console.log('addToRunning')
	shRunning.push(name);
}

fetchFromServer = function(name, url, data){
	console.log('fetchFromServer')
	return fetch(url, {
		method: 'GET'
	})
}

removeFromRunning = function(name){
	console.log('removeFromRunning')
	var response = false;
	for(var i=0; i<shRunning.length && !response; i++){
		if(shRunning[i]==name){
			shRunning.splice(i, 1);
			response = true
		}
	}
	return response;
}

inQueue = function(name){
	console.log('inQueue')
	var response = false;
	for(var i = 0; i<shQueue.length && !response; i++){
		if(shQueue[i].name == name){
			response = true;
		}
	}
	return response;
}

callLatest = function(name){
	console.log('callLatest')
	var achieved = false;
	var response = null;
	for(var i = shQueue.length-1; i >= 0; i--){
		if(shQueue[i].name==name){
			if(!achieved){
				achieved = true;
				response = shCall(shQueue[i].name, shQueue[i].url, shQueue[i].data);
				shQueue.splice(i, 1);
			}else{
				shQueue.splice(i, 1);
			}
		}
	}
	return response;
}

shCall = function(name, url, data){
	console.log(shCall)
	if(isRunning(name)){
		addToQueue(name, url, data);
		return new Promise(function(resolve, reject){
			reject({
				errorMessage: 'In Queue'
			})
		})
	}else{
		addToRunning(name);
		return fetchFromServer(name, url, data).then((res)=>{
			removeFromRunning(name);
			if(inQueue(name)){
				return callLatest(name);
			}else{
				return res.json();
			}
		});
	}
}