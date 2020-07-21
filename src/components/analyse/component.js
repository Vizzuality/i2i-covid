import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import Modal from 'components/modal';
import Button from 'components/button';
import axios from 'axios';
import Spinner from 'components/spinner';
import { filtersData } from './constants';
import { fetchFilter } from 'services/filters';
import isArray from 'lodash/isArray';
import Chart from 'components/chart';
import { fetchIndicators as fetchIndicatorsSex } from 'services/indicatorsSex';
import { fetchIndicators as fetchIndicatorsArea } from 'services/indicatorsArea';
import { fetchIndicators as fetchIndicatorsRegion } from 'services/indicatorsRegion';
import { fetchIndicators as fetchIndicatorsAge } from 'services/indicatorsAge';
import useAxios from 'axios-hooks';
import { getWidgetProps as getWidgetPropsSex } from '../widget/utilsSex.js';
import { getWidgetProps as getWidgetPropsArea } from '../widget/utilsArea.js';
import { getWidgetProps as getWidgetPropsRegion } from '../widget/utilsRegion.js';
import { getWidgetProps as getWidgetPropsAge } from '../widget/utilsAge.js';
import { fetchWaves } from 'services/waves';

const parseData = (data, filter) =>
  Array.from(new Set(data.rows.map((row) => row[filter]))).map((f) => ({ label: f, value: f }));

const Analyse = ({slug, location, iso, filters, widgetSpec }) => {

  var defaultFilters = filters;

  const [activeChart, setActiveChart] = useState(null);

  const [radioValue, setRadioValue] = useState('');

  const [{ data: dataWaves }] = useAxios(fetchWaves(iso));
  const waves = dataWaves && dataWaves.rows ? dataWaves.rows : null;
  const [waveOption, setWaveOption] = useState('0');

  var widgetProps = null;

  const { query } = location;
  const queryFilters = {};

  const [{ isOpen }, setState] = useState({
    isUrlCopied: false,
    isEmbedCopied: false,
    isOpen: false,
  });

  const [filtersFinal, setFilters] = useState();

  useEffect(() => {
    Promise.all(
      filtersData.map(({ column, title }) =>
        axios.get(fetchFilter(column, iso)).then(({ data }) => {
          return {
            title: title,
            column: column,
            options: parseData(data, column),
          };
        })
      )
    ).then((data) => {

      let tempData = [];

      data.map((item) =>{
        if(slug === "sex"){
          if(item.title !== "Gender"){
            tempData.push(item);
          }
        }
        else if(slug === "urban-city"){
          if(item.title !== "Geographic area"){
            tempData.push(item);
          }
        }
        else if(slug === "region"){
          if(item.title !== "Region"){
            tempData.push(item);
          }
        }
        else if(slug === "age"){
          if(item.title !== "Ages"){
            tempData.push(item);
          }
        }
        else{
          tempData.push(item);
        }
        return tempData;
      });

      return setFilters(tempData);

    });
  }, [iso, slug]);

  if (query) {
    Object.keys(query).forEach((key) => {
      queryFilters[key] = isArray(query[key]) && query[key].length ? query[key] : [query[key]];
    });
  }

  const handleChangeSelect = (e) => {
    setWaveOption(e.target.value);
    handleChange(radioValue, e.target.value);
  }

  const handleChangeRadio = (e) => {
    handleChange(e.target.value, waveOption)
  }

  const handleChange = (i, wave) => {
    if(i === 'sex'){
      setRadioValue('sex');

      axios.get(fetchIndicatorsSex(widgetSpec, defaultFilters, wave)).then(({ data }) => {
        widgetProps = data && getWidgetPropsSex(data.rows, widgetSpec);
        setActiveChart(<Chart {...widgetProps}/>);
      })
      .catch((err) => setActiveChart(<div className="alert alert-warning">Something was wrong.</div>))
    }
    else if(i === 'ur'){
      setRadioValue('ur');

      axios.get(fetchIndicatorsArea(widgetSpec, defaultFilters, wave)).then(({ data }) => {
        widgetProps = data && getWidgetPropsArea(data.rows, widgetSpec);
        setActiveChart(<Chart {...widgetProps}/>);
      })
      .catch((err) => setActiveChart(<div className="alert alert-warning">Something was wrong.</div>))
    }
    else if(i === 'reduced_reporting_region'){
      setRadioValue('reduced_reporting_region');

      axios.get(fetchIndicatorsRegion(widgetSpec, defaultFilters, wave)).then(({ data }) => {
        widgetProps = data && getWidgetPropsRegion(data.rows, widgetSpec);
        setActiveChart(<Chart {...widgetProps}/>);
      })
      .catch((err) => setActiveChart(<div className="alert alert-warning">Something was wrong.</div>))
    }
    else if(i === 'ps5_age_group'){
      setRadioValue('ps5_age_group');

      axios.get(fetchIndicatorsAge(widgetSpec, defaultFilters, wave)).then(({ data }) => {
        widgetProps = data && getWidgetPropsAge(data.rows, widgetSpec);
        setActiveChart(<Chart {...widgetProps}/>);
      })
      .catch((err) => setActiveChart(<div className="alert alert-warning">Something was wrong.</div>))
    }

  };

  const toggleModal = () => {
    setActiveChart(null);
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
    <div className="c-analyse">
      <Button className="-border-color-2 -small" onClick={toggleModal}>
        Analyse
      </Button>
      <Modal
        title="Analyse indicator"
        isOpen={isOpen}
        onRequestClose={() => toggleModal(false)}
      >
        <div className="row">
          <div className="col-12">
            <h2 className="h3 center">{widgetSpec.title}</h2>
            <form className="modal-filters">
              <div className="row">
                {filtersFinal === undefined ? (
                  <Spinner />
                ) : (
                  filtersFinal.map((filter, index) => (
                    <div key={filter.column} className="form-group col-3">
                      <input
                        type="radio"
                        id={filter.title}
                        name="analyse-option"
                        value={filter.column}
                        onClick={handleChangeRadio}
                        className="analyse-option"
                      />
                      <label className="btn c-button -border-color-2 -small auto-width radio-inline" htmlFor={filter.title}>
                        {filter.title !== "Geographic area"?
                          filter.title
                          :
                          "Geo. Area"
                        }
                      </label>
                    </div>
                  ))
                )}
              </div>
              <div className="row">
                {waves === null ? (
                  <Spinner />
                ) : (
                  <div className="form-group wave-select-container">
                    <select className="wave-select" value={waveOption} onChange={handleChangeSelect}>
                      <option value={0}>-Select Wave-</option>
                      {waves.map((item, index) => (
                          <option key={"wave-option-"+index} value={item.waves_data}>Wave {item.waves_data.substr(item.waves_data.length - 1)} - {item.waves_data}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="col-12">
            {waveOption !== '0' ? activeChart : null}
          </div>
        </div>
      </Modal>
    </div>
  );
};

Analyse.propTypes = {
  query: PropTypes.string,
  slug: PropTypes.string.isRequired,
  iso: PropTypes.string,
};

Analyse.defaultProps = {
  query: '',
  iso: '',
};

export default Analyse;
