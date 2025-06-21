'use client'

import React, { useRef, useEffect } from 'react';

// Extend Window interface for Chart.js
declare global {
  interface Window {
    Chart: any;
  }
}

interface SimpleHTMLRendererProps {
  htmlContent: string;
}

const SimpleHTMLRenderer: React.FC<SimpleHTMLRendererProps> = ({ htmlContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('SimpleHTMLRenderer: Received content length:', htmlContent?.length);
    
    if (containerRef.current && htmlContent) {
      try {
        // Simple approach - just set innerHTML directly
        containerRef.current.innerHTML = htmlContent;
        console.log('SimpleHTMLRenderer: Content set directly');
        
        // Load Chart.js if not already loaded
        if (!window.Chart && !document.querySelector('script[src*="chart.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
          script.onload = () => {
            console.log('Chart.js loaded');
            // Re-execute any inline scripts after Chart.js loads
            const scripts = containerRef.current?.querySelectorAll('script');
            scripts?.forEach((script) => {
              if (!script.src && script.textContent) {
                try {
                  eval(script.textContent);
                } catch (error) {
                  console.error('Error executing script:', error);
                }
              }
            });
          };
          document.head.appendChild(script);
        } else {
          // Chart.js already available, execute scripts
          setTimeout(() => {
            const scripts = containerRef.current?.querySelectorAll('script');
            scripts?.forEach((script) => {
              if (!script.src && script.textContent) {
                try {
                  eval(script.textContent);
                } catch (error) {
                  console.error('Error executing script:', error);
                }
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error('SimpleHTMLRenderer error:', error);
      }
    }
  }, [htmlContent]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#f4f7fa'
      }}
    />
  );
};

export default SimpleHTMLRenderer; 