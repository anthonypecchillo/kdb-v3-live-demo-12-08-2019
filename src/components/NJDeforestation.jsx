/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';

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
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 5fr 5fr;
  /* justify-items: center; */
  height: 100%;
  width: 100%;
`;

const DeforestationTitle = styled.h3`
  grid-column: 1/4;
  height: 100%;
  /* padding-top: 20px; */
  margin: 0;
  text-align: center;
  width: 100%;
`;

const DeforestationText = styled.div`
  grid-column: 1/3;
  overflow: scroll;
  padding: 0 5%;
  width: 100%;
`;

const DeforestationDriversTitle = styled.div`
  align-self: end;
  font-weight: 600;
  text-align: center;
`;

const DeforestationTagList = styled.ul`
  list-style-type: none;
  overflow: hidden;
  overflow-y: scroll;
  height: 250px;
  width: 100%;
`;

const DeforestationTagListItem = styled.li`
  border: 1px solid black;
  background-color: tomato;
  height: 50px;
  margin: 15px 0;
  width: 90%;
`;

// TODO: Use primary key from DB as uniqueID for props
const NJDeforestation = ({ jurisdictionName, language, nationName }) => {
  const { data, loading, error } = useQuery(GET_JURISDICTION_DEFORESTATION, {
    variables: { nationName: nationName, jurisdictionName: jurisdictionName, languageCode: language },
  });
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;

  const { driversOfDeforestation } = data.jurisdictionByName.contentJurisdictional.contentJurisdictionalTranslate;
  const driversOfDeforestationHTML = ReactHtmlParser(driversOfDeforestation);

  const { deforestationDrivers, forestArea, originalForestArea } = data.jurisdictionByName;
  const totalDeforestationData = [
    {
      label: 'Still<br/>Forested',
      value: Math.round(forestArea.amount),
    },
    {
      label: 'Deforested',
      value: Math.round(originalForestArea.amount - forestArea.amount),
      // color: '#ff69b4',
    },
  ];
  const totalDeforestationDataSourceConfig = {
    caption: 'Total Deforestation',
    centerLabel: '$label:<br/><br/>$value',
    defaultCenterLabel: `Original <br/>Forest Area:<br/><br/> ${Math.round(originalForestArea.amount).toLocaleString()} km²`,
    numberSuffix: ' km²',
  };

  const { deforestationRates } = data.jurisdictionByName.region;
  const deforestationRatesData = deforestationRates.map(rate => {
    return {
      label: rate.year.toString(),
      value: rate.amount,
    };
  });
  const deforestationRatesDataSourceConfig = {
    caption: 'Deforestation Rate',
    xAxisName: 'Year',
    yAxisName: 'Deforested Area (km²)',
    numberSuffix: ' km²',
  };

  return (
    <DeforestationGrid>
      <DeforestationTitle>Deforestation</DeforestationTitle>
      <DoughnutChart
        data={totalDeforestationData}
        dataSourceConfig={totalDeforestationDataSourceConfig}
        gridColumn="1/2"
        justify="left"
        percentOfTotalColumns={0.33}
      />
      <LineChart
        data={deforestationRatesData}
        dataSourceConfig={deforestationRatesDataSourceConfig}
        gridColumn="2/4"
        justify="center"
        percentOfTotalColumns={0.66}
      />
      <DeforestationText>
        {driversOfDeforestationHTML}
      </DeforestationText>
      <div>
        <DeforestationDriversTitle>Drivers of Deforestation</DeforestationDriversTitle>
        <DeforestationTagList>
          {deforestationDrivers.map(driver => (
            <DeforestationTagListItem key={driver.id}>{driver.deforestationDriverTranslate.name}</DeforestationTagListItem>
          ))}
        </DeforestationTagList>
      </div>
    </DeforestationGrid>
  )
};

export default NJDeforestation;
