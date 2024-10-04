import React from 'react';
import { decodeHtml } from '../utils/decodeHtml';

function withHtmlDecoding(WrappedComponent) {
  return function(props) {
    const decodedProps = Object.keys(props).reduce((acc, key) => {
      if (typeof props[key] === 'string') {
        acc[key] = decodeHtml(props[key]);
      } else if (typeof props[key] === 'object' && props[key] !== null) {
        acc[key] = JSON.parse(JSON.stringify(props[key]), (key, value) =>
          typeof value === 'string' ? decodeHtml(value) : value
        );
      } else {
        acc[key] = props[key];
      }
      return acc;
    }, {});

    return <WrappedComponent {...decodedProps} />;
  }
}

export default withHtmlDecoding;