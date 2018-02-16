onmessage =  function(e) {
	
	var pdfPathList = e.data[0];
	var startIndex = e.data[1];
	var endIndex = e.data[2];
	var xmlHttp = new XMLHttpRequest();
	for(let i=startIndex;i<=endIndex;i++) {
    	 xmlHttp.open( "GET", pdfPathList[i].pdfPath, false );
    	 xmlHttp.send( null );
    }
    self.postMessage("Success");
}