# popup-info

## Summary

PopUp-Info is an initiative to build a component based player adhering to both the Origami and UX frameworks. This module aims to render the react popup with some custom settings.

## Description

To use the popup-info component in your application, kindly take the latest version of the popup-info in your application.
"popup-info": "^1.0.10"

Include the following lines in  the application
import {PopUpInfo} from 'popup-info';

In render method of the application :
<PopUpInfo popUpCollection = {this.state.popUpCollection} bookId = {bookId}/>

# popUpCollection

popUpCollection is an array of objects and its structure need to be followed as


popUpCollection = [ {
                        ‘popOverCollection’ : { ‘popOverDescription’ : “Desc1”, ‘popOverTitle’ : “Title1” },
                                     ‘item’ : DOM of the link(Glossary) or Icon(MoreInfo)                               
                    } ,
                    {
                       ‘popOverCollection’ : { ‘popOverDescription’ : “Desc2”, ‘popOverTitle’ : “Title2” },
                                    ‘item’ : DOM of the link(Glossary) or Icon(MoreInfo)                               

                    }, .. ,
                    {
                        ‘popOverCollection’ : { ‘popOverDescription’ : “DescN”, ‘popOverTitle’ : “TitleN” },
                                     ‘item’ : DOM of the link(Glossary) or Icon(MoreInfo)                               
                    }
                  ]
# bookId
 Id of the bookContainer
 
After passing all the required properties from the client application to popup-info component, popup-info component will handle the clicks, positioning the popup, and rendering the popup. 

this.popUpArray[i] = popUpProps.popOverCollection;
this.bookDiv = popUpProps.bookDiv
popUpProps.item.addEventListener('click', this.framePopOver.bind(this, i));

## Next Step

If you are a consumer of this component, see guidance on [usage](README.usage.md).

If you are a contributor to this component's development, see guidance on [contributing](README.contribute.md).
