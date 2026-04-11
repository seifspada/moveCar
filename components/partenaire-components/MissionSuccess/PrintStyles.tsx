// components/MissionSuccess/PrintStyles.tsx

import React from 'react';

export const PrintStyles: React.FC = () => (
  <style jsx>{`
    @media print {
      @page {
        size: A4;
        margin: 10mm 12mm;
      }

      * {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      body {
        margin: 0;
        padding: 0;
      }

      .print\\:hidden {
        display: none !important;
      }

      .print\\:shadow-none {
        box-shadow: none !important;
      }

      .print\\:rounded-none {
        border-radius: 0 !important;
      }

      .print\\:border {
        border-width: 1px !important;
      }

      .grid > div {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }

    .line-clamp-1 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .line-clamp-3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  `}</style>
);
