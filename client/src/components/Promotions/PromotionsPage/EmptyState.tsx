import styled from 'styled-components';
import React from 'react';

const EmptyStateStyle = styled.div`
  display: flex;
  font-size: 3rem;
  height: 80vh;
  align-items: center;
  justify-content: center;
`;

export default function EmptyState() {
  return <EmptyStateStyle>Nothing here yet. Try to Start Over...</EmptyStateStyle>;
}
