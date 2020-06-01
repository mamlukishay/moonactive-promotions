import styled from 'styled-components';
import { ButtonStyle } from '../../common/Button';

export const HEADER_HEIGHT = 100;

export const Container = styled.div`
  background: white;
  padding: 15px;
`;

export const Header = styled.div`
  display: flex;
  padding: 0 30px;
  text-align: left;
  font-size: 3em;
  font-weight: bold;
  line-height: 100px;
  border-bottom: 1px dotted dodgerblue;
  align-items: center;

  ${ButtonStyle} {
    margin-left: 20px;
    font-size: 1rem;
    font-weight: normal;
    width: 38px;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
  }
`;

export const Content = styled.div`
  max-height: 80vh;
  overflow-y: scroll;
`;

export const LoadingMore = styled.div`
  background-color: #022cfb73;
  font-size: 1rem;
  font-weight: 300;
  text-align: center;
  display: inline-block;
  border-radius: 10px;
  padding: 5px;
  line-height: 2rem;
  margin-left: 5px;
  color: white;
`;

export const ErrorBox = styled.div`
  color: red;
  font-size: 0.9rem;
  font-weight: 300;
  text-align: left;
  display: inline-block;
  border-radius: 10px;
  padding: 5px;
  line-height: 2rem;
  margin-left: auto;
  max-width: 50%;
`;
