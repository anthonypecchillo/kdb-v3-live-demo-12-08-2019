/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import React from 'react';
import styled from 'styled-components';

import NationalLand from './NationalLand';
import NationalDemographics from './NationalDemographics';
import NationalEconomics from './NationalEconomics';
import NationalDeforestation from './NationalDeforestation';
import Tile from './Tile';

const OverviewGrid = styled.div`
  display: grid;
  grid-column-gap: 2%;
  grid-row-gap: 25px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 500px 1000px;
  grid-template-areas:
    'land deforestation deforestation deforestation'
    'demographics demographics economics economics';

  height: 100%;

  @media (max-width: 765px) {
    grid-template-rows: 500px 1000px 800px;
    grid-template-areas:
      '. land land .'
      'demographics demographics economics economics'
      'deforestation deforestation deforestation deforestation';
  }

  @media (max-width: 460px) {
    grid-template-rows: auto 800px 1000px 500px;
    grid-template-areas:
      'land land land land'
      'demographics demographics demographics demographics'
      'economics economics economics economics'
      'deforestation deforestation deforestation deforestation';
  }
`;

const NationalOverviewPage = ({ nationName, jurisdictionName, language }) => (
  <OverviewGrid>
    <Tile gridArea="land">
      <NationalLand nationName={nationName} language={language} />
    </Tile>
    <Tile gridArea="demographics" height="800px" align="start">
      <NationalDemographics jurisdictionName={jurisdictionName} language={language} nationName={nationName} />
    </Tile>
    <Tile gridArea="economics">
      <NationalEconomics jurisdictionName={jurisdictionName} language={language} nationName={nationName} />
    </Tile>
    <Tile gridArea="deforestation">
      <NationalDeforestation nationName={nationName} language={language} />
    </Tile>
  </OverviewGrid>
);

export default NationalOverviewPage;
