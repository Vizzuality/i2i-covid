import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import useAxios from 'axios-hooks';
import Button from 'components/button';
import Modal from 'components/modal';
import Select from 'components/select';
import Spinner from 'components/spinner';
import { fetchCountries } from 'services/countries';

const Subscribe = () => {
  const [isOpen, setState] = useState(false);
  const [{ data, loading }] = useAxios(fetchCountries());
  const countries = data && data.rows ? data.rows : null;

  const toggleModal = () => {
    setState(!isOpen);
  };

  const countryOptions = countries
    ? countries.map(({ country, iso }) => {
        return {
          label: country,
          value: iso,
        };
      })
    : [];

  useEffect(() => {
    if (isOpen) {
      ReactGA.event({
        category: 'UI',
        action: 'Open subscribe form',
      });
    }
  });

  return (
    <div className="c-subscribe">
      <Button className="-border-color-1 btn" onClick={toggleModal}>
        Subscribe
      </Button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
        title="Subscribe"
        actionsComponent={() => (
          <div className="c-filters-action-buttons">
            <Button className="-border-color-1" type="submit" onClick={toggleModal}>
              Cancel
            </Button>
          </div>
        )}
      >
        <div className="subscribe-modal">
          <h3>Get notified on new data upload</h3>
          {!data && loading && <Spinner />}
          {data && !loading && (
            <form
              id="subForm"
              className="js-cm-form"
              action="https://www.createsend.com/t/subscribeerror?description="
              method="post"
              data-id="2BE4EF332AA2E32596E38B640E90561942C21525DD2D0D00700A8196736A21BD34D705BB2B9B3CF936FBFCEF3E2AFD3EF5483074B06014133DFDD692B2AB4117"
            >
              <div>
                <div className="form-fields">
                  <label>Name </label>
                  <input aria-label="Name" id="fieldName" maxLength="200" name="cm-name" required />
                </div>
                <div className="form-fields">
                  <label>Email </label>
                  <input
                    autoComplete="Email"
                    aria-label="Email"
                    className="js-cm-email-input qa-input-email"
                    id="fieldEmail"
                    maxLength="200"
                    name="cm-wjtuhy-wjtuhy"
                    required
                    type="email"
                  />
                </div>
                {!!(countryOptions && countryOptions.length) && (
                  <div className="form-fields">
                    <label>Country </label>
                    <Select
                      name="cm-f-tjdudju"
                      aria-label="Country"
                      id="fieldtjdudju"
                      maxLength="200"
                      options={countryOptions}
                      placeholder="Subscribe to an specific country"
                    />
                  </div>
                )}
                <div>
                  <Button className="c-button -color-1" type="submit">
                    Notify me
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Subscribe;
