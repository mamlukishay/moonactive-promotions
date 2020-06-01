import React from 'react';
import styled from 'styled-components';

export const ButtonStyle = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  background-color: dodgerblue;
  color: white;
  font-weight: 600;
  line-height: 1rem;
`;

export default function Button({ ...props }) {
  return (
    <ButtonStyle>
      <div {...props}></div>
    </ButtonStyle>
  );
}
