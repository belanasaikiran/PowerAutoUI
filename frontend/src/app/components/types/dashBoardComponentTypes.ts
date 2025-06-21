// ============================================================================
// TYPE DEFINITIONS FOR DRAG & DROP DASHBOARD SYSTEM
// ============================================================================

/**
 * Configuration object for each component instance on the canvas
 * This represents a single component that has been placed on the dashboard
 */
export interface ComponentConfig {
    id: string;                    // Unique identifier for this component instance
    type: string;                  // Type of component (matches registry key)
    name: string;                  // Display name of the component
    props: Record<string, any>;    // Props to pass to the component
    position: {                    // Position on the canvas
      x: number;
      y: number;
    };
    size: {                        // Size of the component
      width: number;
      height: number;
    };
  }
  
  /**
   * Data structure for drag operations
   * Used to identify what is being dragged and where
   */
  export interface DragItem {
    type: 'new-component' | 'existing-component';  // Type of drag operation
    componentType: string;                         // Component type being dragged
    id?: string;                                   // ID if dragging existing component
  }
  
  /**
   * Result of a drop operation
   * Contains information about where the drop occurred
   */
  export interface DropResult {
    dropEffect: string;
    position: {
      x: number;
      y: number;
    };
  }
  
  /**
   * Definition of a reusable component that can be registered
   * This is what your friends will use to add their components
   */
  export interface ReusableComponent {
    type: string;                              // Unique type identifier
    name: string;                              // Display name in palette
    component: React.ComponentType<any>;       // The actual React component
    defaultProps: Record<string, any>;         // Default props for new instances
    icon?: string;                             // Icon to show in palette (emoji)
    category?: string;                         // Category for organization
    description?: string;                      // Optional description
  }
  
  /**
   * Canvas state and configuration
   */
  export interface CanvasState {
    components: ComponentConfig[];
    selectedComponentId: string | null;
    dragOverPosition: { x: number; y: number } | null;
  }
  
  /**
   * Event handlers for component operations
   */
  export interface ComponentOperations {
    onAdd: (component: ComponentConfig) => void;
    onUpdate: (id: string, updates: Partial<ComponentConfig>) => void;
    onDelete: (id: string) => void;
    onReplace: (id: string, newType: string) => void;
    onSelect: (id: string) => void;
  }