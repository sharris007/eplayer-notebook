/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
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
