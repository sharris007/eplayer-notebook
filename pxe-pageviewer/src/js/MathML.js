export const loadMathMLScript = () => {
  /*const init=() => {
    let scriptSrc = (window.location.href.indexOf('https://') > -1) ? 'https:' : 'http:';
    scriptSrc += '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src=scriptSrc;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }; 
  init();*/
   // CDN from CDNJS Domain
  const versions = {
    '2.4':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.4.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5.1':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5.2':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5.3':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.5.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.6':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.6.1':'//cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
  };
  //Fallback to Mathjax CDN
  const cdnVersions = {
    '2.4':'//cdn.mathjax.org/mathjax/2.4-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5.1':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5.2':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.5.3':'//cdn.mathjax.org/mathjax/2.5-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.6':'//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
    '2.6.1':'//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
  };
  //Method to retrieve the cdn path of required version
  const loadMathjax = (v, flag) =>{
    const existingVersions = (flag === true) ? cdnVersions : versions;
    let cdnUrl;
    if (v === undefined) {
      cdnUrl = existingVersions['2.6.1'];
    } else {
      cdnUrl = existingVersions[v];
      try { 
        if (cdnUrl === '') {throw 'Invalid mathjax version';};
      }
      catch (err) {
        console.log('Error in Loading Mathjax: ', cdnUrl);
      }
    }
    return cdnUrl;
  };

  const init =()=>{
    const pearsonMathjax = loadMathjax('2.6.1');
    let scriptSrc = (window.location.href.indexOf('https://') > -1) ? 'https:' : 'http:';
    scriptSrc += pearsonMathjax;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src=scriptSrc;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }; 
  init();
};
export const reloadMathMl = (pageViewerRef) => {
  const init = () => {
    try {
      // MathJax comes from script added dynamically
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, pageViewerRef.bookContainerRef]); // eslint-disable-line
      window.MathJax.Hub.Config({ // eslint-disable-line
        menuSettings: {
          zoom: 'None'
        }
      });
    } catch (e) {}
  };
  init();
};
