export default (state ={data:[],loading:false},action) =>{
	switch (action.type){
		case 'GET_ANNOTATION':{
			console.log("ann data" , action.data)
		  return {
		  		...state,
		  		data : action.data,
		  		loading :action.loading
		  }
		}
		case 'POST_ANNOTATION':{
		  return {
		  		...state,
		  		data : action.data,
		  		loading :action.loading
		  }
		}
		default :
			return state
	}
}