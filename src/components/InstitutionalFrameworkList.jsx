/**
 * Copyright 2019-present GCF Task Force. All Rights Reserved.
 */

import React from 'react';
import styled from 'styled-components';

import InstitutionalFrameworkListItem from './InstitutionalFrameworkListItem';

const InstitutionalFrameworkListStyled = styled.div`
  background-color: white;
  border-top: 3px solid #3e522d;
  height: calc(100% - 2.5%);
  margin: 8px 0;
  ${'' /* overflow-y: scroll; */}
  width: 100%;
`;

const InstitutionalFrameworkList = ({ activeList, frameworks }) => {
  if (
    (activeList === 'National' && !frameworks.national.length) ||
    (activeList === 'State' && !frameworks.state.length) ||
    (activeList === 'All' && !frameworks.national.length && !frameworks.state.length)
  ) {
    return (
      <InstitutionalFrameworkListStyled>
        <h2>{activeList}</h2>
        <div style={{margin: '35px 0', textAlign: 'center', fontSize: '14px'}}>There are no Institutional Frameworks to display for this category at this time.</div>
      </InstitutionalFrameworkListStyled>
    )
  }

  if (activeList !== 'All') {
    return (
      <InstitutionalFrameworkListStyled>
        <h2>{activeList}</h2>
        {frameworks[activeList.toLowerCase()].map(framework => (
          <InstitutionalFrameworkListItem
            description={framework.institutionalFrameworkTranslate.description}
            key={framework.id}
            nameLong={framework.institutionalFrameworkTranslate.nameLong}
            nameShort={framework.nameShort}
            politicalScope={framework.politicalScope}
            url={framework.url}
          />
        ))}
      </InstitutionalFrameworkListStyled>
    );
  }

  let nationalFrameworks = <div style={{margin: '35px 0', textAlign: 'center', fontSize: '14px'}}>There are no Institutional Frameworks to display for this category at this time.</div>
  let stateFrameworks = <div style={{margin: '35px 0', textAlign: 'center', fontSize: '14px'}}>There are no Institutional Frameworks to display for this category at this time.</div>

  if (frameworks.national.length) {
    nationalFrameworks = frameworks.national.map(framework => (
      <InstitutionalFrameworkListItem
        description={framework.institutionalFrameworkTranslate.description}
        key={framework.id}
        nameLong={framework.institutionalFrameworkTranslate.nameLong}
        nameShort={framework.nameShort}
        politicalScope={framework.politicalScope}
        url={framework.url}
      />
    ));
  }

  if (frameworks.state.length) {
    stateFrameworks = frameworks.state.map(framework => (
      <InstitutionalFrameworkListItem
        description={framework.institutionalFrameworkTranslate.description}
        key={framework.id}
        nameLong={framework.institutionalFrameworkTranslate.nameLong}
        nameShort={framework.nameShort}
        politicalScope={framework.politicalScope}
        url={framework.url}
      />
    ));
  }

  return (
    <InstitutionalFrameworkListStyled>
      <h2>National</h2>
      {nationalFrameworks}

      <h2>State</h2>
      {stateFrameworks}
    </InstitutionalFrameworkListStyled>
  );
}

export default InstitutionalFrameworkList;
