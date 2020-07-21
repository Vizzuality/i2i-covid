import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import Modal from 'components/modal';
import Button from 'components/button';

const Questions = ({ question, iso, query }) => {

  const [{ isOpen }, setState] = useState({
    isUrlCopied: false,
    isEmbedCopied: false,
    isOpen: false,
  });

  const toggleModal = () => {
    setState({ isOpen: !isOpen });
  };

  useEffect(() => {
    if (isOpen) {
      ReactGA.event({
        category: 'UI',
        action: 'Share modal is open',
      });
    }
  });

  return (
    <div className="c-question">
      <Button className="-border-color-2 -small" onClick={toggleModal}>
        Question
      </Button>
      <Modal
        title="Question"
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
        actionsComponent={() => (
          <div className="c-filters-action-buttons">
            <Button className="-border-color-1" onClick={toggleModal}>
              Close
            </Button>
          </div>
        )}
      >
       <p>{question}</p> 
      </Modal>
    </div>
  );
};

Questions.propTypes = {
  query: PropTypes.string,
  iso: PropTypes.string,
};

Questions.defaultProps = {
  query: '',
  iso: '',
};

export default Questions;
