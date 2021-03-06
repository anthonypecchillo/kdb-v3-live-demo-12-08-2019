/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';

import DeforestationDriversList from './DeforestationDriversList';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import Loading from './Loading';

const GET_JURISDICTION_DEFORESTATION = gql`
  query getJurisdictionDeforestation($nationName: String!, $jurisdictionName: String!, $languageCode: String!) {
    jurisdictionByName(nationName: $nationName, jurisdictionName: $jurisdictionName) {
      id
      name
      forestArea {
      	id
        name
        amount
        year
        citation_id
      }
      originalForestArea {
      	id
        name
        amount
        year
        citation_id
      }
      deforestationDrivers {
        id
        faIconClass
        deforestationDriverTranslate(code: $languageCode) {
          name
        }
      }
      contentJurisdictional {
        id
        contentJurisdictionalTranslate(code: $languageCode) {
          id
          languageCode
          driversOfDeforestation
        }
      }
      region {
        deforestationRates {
          id
          amount
          year
          units
          citation_id
        }
      }
    }
  }
`;

const DeforestationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 350px;
  grid-template-rows: auto auto 32px auto;
  grid-template-areas:
    'deforestation-title deforestation-title deforestation-title'
    'deforestation-text deforestation-text deforestation-text'
    'deforestation-rate-plot deforestation-rate-plot drivers-of-deforestation-title'
    'deforestation-rate-plot deforestation-rate-plot drivers-of-deforestation-list';

  height: 100%;
  width: 100%;

  @media (max-width: 1025px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 32px auto auto;
    grid-template-areas:
      'deforestation-title deforestation-title'
      'deforestation-text deforestation-text'
      'total-deforestation-plot drivers-of-deforestation-title'
      'total-deforestation-plot drivers-of-deforestation-list'
      'deforestation-rate-plot deforestation-rate-plot';
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 32px auto auto;
    grid-template-areas:
      'deforestation-title'
      'deforestation-text'
      'total-deforestation-plot'
      'drivers-of-deforestation-title'
      'drivers-of-deforestation-list'
      'deforestation-rate-plot';
  }
`;

const DeforestationTitle = styled.h3`
  grid-area: deforestation-title;

  margin: 0;
  text-align: center;
  width: 100%;

  @media (max-width: 1025px) {
    grid-column: 1/3;
  }

  @media (max-width: 460px) {
    grid-column: 1/2;
  }
`;

const DeforestationText = styled.div`
  grid-area: deforestation-text;
  padding: 0 0 0 2.5%;
  width: 100%;

  @media (max-width: 1025px) {
    grid-column: 1/3;
    grid-row: 2/3;

    padding: 0 2.5%;
  }

  @media (max-width: 460px) {
    grid-column: 1/2;
    grid-row: 2/3;

    padding: 0 2.5%;
  }
`;

// const DeforestationRateTitle = styled.div`
//   ${'' /* grid-area: deforestation-rate-title; */}
//   align-self: end;
//
//   font-weight: 600;
//   margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
//   text-align: center;
// `;

const DeforestationDriversTitle = styled.div`
  grid-area: drivers-of-deforestation-title;

  align-self: end;
  font-weight: 600;
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
  text-align: center;

  @media (max-width: 1025px) {
    grid-column: 2/3;
    grid-row: 3/4;
  }

  @media (max-width: 460px) {
    grid-column: 1/2;
    grid-row: 4/5;
  }
`;

const DeforestationTagListContainer = styled.div`
  grid-area: drivers-of-deforestation-list;

  align-self: start;
  justify-self: center;

  margin: 10px 0;
  ${'' /* width: 100%; */}

  @media (max-width: 1025px) {
    grid-column: 2/3;
    grid-row: 4/5;

    align-self: center;
  }

  @media (max-width: 460px) {
    grid-column: 1/2;
    grid-row: 5/6;

    align-self: center;
  }
`;

// Hook for keeping track of window size
// Source: https://usehooks.com/useWindowSize/
function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

// TODO: Use primary key from DB as uniqueID for props
const NJDeforestation = ({ jurisdictionName, language, nationName }) => {
  const windowSize = useWindowSize();
  const { data, loading, error } = useQuery(GET_JURISDICTION_DEFORESTATION, {
    variables: { nationName: nationName, jurisdictionName: jurisdictionName, languageCode: language },
  });
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;


  let totalDeforestationPercentOfTotalColumns = '0.33';
  let deforestationRatesPercentOfTotalColumns = '0.66';
  if (windowSize.width > 460 && windowSize.width <= 1025) {
    totalDeforestationPercentOfTotalColumns = '0.5';
    deforestationRatesPercentOfTotalColumns = '1';
  }
  if (windowSize.width <= 460) {
    totalDeforestationPercentOfTotalColumns = '1';
    deforestationRatesPercentOfTotalColumns = '1';
  }

  const { driversOfDeforestation } = data.jurisdictionByName.contentJurisdictional.contentJurisdictionalTranslate;
  const driversOfDeforestationHTML = ReactHtmlParser(driversOfDeforestation);

  const { deforestationDrivers, forestArea, originalForestArea } = data.jurisdictionByName;
  const totalDeforestationData = [
    {
      label: 'Forested',
      value: Math.round(forestArea.amount),
    },
    {
      label: 'Deforested',
      value: Math.round(originalForestArea.amount - forestArea.amount),
    },
  ];
  const totalDeforestationDataSourceConfig = {
    caption: 'Total Deforestation',
    centerLabel: '$label:<br/><br/>$value',
    defaultCenterLabel: `Original <br/>Forest Area:<br/><br/> ${Math.round(originalForestArea.amount).toLocaleString()} km²`,
    numberSuffix: ' km²',
    showLegend: '1',
    showLabels: '0',
  };

  const { deforestationRates } = data.jurisdictionByName.region;

  let deforestationRatesData;
  if (deforestationRates) {
    deforestationRatesData = deforestationRates.map(rate => {
      return {
        label: rate.year.toString(),
        value: rate.amount,
      };
    });
  } else {
    deforestationRatesData = [{
      label: null,
      value: null,
    }];
  }
  const deforestationRatesDataSourceConfig = {
    caption: 'Deforestation Rate',
    xAxisName: 'Year',
    yAxisName: 'Deforested Area (km²)',
    numberSuffix: ' km²',
  };

  const totalPopulationChartWideViewport = windowSize.width > 1025 ? (
    <DoughnutChart
      align="center"
      data={totalDeforestationData}
      dataSourceConfig={totalDeforestationDataSourceConfig}
      height={275}
      maxWidth={312}
      percentOfTotalColumns={totalDeforestationPercentOfTotalColumns}
      float={'right'}
    />
  ) : null;

  const totalPopulationChartNarrowViewport = windowSize.width <= 1025 ? (
    <DoughnutChart
      align="center"
      data={totalDeforestationData}
      dataSourceConfig={totalDeforestationDataSourceConfig}
      height={285}
      maxWidth={350}
      percentOfTotalColumns={totalDeforestationPercentOfTotalColumns}
      gridArea="total-deforestation-plot"
    />
  ) : null;

  return (
    <DeforestationGrid>
      <DeforestationTitle>Deforestation</DeforestationTitle>
      <DeforestationText>
        {totalPopulationChartWideViewport}
        {driversOfDeforestationHTML}
      </DeforestationText>
      {/* <DeforestationRateTitle marginBottom="10px">Deforestation Rate</DeforestationRateTitle> */}
      {totalPopulationChartNarrowViewport}
      <LineChart
        data={deforestationRatesData}
        dataSourceConfig={deforestationRatesDataSourceConfig}
        justify="center"
        percentOfTotalColumns={deforestationRatesPercentOfTotalColumns}
        gridArea="deforestation-rate-plot"
      />
      <DeforestationDriversTitle>Drivers of Deforestation</DeforestationDriversTitle>
      <DeforestationTagListContainer>
        <DeforestationDriversList deforestationDrivers={deforestationDrivers} />
      </DeforestationTagListContainer>
    </DeforestationGrid>
  )
};

export default NJDeforestation;
