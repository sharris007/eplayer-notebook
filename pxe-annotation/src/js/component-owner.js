// In React, an owner is the component that sets the props of other components, if desired.
// (see https://facebook.github.io/react/docs/multiple-components.html)
//
// NOTE: If you want to reference another Origami component in this file's JSX below, import
// its src/js/component-owner.js directly from this project's /node_modules.

//import '../scss/component-specific.scss';

import React, {PropTypes} from 'react';

import Annotation from './Annotation';

class ComponentOwner extends React.Component {

  //
  // Modify or add prop types to validate the properties passed to this component!
  // This is defined using an ES7 class property (transpiled by Babel Stage 0)
  //
  static propTypes = {
    contentId:PropTypes.string.isRequired,
    annotationData:PropTypes.array.isRequired, 
    shareableAnnotations:PropTypes.bool.isRequired, 
    annotationEventHandler:PropTypes.func.isRequired, 
    currentPageDetails:PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  //
  // Note that combining the fat arrow syntax with ES7 class properties (transpiled by Babel Stage 0), we eliminate the
  // need to do manual binding of the 'this' context in event handlers or callbacks. React binds all other contexts
  // as expected.
  //

  render() {
    const { contentId, annotationData, shareableAnnotations, annotationEventHandler, currentPageDetails, annAttributes} = this.props;
    return (
      <div>
        <Annotation contentId={contentId} annotationData={annotationData} 
                    shareableAnnotations={shareableAnnotations} annotationEventHandler={annotationEventHandler} 
                    currentPageDetails={currentPageDetails} annAttributes={annAttributes} isComponent = {true}/>
      </div>
    );
  };  
}

export default (ComponentOwner); // Inject this.props.intl into the component context
