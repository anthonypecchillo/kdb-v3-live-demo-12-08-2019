/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import React from 'react';
import styled from 'styled-components';

import NJMap from './NJMap';
import NJNav from './NJNav';

const navLinkList = [
  {
    linkText: 'Overview',
    urlText: 'overview',
  },
  {
    linkText: 'Forests & Land Use',
    urlText: 'forests-and-land-use',
  },
  {
    linkText: 'Governance',
    urlText: 'governance',
  },
  {
    linkText: 'Partnerships',
    urlText: 'partnerships',
  },
  {
    linkText: 'Report Cards',
    urlText: 'report-cards',
  },
];

const NJHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 50px 3fr minmax(330px, 1fr) 50px;
  grid-template-rows: 1fr 3fr 30px 30px;

  background-image: ${({ bannerURL }) => `url(${bannerURL})`};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top left;
  background-attachment: fixed;

  height: 100%;
  width: 100%;
`;

const NJHeaderTitle = styled.h1`
  grid-column: 2/3;
  grid-row: 1/2;
  align-self: center;
  justify-self: start;

  color: white;
  margin: 0;
`;

const NJHeaderFlags = styled.div`
  grid-column: 3/4;
  grid-row: 1/2;
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 20px;
  align-self: center;
  justify-self: end;

  color: white;
`;

const NJFlag = styled.div`
  place-self: center;

  background: ${({ flagURL }) => `no-repeat center/100% url(${flagURL})`};
  height: 50px;
  width: 72px;
`;

const NJMapContainer = styled.div`
  grid-column: 3/4;
  grid-row: 2/4;

  background-color: white;
  box-shadow: 6px 18px 18px rgba(0, 0, 0, 0.08), -6px 18px 18px rgba(0, 0, 0, 0.08);
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

const NJHeader = ({ flags, fullName, headerImageURL, jurisdictionType, nationName, stateName }) => (
  <NJHeaderGrid bannerURL={headerImageURL}>
    <NJHeaderTitle>{fullName}</NJHeaderTitle>
    <NJHeaderFlags>
      <NJFlag flagURL={flags[0]} />
      <NJFlag flagURL={flags[1]} />
    </NJHeaderFlags>
    <NJNav navLinkList={navLinkList} />
    <NJMapContainer>
      <NJMap jurisdictionType={jurisdictionType} nationName={nationName} stateName={stateName} />
    </NJMapContainer>
  </NJHeaderGrid>
);

export default NJHeader;
