import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as GovrsPagination } from '@procergs/react-govrs-ds';

const Pagination = ({
  page = 1,
  pageSize,
  totalItems = 0,
  onPageChange,
  className,
}) => {
  const resolvedPageSize = Math.max(1, Number(pageSize) || 1);
  const resolvedTotalItems = Math.max(0, Number(totalItems) || 0);
  const totalPages = Math.ceil(resolvedTotalItems / resolvedPageSize) || 0;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <GovrsPagination
      page={page}
      pageSize={resolvedPageSize}
      totalItems={resolvedTotalItems}
      onPageChange={onPageChange}
      className={className}
    >
      <GovrsPagination.Group align="center">
        <GovrsPagination.Pages variant="numbers" />
      </GovrsPagination.Group>
    </GovrsPagination>
  );
};

Pagination.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  totalItems: PropTypes.number,
  onPageChange: PropTypes.func,
  className: PropTypes.string,
};

export default Pagination;
