import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 mt-15">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="shadow p-3 rounded-md">
          <Skeleton height={180} />
          <Skeleton height={20} width="80%" className="mt-2" />
          <Skeleton height={15} width="60%" className="mt-1" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
