import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const Modal = ({ actionsComponent, children, isOpen, onRequestClose, title, ...domProps }) => (
  <ReactModal className="c-modal" isOpen={isOpen} onRequestClose={onRequestClose} {...domProps}>
    <div className="container">
      <div className="row">
        <div className="col-sm-12 cold-md-10 col-lg-10 m-auto">
          <section className="modal-container">
            <header className="modal-header">
              {title && <h2 className="modal-title">{title}</h2>}
              <button type="button" className="btn close-button" onClick={onRequestClose}>
                x
              </button>
            </header>
            <div className="modal-content">{children}</div>
            {actionsComponent && <aside className="modal-footer">{actionsComponent()}</aside>}
          </section>
        </div>
      </div>
    </div>
  </ReactModal>
);

Modal.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  actionsComponent: PropTypes.func,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
};

Modal.defaultProps = {
  title: null,
  isOpen: false,
};

export default Modal;
