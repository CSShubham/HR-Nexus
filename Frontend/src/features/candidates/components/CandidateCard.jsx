import React from "react";
import Badge from "../../../components/common/Badge";

const CandidateCard = ({ candidate, onOnBoard, onStatusUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-600">{candidate.email}</p>
        </div>
        <Badge status={candidate.status}>{candidate.status}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        {/* <p className="text-sm text-gray-600">
          <span className="font-medium">Position:</span> {candidate.position}
        </p> */}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> {candidate.phone}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Applied Date:</span>{" "}
          {new Date(candidate.createdAt).toLocaleDateString()}
        </p>
        {candidate.experience && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Experience:</span>{" "}
            {candidate.experience} years
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onOnBoard(candidate)}
          disabled={candidate.status === "onboarded"}
          className={candidate.status === "onboarded"
              ? "opacity-50 cursor-not-allowed flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
              : "flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium"}
        >
          OnBoard
        </button>
        <button
          onClick={() => onStatusUpdate(candidate)}
          disabled={candidate.status === "onboarded"}
          className={
            candidate.status === "onboarded"
              ? "opacity-50 cursor-not-allowed"
              : "flex-1 px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors text-sm font-medium"
          }
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
