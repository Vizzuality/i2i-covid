import React from 'react';

import info from './constants';

const Disclaimer = () => {
  return (
    <section className="c-disclaimer">
      <div className="container">
        <p>
          <span>Note: </span>
          {info}
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
