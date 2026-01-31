import React from 'react';
import CandidateCard from './CandidateCard';
import Loader from '../../../components/common/Loader';

const CandidateList = ({ candidates, loading, error, onOnBoard, onStatusUpdate }) => {
  // console.log("Candidates List:", candidates);
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No candidates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate._id}
          candidate={candidate}
          onOnBoard={onOnBoard}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default CandidateList;
