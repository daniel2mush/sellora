declare module "react-to-pdf" {
  import * as React from "react";

  export interface ReactToPdfProps {
    targetRef: React.RefObject<HTMLElement>;
    filename?: string;
    options?: object;
    x?: number;
    y?: number;
    scale?: number;
    onComplete?: () => void;
    onProgress?: () => void;
    onError?: (error: any) => void;
    children: (props: { toPdf: () => void }) => React.ReactNode;
  }

  const ReactToPdf: React.FC<ReactToPdfProps>;
  export default ReactToPdf;
}
