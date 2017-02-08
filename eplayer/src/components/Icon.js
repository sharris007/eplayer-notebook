import React from 'react';
import SVGSprite from './assets/p-icons-sprite-1.1.svg';

const Icon = (props) => {
  const iconClass = `pe-icon--${props.name}`;

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      role="img"
      className={iconClass}
    >
      <use xlinkHref={`${SVGSprite}#${props.name}`} />
    </svg>
  );
};

Icon.propTypes = {
  name: React.PropTypes.string.isRequired
};

export default Icon;
