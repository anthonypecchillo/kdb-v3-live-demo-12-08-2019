/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import React from 'react';
import styled from 'styled-components';

import NationalApproachesToDeforestationMonitoringAndAccounting from './NationalApproachesToDeforestationMonitoringAndAccounting';
import NationalApproachesToDeforestationAndForestDegradation from './NationalApproachesToDeforestationAndForestDegradation';
import NationalCommitments from './NationalCommitments';
import NationalGlobalPerspective from './NationalGlobalPerspective';
import Tile from './Tile';

const OverviewGrid = styled.div`
  display: grid;
  grid-column-gap: 2%;
  grid-row-gap: 25px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 400px 400px 1000px 400px 550px;
  grid-template-areas:
    'nadma nadma nadfd nadfd'
    'commitments commitments globalperspective globalperspective'
    '. . . .'
    '. . . .'
    '. . . .';

  height: 100%;

  @media (max-width: 765px) {
    grid-template-areas:
      'nadma nadma nadfd nadfd'
      'commitments commitments globalperspective globalperspective'
      '. . . .'
      '. . . .'
      '. . . .';
  }

  @media (max-width: 460px) {
    grid-template-areas:
      'nadma nadma nadma nadma'
      'nadfd nadfd nadfd nadfd'
      'commitments commitments commitments commitments'
      'globalperspective globalperspective globalperspective globalperspective'
      '. . . .';
    grid-template-rows: 800px 800px 800px 800px 1000px;
  }
`;

const NationalApproachesPage = ({ nationName, jurisdictionName, language }) => (
  <OverviewGrid>
    <Tile gridArea="nadma">
      <NationalApproachesToDeforestationMonitoringAndAccounting jurisdictionName={jurisdictionName} language={language} />
    </Tile>
    <Tile gridArea="nadfd">
      <NationalApproachesToDeforestationAndForestDegradation jurisdictionName={jurisdictionName} language={language} />
    </Tile>
    <Tile gridArea="commitments">
      <NationalCommitments jurisdictionName={jurisdictionName} language={language} nationName={nationName} />
    </Tile>
    <Tile gridArea="globalperspective">
      <NationalGlobalPerspective jurisdictionName={jurisdictionName} language={language} nationName={nationName} />
    </Tile>
  </OverviewGrid>
);

export default NationalApproachesPage;
