import React from 'react';

export const ArrowMarkers = () => (
  <svg style={{ height: 0, position: 'absolute' }}>
    <defs>
      {/* One to One - Single line arrow */}
      <marker
        id="arrow-one-to-one"
        markerWidth="12"
        markerHeight="12"
        refX="11"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="0"
          y1="6"
          x2="9"
          y2="6"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="9,3 9,9 12,6"
          fill="#6b7280"
        />
      </marker>

      {/* One to Many - Arrow on one side, crow's foot on many */}
      <marker
        id="arrow-one-to-many"
        markerWidth="15"
        markerHeight="15"
        refX="14"
        refY="7.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="0"
          y1="7.5"
          x2="11"
          y2="7.5"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="11,4.5 11,10.5 14,7.5"
          fill="#6b7280"
        />
        <line
          x1="9"
          y1="4.5"
          x2="9"
          y2="10.5"
          stroke="#6b7280"
          strokeWidth="2"
        />
      </marker>

      {/* Many to Many - Double crow's foot */}
      <marker
        id="arrow-many-to-many"
        markerWidth="16"
        markerHeight="16"
        refX="15"
        refY="8"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="0"
          y1="8"
          x2="12"
          y2="8"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="12,5 12,11 15,8"
          fill="#6b7280"
        />
        <line
          x1="10"
          y1="5"
          x2="10"
          y2="11"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <line
          x1="6"
          y1="5"
          x2="6"
          y2="11"
          stroke="#6b7280"
          strokeWidth="2"
        />
      </marker>

      {/* Source markers for many relationships */}
      <marker
        id="source-many"
        markerWidth="14"
        markerHeight="14"
        refX="1"
        refY="7"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="13"
          y1="7"
          x2="3"
          y2="7"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="3,4 3,10 0,7"
          fill="#6b7280"
        />
        <line
          x1="5"
          y1="4"
          x2="5"
          y2="10"
          stroke="#6b7280"
          strokeWidth="2"
        />
      </marker>

      <marker
        id="source-one"
        markerWidth="12"
        markerHeight="12"
        refX="1"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="11"
          y1="6"
          x2="2"
          y2="6"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="2,3 2,9 0,6"
          fill="#6b7280"
        />
      </marker>

      <marker
        id="source-default"
        markerWidth="10"
        markerHeight="10"
        refX="1"
        refY="5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon
          points="1,2 1,8 0,5"
          fill="#6b7280"
        />
      </marker>

      {/* Source markers with suffixes */}
      <marker
        id="arrow-one-to-one-source"
        markerWidth="12"
        markerHeight="12"
        refX="1"
        refY="6"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="11"
          y1="6"
          x2="2"
          y2="6"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="2,3 2,9 0,6"
          fill="#6b7280"
        />
      </marker>

      <marker
        id="arrow-one-to-many-source"
        markerWidth="14"
        markerHeight="14"
        refX="1"
        refY="7"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="13"
          y1="7"
          x2="3"
          y2="7"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="3,4 3,10 0,7"
          fill="#6b7280"
        />
        <line
          x1="5"
          y1="4"
          x2="5"
          y2="10"
          stroke="#6b7280"
          strokeWidth="2"
        />
      </marker>

      <marker
        id="arrow-many-to-many-source"
        markerWidth="16"
        markerHeight="16"
        refX="1"
        refY="8"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <line
          x1="15"
          y1="8"
          x2="3"
          y2="8"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <polygon
          points="3,5 3,10 0,7"
          fill="#6b7280"
        />
        <line
          x1="10"
          y1="5"
          x2="10"
          y2="11"
          stroke="#6b7280"
          strokeWidth="2"
        />
        <line
          x1="6"
          y1="5"
          x2="6"
          y2="11"
          stroke="#6b7280"
          strokeWidth="2"
        />
      </marker>

      <marker
        id="source-default-source"
        markerWidth="10"
        markerHeight="10"
        refX="1"
        refY="5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon
          points="1,2 1,8 0,5"
          fill="#6b7280"
        />
      </marker>
    </defs>
  </svg>
);
