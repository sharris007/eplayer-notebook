/**
 * Tree View implementation. Currently called from a Table Of Contents component for that specific purpose.
 * Can be optimized to display as two different components.
 * @type {boolean} showDuplicateTitle - optional param to repeat the chapter title in display.
 * @type {boolean} separateToggleIcon - optional param to make the toggle icon separate from the content.
 */

import React, {PropTypes} from 'react';
import {intlShape, injectIntl} from 'react-intl';
import {messages} from './defaultMessages';
import ReactDom from 'react-dom';
import IconButton from 'material-ui/IconButton'
import SvgIcon from 'material-ui/SvgIcon'

const ExpandBtn = (props) => (
  <SvgIcon {...props}>
    <path d="M1158.33104,54.2836362 C1158.71313,53.9055017 1159.33176,53.9055017 1159.71386,54.2836362 C1160.0951,54.6614882 1160.09566,55.2744731 1159.71386,55.6528903 L1154.1919,61.064623 C1153.80981,61.4427575 1153.19061,61.4427575 1152.80852,61.064623 L1147.28657,55.6528903 C1146.90448,55.2744731 1146.90448,54.6620534 1147.28657,54.2836362 C1147.66838,53.9055017 1148.2873,53.9055017 1148.66911,54.2833536 L1153.50007,58.7214888 L1158.33104,54.2836362 Z"  fill="#252525" transform="translate(-1147.000000, -54.000000)"></path>
  </SvgIcon>
);

const CollapseBtn = (props) => (
  <SvgIcon {...props}>
    <path d="M2.60946667,7.99993333 L9.47146667,1.13793333 C9.73146667,0.877266667 9.73146667,0.455933333 9.47146667,0.195266667 C9.21146667,-0.0654 8.7888,-0.0654 8.5288,0.195266667 L1.19546667,7.5286 C0.9348,7.78926667 0.9348,8.2106 1.19546667,8.47126667 L8.5288,15.8046 C8.6588,15.9346 8.82946667,15.9999333 9.00013333,15.9999333 C9.1708,15.9999333 9.34146667,15.9346 9.47146667,15.8046 C9.73146667,15.5439333 9.73146667,15.1226 9.47146667,14.8619333 L2.60946667,7.99993333 Z"  fill="#252525" transform="translate(376.000000, 36.833333) rotate(90.000000) translate(-376.000000, -36.833333) translate(371.500000, 28.833333)"></path>
  </SvgIcon>
);

const btnStyle = {
  width: '16px',
  height: '9px'
}
const iconButtonStyle = {
  paddingTop: '20px',
  float: 'right'
}

export class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentDepth: (this.props.currentDepth || 1),
      expanded: false
    };    
  }
  componentDidMount() {
    ReactDom.findDOMNode(this.list).setAttribute('listIndex', this.props.id);
    ReactDom.findDOMNode(this.list).setAttribute('tabIndex', '-1');
  }

  toggle() {
    this.setState({expanded : !this.state.expanded});
  }

  handleLinkClick(pageId) {
    this.props.tocClick(pageId);
  }

  isToggleAble() {
    const hasChildren = !! this.props.children.length;
    const currDepth = this.props.currentDepth;
    const depth = this.props.depth;
    return (currDepth === 1 && (hasChildren || this.props.showDuplicateTitle) ||(currDepth !== 1 && currDepth < depth && hasChildren));
  }

  getClassName() {
    const clsStr = 'content';
    const expandedClsStr = clsStr + ' expanded';
    const collapsedClsStr = clsStr + ' collapsed';
    return ((this.isToggleAble()) ? (this.state.expanded ? expandedClsStr : collapsedClsStr) : clsStr);
  }

  handleKeyDown = (event) => {
    if ((event.which === 13 || event.keyCode === 13)) {
      // ((doToggle && !this.props.separateToggleIcon)  ? this.toggle.bind(this) : this.handleLinkClick.bind(self, this.props.node.id));
      this.toggle();
    }
  }

  renderClickIcon() {
    const classStr = this.getClassName();
    const depth = this.props.depth;
    const currDepth = this.props.currentDepth;
    const hasChildren = !!(this.props.children.length);

    /*Logic to display toggle icon for first level headings and then depending on depth, show/hide the icon*/
    if (currDepth === 1 ||(currDepth !== 1 && currDepth < depth && hasChildren)) {
      return(<IconButton role="button"
        label = "Click"
        onClick= {this.toggle.bind(this)}
        className= {'icon '+ classStr}
        aria-controls= {this.props.node.id}
        aria-expanded= {this.state.expanded}
        iconStyle={btnStyle}
        style={iconButtonStyle}
      >{this.state.expanded ? <CollapseBtn viewBox="368 33 16 9" />: <ExpandBtn viewBox="0 0 16 9" />}</IconButton>)
    }else {
      return null;
    }
  }

  render() {
    let nodes = [];
    const self = this;
    const data = this.props.data;
    const depth = this.props.depth;
    const currentDepth = this.props.currentDepth;
    const classStr = this.props.separateToggleIcon ? 'content' : this.getClassName();
    const doToggle = this.isToggleAble();

    if (depth > currentDepth) {
      nodes = this.props.children.map(function(n) {
        return <TreeNode key= {'display-'+n.id} intl= {self.props.intl} node= {n} children= {n.children || []} 
        currentDepth= {currentDepth+1} data= {self.props.data} tocClick={self.props.tocClick} />
      });
      //debugger;
      if (depth > currentDepth && this.props.data.showDuplicateTitle && (this.props.children.length || currentDepth === 1)) {
        //repeat the chapter title once again as a link to the respective content.
        nodes.unshift(
          <TreeNode key= {this.props.node.id} intl= {this.props.intl} node= {this.props.node} children= {[]} 
          currentDepth= {currentDepth+1} data= {this.props.data} tocClick={self.props.tocClick} />
        )
      }
    }

    return (
      <li className= {'list-group-item ' + (this.state.expanded ? 'selected': '') + (this.props.currentDepth > 1 ? ' toc-child' : ' toc-parent')}
        onKeyDown={this.handleKeyDown}
        ref={list => this.list = list}>
        <a href= "javascript:void(0)"
          className= {classStr}
          role= "button"
          aria-controls= {this.props.node.id}
          aria-expanded= {(doToggle ? (this.state.expanded ? true : false) : '')}
          onClick= {((this.props.currentDepth > 1)  ? this.handleLinkClick.bind(self, this.props.node.id) : this.toggle.bind(this))}>
          <span className= "title">{this.props.node.title}</span>
        </a>
        {(this.props.separateToggleIcon ? this.renderClickIcon(currentDepth, depth) : '')}
        {(() => {
          if (nodes.length) {
            return(<ul id={this.props.node.id} className={'child-list-group '+(this.state.expanded ? 'show' : 'hide')} aria-hidden={!this.state.expanded}>
              {nodes}
            </ul>)
          }
        })()}
      </li>
    );
  }
}

class TreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.data.content.list,
      currentDepth: 1
    };
  }

  render() {
    const self = this;
    const list = this.state.list;
    const field = this.props.childField || 'children';
    if(this.props.data && this.props.data.content && this.props.data.content.list && this.props.data.content.list.length> 0) {
      const nodes = list.map(function(n, i) {
        return <TreeNode
           separateToggleIcon={self.props.separateToggleIcon}
           depth={self.props.depth}
           key={n.id} id={i}
           intl={self.props.intl}
           node={n}
           children={n[field] ? n[field] : []}
           currentDepth= {self.state.currentDepth}
           data={self.props.data}
           tocClick={self.props.tocClick}
        />
      });

      return(
        <ul className="list-group">
             {nodes}
        </ul>
      );
    }
    else {
      return(
        <ul className="list-group">
          <li className = {'list-group-item empty-message'}>
            <p>There are no Table Of Contents to show</p>
          </li>
        </ul>
      );
    }
  }
}

TreeView.propTypes={
  
  depth : PropTypes.number.isRequired,
  locale: PropTypes.string,
  childField: PropTypes.string.isRequired,
  data: PropTypes.shape({
    content: PropTypes.object.isRequired
  })
  
};

export default TreeView;
