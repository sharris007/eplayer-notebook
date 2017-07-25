export const loadState = (componentState) => {
	try {
		const serializedState = localStorage.getItem(componentState);
		if(serializedState == undefined){
			return undefined;
		}
		return JSON.parse(serializedState);
	}catch(err){
		return undefined;
	}
}

export const saveState = (state) =>{
	try{
	
		if(state.bookshelf !== undefined){
			localStorage.setItem('bookshelf',JSON.stringify(state.bookshelf));
		}
		
		localStorage.setItem('book',JSON.stringify(state.book));
	
		if(state.login !== undefined){
			localStorage.setItem('login',JSON.stringify(state.login));
		}
	}catch(err){
		/*error*/
	}
}