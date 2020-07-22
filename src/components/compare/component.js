import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import Modal from 'components/modal';
import Button from 'components/button';
import axios from 'axios';
import Spinner from 'components/spinner';
import Chart from 'components/chart';
import { fetchCountries } from 'services/countries';
import { fetchWaves } from 'services/waves';
import { fetchIndicators } from 'services/indicatorsIso';
import useAxios from 'axios-hooks';
import { getWidgetProps } from '../widget/utilsIso.js';


const Compare = ({ slug, iso, query, filters, widgetSpec }) => {

  const [selectedCountry, setSelectedCountry] = useState(false);
  const [foundWaves, setFoundWaves] = useState(-1);

  const [currentWaves, setCurrentWaves] = useState([]);
  const [compareWaves, setCompareWaves] = useState([]);
  const [waveOption, setWaveOption] = useState(0);

  useEffect(() => {
    axios.get(fetchWaves(iso))
      .then(({ data }) => {
        setCurrentWaves(data.rows);
      })
  }, [iso]);


  const [{ data: dataCountry }] = useAxios(fetchCountries());
  const countries = dataCountry && dataCountry.rows ? dataCountry.rows : null;
  const [countryOption, setCountryOption] = useState('');

  const current = countries ? countries.find((country) => country.iso === iso) : null;

  const [{ data, loading, error }] = useAxios(fetchIndicators(widgetSpec, filters));
  var widgetProps = data && getWidgetProps(data.rows, widgetSpec);
  const [activeChart, setActiveChart] = useState(null);

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

  const handleChangeSelect = (e) => {
    setWaveOption(e.target.value);
    doCustomAxios(countryOption, e.target.value);
  }

  const doCustomAxios = (iso, wave) => {
    axios.get(fetchIndicators(widgetSpec, filters, iso, wave)).then(({ data }) => {
      widgetProps = data && getWidgetProps(data.rows, widgetSpec);
      setActiveChart(<Chart {...widgetProps}/>);
    })
  }

  const handleChangeRadio = (e) => {
    setCompareWaves([]);
    setSelectedCountry(true);
    setWaveOption(0);
    var i = parseInt(e.target.value);
    setCountryOption(countries[i].iso);
    axios.get(fetchWaves(countries[i].iso))
      .then(({ data }) => {
        var resultArray = []
        data.rows.forEach(element => {
          currentWaves.forEach(elementInner => {
            if(element.waves_data === elementInner.waves_data){
              resultArray.push(element);
            }
          });
        });
        setCompareWaves(resultArray);
        if(resultArray.length !== 0){
          setFoundWaves(1);
        }
        else{
          setFoundWaves(0);
        }
      })
    .catch((err) => {setFoundWaves(-1);})
    if(waveOption !== 0){
      doCustomAxios(countries[i].iso, waveOption);
    }
  };

  return (
    <div className="c-compare">
      <Button className="-border-color-2 -small" onClick={toggleModal}>
        Compare
      </Button>
      <Modal
        title="Compare data"
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
      >
       <div className="row">
          <div className="col-12">
            <h2 className="h3 center">{widgetSpec.title}</h2>
            <form className="modal-filters">
              <div className="row">
                {countries === null ? (
                  <Spinner />
                ) : (
                  countries.map((item, index) => (
                    item.iso !== iso ?
                      <div key={item.iso} className="form-group col-3 col-md-2 col-lg-2">
                        <input
                          type="radio"
                          id={item.iso}
                          name="compare-option"
                          value={index}
                          onClick={handleChangeRadio}
                          className="compare-option"
                        />
                        <label className="btn c-button -border-color-2 -small auto-width radio-inline" htmlFor={item.iso}>
                          {item.country !== 'South Africa'?
                            item.country
                            :
                            'S.A.'
                          }
                        </label>
                      </div>
                    :
                    null
                  ))
                )}
              </div>
              <div className="row">
                {selectedCountry ?
                  (compareWaves.length === 0 ? (
                    foundWaves === 0 ? <p>No waves found for this country</p> : (foundWaves > 0 ? <Spinner /> : <div className="alert alert-warning">Something went wrong. Please refresh page</div>)
                  ) : (
                    <div className="form-group wave-select-container">
                      <select className="wave-select" value={waveOption} onChange={handleChangeSelect}>
                        <option value={0}>-Select Wave-</option>
                        {compareWaves.map((item, index) => (
                            <option key={"wave-option-"+index} value={item.waves_data}>Wave {item.waves_data.substr(item.waves_data.length - 1)} - {item.waves_data}</option>
                        ))}
                      </select>
                    </div>
                  ))
                  :
                  <div className="info alert-info ml-3 p-2">Select country to compare {current !== null ? current.country + "'s" : ''} data with</div>
                }
              </div>
            </form>
          </div>
          <div className="col-12">
            {loading && <Spinner loading />}
            {!loading && error && <div className="alert alert-warning">Something was wrong.</div>}
            {!loading && data && !error && (
              <>
                {waveOption !== 0 ? activeChart : null}
              </>
            )}
            {!loading && !data && !error && (
              <div className="alert alert-info">There is no data for this widget.</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

Compare.propTypes = {
  query: PropTypes.string,
  slug: PropTypes.string.isRequired,
  iso: PropTypes.string,
};

Compare.defaultProps = {
  query: '',
  iso: '',
};

export default Compare;
