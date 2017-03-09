import React from 'react';

import './CoreLayout.scss';
import '../../styles/core.scss';
import '../../styles/FxOnlineReader.scss';
import '../../styles/jquery.jscrollpane.scss';
import '../../styles/navigation.scss';
import '../../styles/spectrum.scss';
import '../../styles/toolbar.scss';
import '../../styles/webpdfDemoPC.scss';

export const CoreLayout = ({ children }) => (
  <div>
    <div className="text-center">
      <div className="core-layout__viewport">
        {children}
      </div>
    </div>
  </div>
);

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default CoreLayout;
