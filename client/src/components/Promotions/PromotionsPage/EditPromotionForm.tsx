import React from 'react';
import styled from 'styled-components';
import Button, { ButtonStyle } from '../../common/Button';
import OutsideClick from '../../common/OutsideClick';
import { Promotion } from '../../../types';

const PromotionForm = styled.div`
  background-color: #ffff;
  justify-content: start;
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 0;
  padding: 10px;
  height: 100px;
  line-height: 50px;
  box-shadow: 0px 0px 17px 10px lightgrey;

  form {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  input {
    border-left: transparent;
    border-right: transparent;
    border-bottom: 1px solid lightgray;
    margin-top: 10px;
    width: 100%;
    border-top: transparent;
    outline: none;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;

  ${ButtonStyle} {
    margin: 2px 0;
  }
`;

type EditPromotionFormProps = {
  record: Promotion;
  onCancel: () => void;
  onSubmit: (record: Promotion) => void;
};

export default function EditPromotionForm({ record, onCancel, onSubmit }: EditPromotionFormProps) {
  const [formData, setFormData] = React.useState({ ...record });
  const editableFields = Object.keys(formData).filter(key => key !== '_id');

  const updateFormData = (field: string, value: string) => {
    setFormData(oldData => ({
      ...oldData,
      [field]: value,
    }));
  };

  return (
    <OutsideClick onOutsideClick={onCancel}>
      <PromotionForm>
        <form>
          {editableFields.map(field => (
            <InputContainer key="input-container">
              <label>{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={e => updateFormData(field, e.target.value)}
              ></input>
            </InputContainer>
          ))}
          <ActionsContainer>
            <Button onClick={() => onSubmit(formData)}>Save</Button>
            <Button onClick={onCancel}>Discard</Button>
          </ActionsContainer>
        </form>
      </PromotionForm>
    </OutsideClick>
  );
}
