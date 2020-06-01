import React from 'react';
import config from '../../../config';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import usePromotions from '../../../hooks/usePromotions';
import { Promotion } from '../../../types';
import Button from '../../common/Button';
import { PromotionsTable } from '../PromotionsTable';
import EditPromotionForm from './EditPromotionForm';
import EmptyState from './EmptyState';
import { Container, Content, ErrorBox, Header, LoadingMore } from './style';
import { useInView } from 'react-intersection-observer';

const BULK_SIZE = config.promotions.bulkSize;

export function PromotionsPage() {
  const {
    records,
    displayableKeys,
    fetchError,
    fetchingRecords,
    hasMore,
    recordToEdit,
    loadMore,
    deleteRecord,
    duplicateRecord,
    toggleEditPane,
    closeEditPane,
    updateRecord,
    toggleRecordSelected,
    initialize,
  } = usePromotions(BULK_SIZE);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const [bottomRef, inView] = useInView({
    threshold: 0.01,
  });

  React.useEffect(() => {
    if (inView) {
      if (!records.length || fetchingRecords || !hasMore) return;
      showMore();
    }
  }, [inView]);

  const showMore = () => {
    loadMore(() => {
      contentRef.current?.scrollBy(0, -20);
    });
  };

  const onSubmit = (record: Promotion) => {
    updateRecord(record);
    closeEditPane();
  };

  return (
    <Container>
      <Header>
        <div>Promotions</div>
        <Button onClick={initialize}>Start Over</Button>
        {fetchingRecords && <LoadingMore>Loading</LoadingMore>}
        {fetchError && <ErrorBox>{fetchError.message}</ErrorBox>}
      </Header>
      <Content ref={contentRef}>
        {!records.length ? <EmptyState></EmptyState> : null}
        {records.length && (
          <PromotionsTable
            records={records}
            cols={displayableKeys}
            onDeleteRecord={deleteRecord}
            onDuplicateRecord={duplicateRecord}
            onEditRecord={toggleEditPane}
            onRecordSelected={toggleRecordSelected}
          ></PromotionsTable>
        )}
        <div ref={bottomRef} style={{ height: 10 }}></div>
        {recordToEdit && (
          <EditPromotionForm
            record={recordToEdit}
            onCancel={closeEditPane}
            onSubmit={onSubmit}
          ></EditPromotionForm>
        )}
      </Content>
    </Container>
  );
}
