import  {  Component, PropTypes } from 'react';
// import renderHTML from 'react-render-html';

class DemoBookViewer extends Component {
  constructor(props) {
    super(props);   
    this.state = {
      bookHTML : ''
    };
  }

  componentDidMount() {
    this.loadFrame(this.props);
  }

  loadFrame(props) {
    const content = props.bookHTML;
    if (this.frame) {
      setTimeout(() => {
        this.frame.height = 600;
        const doc = this.frame.contentWindow.document;
        const index = content.indexOf('<head');
        const newContent = `${content.slice(0, index)}
            <base href="${this.props.basePath}" />
             ${content.slice(index)}`;
        doc.writeln(newContent);
        doc.close();
        this.fixFrameHeightRecursively(3, 100, 300);
      }, 1);
    }
  }

  fixFrameHeight() {
    if (!this.frame) {
      return;
    }
    const iframeHeight = this.frame.height.split('px')[0];
    if (this.frame.contentWindow) {
      const scrollHeight = this.frame.contentWindow.document.body.scrollHeight;
      if (iframeHeight < scrollHeight) {
        this.frame.height = `${this.frame.contentWindow.document.body.scrollHeight + 65}px`;
      }
    }
  }

  fixFrameHeightRecursively = (repetitions, initialDelay, incrementalDelay) => {
    let count = 0;
    if (this.fixHeightTimeoutId) {
      clearTimeout(this.fixHeightTimeoutId);
    }
    const fixHeight = () => {
      this.fixFrameHeight();
      if (count < repetitions) {
        const delay = (count += 1) * incrementalDelay;
        this.fixHeightTimeoutId = setTimeout(fixHeight, delay);
      }
    };
    this.fixHeightTimeoutId = setTimeout(fixHeight, initialDelay);
  };

  parseComponents() {
    if (this.frame) {
      this.props.onBookLoad();
    }
  }

  render() {
    const pageComponent=(
      <iframe
        ref={(c) => {
          this.frame = c;
        }}
        id="contentIframe"
        width="100%"
        height="600"
        style={{ border: '0px solid #ffffff' }}
        onLoad={() => this.parseComponents(this)}
        allowFullScreen="allowfullscreen"
      />
      );
    return (<div>{pageComponent}</div>);
  }
  
}

DemoBookViewer.PropTypes = {
  bookHTML: PropTypes.string.isRequired
}

export default DemoBookViewer;
