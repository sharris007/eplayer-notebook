import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import { red600, grey50 } from 'material-ui/styles/colors';

const errorCard = (header, message) => {
  const style = {
    maxWidth: 500,
    backgroundColor: red600,
    margin: '20px auto',
    color: grey50
  };

  return (
    <Card style={style}>
      <CardText style={{ color: grey50 }}>
        <h1>{header}</h1>
        {message}
      </CardText>

    </Card>
  );
};

export default errorCard;
