"use client";
import React, { useEffect, useRef } from 'react';
import { clearLine } from 'readline';

function NotebookViewer({ htmlContent, onCellClick }: {
    htmlContent: string;
    onCellClick: (cellId: string) => void;
}) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe: any = iframeRef.current;
    
    const clearCellStyles = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const codeCells = iframeDoc.querySelectorAll('.cell.code_cell');
      codeCells.forEach((cell: any) => {
        cell.style.backgroundColor = ''; // Reset background color
        cell.style.border = ''; // Reset border
      });
    };
    const setCurrentCell = (cellId: string) => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const currentCell = iframeDoc.getElementById(`cell-${cellId}`);
      clearCellStyles();
      if (currentCell) {
        currentCell.style.backgroundColor = '#d0e0f0'; // Highlight current cell
        currentCell.style.border = "1px solid #007bff"; // Add border to current cell
        currentCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const codeCells = iframeDoc.querySelectorAll('.cell.code_cell');

      codeCells.forEach((cell: any) => {
        cell.addEventListener('click', () => {
          const cellId = cell.getAttribute('id')?.replace('cell-', '');
          setCurrentCell(cellId);
          if (cellId) {
            onCellClick(cellId);
          }
        });
        cell.addEventListener('mouseover', () => {
          cell.style.backgroundColor = '#f0f0f0'; // Highlight on hover
        });
        cell.addEventListener('mouseout', () => {
          cell.style.backgroundColor = ''; // Reset background color
        });
      });
      
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [onCellClick]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={htmlContent}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Notebook Viewer"
    />
  );
}

export default NotebookViewer;
