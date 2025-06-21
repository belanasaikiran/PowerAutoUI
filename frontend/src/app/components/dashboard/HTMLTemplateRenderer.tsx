'use client'

import React, { useRef, useEffect } from 'react';

interface HTMLTemplateRendererProps {
  htmlContent: string;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

const HTMLTemplateRenderer: React.FC<HTMLTemplateRendererProps> = ({ 
  htmlContent, 
  onError,
  onLoad 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('HTMLTemplateRenderer: Received content length:', htmlContent?.length);
    
    if (containerRef.current && htmlContent) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      try {
        // For full HTML documents, we need to extract the body content
        let contentToRender = htmlContent;
        
        // Check if it's a full HTML document
        if (htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html')) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');
          
          // Extract head styles and scripts
          const headStyles = doc.head.querySelectorAll('style');
          const headScripts = doc.head.querySelectorAll('script');
          
          // Add styles to current document head
          headStyles.forEach(style => {
            const newStyle = document.createElement('style');
            newStyle.textContent = style.textContent;
            document.head.appendChild(newStyle);
          });
          
          // Get body content
          contentToRender = doc.body.innerHTML;
          
          // Handle external scripts from head
          headScripts.forEach(script => {
            if (script.src) {
              const newScript = document.createElement('script');
              newScript.src = script.src;
              newScript.async = true;
              document.head.appendChild(newScript);
            }
          });
        }
        
        // Create a new div to hold the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentToRender;
        
        console.log('HTMLTemplateRenderer: Parsed content, found elements:', tempDiv.children.length);
        
        // Extract and load external scripts from body
        const scripts = tempDiv.querySelectorAll('script');
        const scriptPromises: Promise<void>[] = [];
        
        scripts.forEach((script) => {
          if (script.src) {
            // External script
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.async = true;
            
            const promise = new Promise<void>((resolve, reject) => {
              newScript.onload = () => {
                console.log('Loaded external script:', script.src);
                resolve();
              };
              newScript.onerror = () => {
                console.error('Failed to load script:', script.src);
                reject(new Error(`Failed to load script: ${script.src}`));
              };
            });
            
            document.head.appendChild(newScript);
            scriptPromises.push(promise);
          }
        });
        
        // Function to render content and execute scripts
        const renderContent = () => {
          // Move the content to the container
          while (tempDiv.firstChild) {
            containerRef.current?.appendChild(tempDiv.firstChild);
          }
          
          console.log('HTMLTemplateRenderer: Content moved to container');
          
          // Execute inline scripts
          const inlineScripts = containerRef.current?.querySelectorAll('script');
          console.log('HTMLTemplateRenderer: Found inline scripts:', inlineScripts?.length);
          
          inlineScripts?.forEach((script, index) => {
            if (!script.src && script.textContent) {
              try {
                console.log(`Executing inline script ${index + 1}`);
                // Create a new script element and execute it
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                document.body.removeChild(newScript);
              } catch (scriptError) {
                console.error('Error executing inline script:', scriptError);
                onError?.(scriptError as Error);
              }
            }
          });

          // Call onLoad callback if provided
          console.log('HTMLTemplateRenderer: Rendering complete');
          onLoad?.();
        };
        
        // Wait for external scripts to load, then render content
        if (scriptPromises.length > 0) {
          Promise.all(scriptPromises).then(() => {
            renderContent();
          }).catch((error) => {
            console.error('Error loading external scripts:', error);
            onError?.(error);
            // Still render content even if scripts fail
            renderContent();
          });
        } else {
          // No external scripts, render immediately
          renderContent();
        }
        
      } catch (error) {
        console.error('Error rendering HTML template:', error);
        onError?.(error as Error);
      }
    }
  }, [htmlContent, onError, onLoad]);

  return (
    <>
      {/* CSS for HTML template styling */}
      <style jsx>{`
        .html-template-container {
          width: 100%;
          height: 100%;
          overflow: auto;
          position: relative;
          background-color: #f4f7fa;
        }

        /* Ensure HTML template content doesn't interfere with parent */
        .html-template-container {
          isolation: isolate;
        }

        /* Ensure charts and interactive elements work properly */
        .html-template-container canvas {
          max-width: 100%;
          height: auto;
        }

        /* Ensure buttons and form elements work */
        .html-template-container button,
        .html-template-container input,
        .html-template-container select {
          pointer-events: auto;
        }

        /* Custom scrollbar for template content */
        .html-template-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .html-template-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .html-template-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .html-template-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Ensure grid layouts work properly */
        .html-template-container .dashboard-container {
          display: grid !important;
        }

        /* Ensure cards are visible */
        .html-template-container .card {
          background-color: #fff !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          padding: 20px !important;
        }
      `}</style>

      <div 
        ref={containerRef} 
        className="html-template-container"
        style={{ 
          width: '100%', 
          height: '100%',
          overflow: 'auto',
          position: 'relative',
          minHeight: '500px'
        }}
      />
    </>
  );
};

export default HTMLTemplateRenderer; 