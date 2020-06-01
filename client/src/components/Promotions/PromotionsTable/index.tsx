import React from 'react';
import styled from 'styled-components';
import { Html5Table } from 'window-table';
import { Column } from 'window-table/dist/core/types';
import { Promotion, PromotionTableItem } from '../../../types';
import Button, { ButtonStyle } from '../../common/Button';

interface PromotionTableProps {
  cols: string[];
  records: PromotionTableItem[];
  onDeleteRecord: (record: Promotion) => void;
  onDuplicateRecord: (recordId: string) => void;
  onEditRecord: (record: Promotion) => void;
  onRecordSelected: (record: PromotionTableItem) => void;
}

const TableStyle = styled.div`
  .table-header-row {
    background: #ffe31e61;
  }

  .table-header-cell {
    text-align: left;
  }

  .table-row {
    font-size: 12px;
    align-items: center;
    border-top: 1px dotted dodgerblue;
    line-height: 12px;
  }

  .table-cell {
    text-align: left;
    padding: 5px;
    word-break: break-word;
  }
`;

const ActionsStyle = styled.div`
  padding: 3px 0;
`;

const ActionsListStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;

  ${ButtonStyle} {
    margin: 1px;
    text-align: center;
    font-size: 11px;
    word-break: initial;
  }
`;

const handlers: any = {
  onDeleteRecord: null,
  onDuplicateRecord: null,
  onEditRecord: null,
  onRecordSelected: null,
};

export const SelectRowCell = ({ row }: { row?: PromotionTableItem; column?: Column }) => {
  const onSelect = () => {
    handlers.onRecordSelected(row);
  };

  const selected = !!row?.selected;

  return <input type="checkbox" checked={selected} onChange={onSelect}></input>;
};

export const ActionsCell = ({ row }: { row?: PromotionTableItem; column?: Column }) => {
  const [showActions, setShowActions] = React.useState(false);

  const toggleShowActions = () => setShowActions(currentState => !currentState);

  const onDelete = () => {
    handlers.onDeleteRecord(row);
  };

  const onDuplicate = () => {
    handlers.onDuplicateRecord(row);
  };

  const onEdit = () => {
    handlers.onEditRecord(row);
  };

  return (
    <ActionsStyle>
      {!showActions && (
        <Button style={{ textAlign: 'center' }} onClick={toggleShowActions}>
          Actions
        </Button>
      )}
      {showActions && (
        <ActionsListStyle>
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={onDuplicate}>Dup.</Button>
          <Button onClick={onDelete}>Delete</Button>
          <Button onClick={toggleShowActions}>Cancel</Button>
        </ActionsListStyle>
      )}
    </ActionsStyle>
  );
};

export function PromotionsTable({
  records,
  cols,
  onDeleteRecord,
  onDuplicateRecord,
  onEditRecord,
  onRecordSelected,
}: PromotionTableProps) {
  const data = React.useMemo(() => records, [records]);

  handlers.onDeleteRecord = (record: Promotion) => {
    onDeleteRecord(record);
  };
  handlers.onDuplicateRecord = (record: Promotion) => {
    onDuplicateRecord(record._id);
  };
  handlers.onEditRecord = (record: Promotion) => {
    onEditRecord(record);
  };
  handlers.onRecordSelected = (record: PromotionTableItem) => {
    onRecordSelected(record);
  };

  const selectRowCol = { key: '[]', width: 10, Component: SelectRowCell };
  const actionsCol = { key: 'actions', width: 60, Component: ActionsCell };
  const dataCols = cols.map(col => ({ key: col, width: 50, title: col }));
  const columns = [selectRowCol, ...dataCols, actionsCol];

  return (
    <div>
      <TableStyle>
        <Html5Table headerClassName="" data={data} columns={columns} rowHeight={60}></Html5Table>
      </TableStyle>
    </div>
  );
}
