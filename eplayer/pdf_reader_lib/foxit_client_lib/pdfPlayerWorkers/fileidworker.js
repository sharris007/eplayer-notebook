onmessage =  function(e) {
	var pdfPathList = e.data[0];
	var fileIdsList = e.data[1];
	var startIndex = e.data[2];
	var endIndex = e.data[3];
	var userName = e.data[4];
	var userId = e.data[5];
	var SparkMD5Hash = e.data[6];
	var serverBaseUrl = e.data[7];
	var fileIDsList = [];
	for(let i=startIndex;i<=endIndex;i++) {
		var a = pdfPathList[i].pdfPath;
		let currentpdfPath = pdfPathList[i].pdfPath;
		var index = a.lastIndexOf("/");
		var b = a.substring(index + 1);
        var e = new XMLHttpRequest,
            f = a.indexOf("blob") ? "blob" : "arraybuffer";
        e.open("GET", a, !0), e.responseType = f;
        e.addEventListener("load", function(e) {
            var f = this.getResponseHeader("Last-Modified"),
                h = this.response,
                i = h.size,
                j = new FileReader;
            j.readAsArrayBuffer(h), j.onload = function(e) {
                var l = SparkMD5Hash;
                j = null; 
                var h = !1;
             	var j = serverBaseUrl, k = userName, l1 = userId;
             	var m = "http";
             	h && (m = "local");
                var xhr = new XMLHttpRequest();              
                var params = "plugin="+m+"&fileUri="+a+"&fileName="+b+"&version="+f+"&fileSize="+i+"&md5="+l+"&userId="+l1+"&userName="+k+"&fileMd5=";
                xhr.open('GET',  j + "api/file/id?"+params, false);
                xhr.onload = function () {
			    	if(this.responseText)
			    	{
			    		let responseObj = JSON.parse(this.responseText);
			    		let id = responseObj.id;
			    		sendFileIdToMainThread(id,currentpdfPath);
			    	}
				};
				xhr.send(null);
            }
        }, !1), e.addEventListener("error", function() {}, !1), e.send()
    }
    
}
function sendFileIdToMainThread(id,currentpdfPath) {
    var fileIDObject = {};
    fileIDObject[currentpdfPath] = id;
    self.postMessage(fileIDObject);
}