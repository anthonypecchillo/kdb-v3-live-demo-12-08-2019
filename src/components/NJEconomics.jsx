/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import styled from 'styled-components';

import BulletChart from './BulletChart';
import ExportsList from './ExportsList';
import Loading from './Loading';
import PieChart from './PieChart';

const GET_JURISDICTION_ECONOMICS = gql`
  query getJurisdictionEconomics($nationName: String!, $jurisdictionName: String!, $languageCode: String!) {
    jurisdictionByName(nationName: $nationName, jurisdictionName: $jurisdictionName) {
      id
      name
      humanDevelopmentIndex {
        id
        amount
        year
        citation_id
      }
      perCapitaIncome {
        id
        amount
        units
        year
        citation_id
      }
      gdp {
        id
        amount
        units
        year
        citation_id
      }
      nation {
        gdp {
          id
          amount
          units
          year
          citation_id
        }
      }
      region {
        gdpComponents {
          amount
          percent
          gdpCategory {
            gdpCategoryTranslate(code: $languageCode) {
              languageCode
              name
            }
          }
          citation_id
        }
       	majorExports {
          id
          faIconClass
          majorExportTranslate(code: $languageCode) {
            languageCode
            name
          }
        }
      }
    }
  }
`;

const EconomicsGrid = styled.div`
  display: grid;
  grid-template-rows: 1fr 0.5fr 2fr 0.5fr 1fr 0.6fr 0.5fr 1fr 0.6fr auto auto auto 0.75fr;
  justify-items: center;

  height: 100%;
  width: 100%;
`;

const EconomicsTitle = styled.h3`
  height: 100%;
  margin: 0;
  text-align: center;
  width: 100%;
`;

const EconomicsTotalTitle = styled.div`
  align-self: end;

  font-weight: 600;
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
  text-align: center;
`;

const EconomicsTotalValue = styled.h1`
  align-self: end;
  margin: 0;

  @media (max-width: 460px) {
    font-size: 24px;
  }
`;

const EconomicsTotalNationalPercent = styled.div`
  align-self: start;
  font-size: 12px;
`;

const EconomicsCitation = styled.div`
  align-self: center;
  justify-self: end;

  font-size: 14px;
  padding: 0 1.25%;
`;

const EconomicsTagListContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const NJEconomics = ({ jurisdictionName, language, nationName }) => {
  const { data, loading, error } = useQuery(GET_JURISDICTION_ECONOMICS, {
    variables: { nationName: nationName, jurisdictionName: jurisdictionName, languageCode: language },
  });
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;

  const { gdp, humanDevelopmentIndex, nation, perCapitaIncome, region } = data.jurisdictionByName;

  let percentageOfNationalGDP;
  let PERCENTAGE_OF_NATIONAL_GDP;
  if (gdp && gdp.amount && nation.gdp && nation.gdp.amount) {
    percentageOfNationalGDP = (gdp.amount / nation.gdp.amount) * 100;
    PERCENTAGE_OF_NATIONAL_GDP = `${percentageOfNationalGDP.toLocaleString()}% of National GDP`;
  } else {
    PERCENTAGE_OF_NATIONAL_GDP = 'Data unavailable';
  }

  const humnDevelopmentIndexData = humanDevelopmentIndex && humanDevelopmentIndex.amount ? { target: null, value: humanDevelopmentIndex.amount } : { target: null, value: null };
  const humanDevelopmentIndexDataSourceConfig = { caption: 'Human Development Index' };

  const { gdpComponents, majorExports } = region;
  const gdpBreakdownData = gdpComponents.map(gdpComponent => {
    return {
      label: gdpComponent.gdpCategory.gdpCategoryTranslate.name,
      value: gdpComponent.percent,
    };
  });

  const gdpBreakdownDataSourceConfig = {
    caption: 'GDP Breakdown',
    numberSuffix: '%',
    showLabels: '1',
    showLegend: '0',
    pieRadius: '90',
  };

  return (
    <EconomicsGrid>
      <EconomicsTitle>Economics</EconomicsTitle>
      <EconomicsTotalTitle>Human Development Index</EconomicsTotalTitle>
      <BulletChart
        data={humnDevelopmentIndexData}
        dataSourceConfig={humanDevelopmentIndexDataSourceConfig}
        justify="center"
        percentOfTotalColumns={1}
      />
      <EconomicsTotalTitle>Per Capita Income</EconomicsTotalTitle>
      <EconomicsTotalValue>{`${Math.round(perCapitaIncome.amount).toLocaleString()} ${perCapitaIncome.units}`}</EconomicsTotalValue>
      <EconomicsTotalNationalPercent>Annual</EconomicsTotalNationalPercent>
      <EconomicsTotalTitle>State GDP</EconomicsTotalTitle>
      <EconomicsTotalValue>{`${gdp.amount.toLocaleString()} ${gdp.units}`}</EconomicsTotalValue>
      <EconomicsTotalNationalPercent>{PERCENTAGE_OF_NATIONAL_GDP}</EconomicsTotalNationalPercent>
      <PieChart
        data={gdpBreakdownData}
        dataSourceConfig={gdpBreakdownDataSourceConfig}
        justify="center"
        height={'300'}
        percentOfTotalColumns={1}
        maxWidth={370}
        maxWidth={680}
      />
      <EconomicsTotalTitle marginBottom="10px">Major Exports</EconomicsTotalTitle>
      <EconomicsTagListContainer>
        <ExportsList majorExports={majorExports} />
      </EconomicsTagListContainer>
      <EconomicsCitation>IBGE. 2012. Censo Demográfico 2010</EconomicsCitation>
    </EconomicsGrid>
  );
};

export default NJEconomics;
