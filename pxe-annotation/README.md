###Annotation Document
 
###Script & Css inclusion:
###The below scripts and Css should be in app head tag :
--------------------------------------------------------------------
Jquery library
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
  Script File :
  	<script src="https://pxe-sdk.dev-openclass.com/eplayer-ann/annotator.min.js"></script>
 
  CSS File:
	<link rel="stylesheet" href="https://pxe-sdk.dev-openclass.com/eplayer-ann/annotator.min.css"/> 
-------------------------------------------------------------------------------------------------------- 
###Dependency module in Package.json:
 
"pxe-annotation": "^1.1.7"
 
-------------------------------------------------------------------------------------------------------- 
###Annotation Component creation in Client app:
Include the following lines in  the application
 
import { Annotation } from 'pxe-annotation';
 
<Annotation
	annotationData = {annotionData}   
	contentId="pxe-viewer"
   annotationEventHandler= {this.annotationCallBack.bind(this)}
   currentPageDetails ={this.state.currentPageDetails}
   shareableAnnotations = {true}
 />
 
--------------------------------------------------------------------------------------------------------
 
### annotionData   :
Sample request Json Object:
[{"_id":{"$oid":"58a2e0efbd966f2cc1eb8c21"},"playOrder":5,"href":"OPS/s9ml/chapter01/filep70004957770000000000000000008ab.xhtml","text":"asdasdasd","ranges":[{"start":"/div/div/section/header/h1","startOffset":9,"end":"/div/div/section/header/h1","endOffset":34}],"quote":"aluating Scientific Infor","highlights":[{"jQuery172026420006517730954":11}]},{"_id":{"$oid":"58a2d3a2c2ef162b33fbb143"},"playOrder":1,"href":"OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml","text":"tweast ","ranges":[{"start":"/div/div/section/section/p[4]","startOffset":381,"end":"/div/div/section/section/p[4]","endOffset":714}],"quote":"nt variable may or may not be influenced by changes in the independent variable","highlights":[{"jQuery172007264313690467428":10}]}]
 
contentId:
       	Annotations applies only for the content which is reside within the given Id.
 
this.annotationCallBack.bind(this) :
The call back function which will return current  annotated object to the client application from annotation component . Client can perform POST ,PUT ,DELETE operation by this method.
---------------------------------------------------------------------------------------------------------
 
 
###annotationEventHandler Call back function:
annotationCallBack = (eventType, data) => {
 
    switch (eventType) {
        case 'annotationCreated': {
          return this.props.dispatch(postAnnCallService(data));
        }
        case 'annotationEditorSubmit':{
          if(data.annotation._id)
          return this.props.dispatch(putAnnCallService(data.annotation));
        }
        case 'annotationDeleted': {
          return ((data._id)?this.props.dispatch(deleteAnnCallService(data)):'');
        }
        default : {
          return eventType;
        }
    }
  }
 
###  Call back response Object:
{"playOrder":5,"href":"OPS/s9ml/chapter01/filep70004957770000000000000000008ab.xhtml","text":"asdasdasd","ranges":[{"start":"/div/div/section/header/h1","startOffset":9,"end":"/div/div/section/header/h1","endOffset":34}],"quote":"aluating Scientific Infor","highlights":[{"jQuery172026420006517730954":11}]}
----------------------------------------------------------------------------------------------------------- 
###  POST Json Object format from Annotation Component:
Request Payload:
{"playOrder":1,"href":"OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml","text":"test","ranges":[{"start":"/div/div/section/p[2]","startOffset":313,"end":"/div/div/section/p[2]/i[2]","endOffset":25}],"quote":"ed testing and all reasonable alternative hypotheses have been eliminated, scientists accept that the well-supported hypothesis is, in a practical sense, true. Truth in science can therefore be defined as what we know and understa","highlights":[{"jQuery17207752715492859923":13},{"jQuery17207752715492859923":14},{"jQuery17207752715492859923":15},{"jQuery17207752715492859923":16}]}
----------------------------------------------------------------------------------------------------------- 
###  DELETE Callback object from Annotation  component:
{"_id":{"$oid":"58a2e0efbd966f2cc1eb8c21"},"playOrder":5,"href":"OPS/s9ml/chapter01/filep70004957770000000000000000008ab.xhtml","text":"asdasdasd","ranges":[{"start":"/div/div/section/header/h1","startOffset":9,"end":"/div/div/section/header/h1","endOffset":34}],"quote":"aluating Scientific Infor","highlights":[{"jQuery172026420006517730954":11}]}
------------------------------------------------------------------------------------------------------------ 
### PUT Callback Object from Annotation Component:
{"_id":{"$oid":"58a2e0efbd966f2cc1eb8c21"},"playOrder":5,"href":"OPS/s9ml/chapter01/filep70004957770000000000000000008ab.xhtml","text":"asdasdasd","ranges":[{"start":"/div/div/section/header/h1","startOffset":9,"end":"/div/div/section/header/h1","endOffset":34}],"quote":"aluating Scientific Infor","highlights":[{"jQuery172026420006517730954":11}]}

------------------------------------------------------------------------------------------------------------
  
this.state.currentPageDetails :
We will send the Page Details with the callback response object.
Json Object (Sample):
{urlsJson:pageDetails.playlistUrl,baseUrl:pageDetails.baseUrlcurrentPlayList:{'href':'OPS/s9ml/chapter01/filep7000495777000000000000000000752.xhtml','playOrder':pageId,'title':'1.2 Hypothesis Testing'}}
-------------------------------------------------------------------------------------------------------------
