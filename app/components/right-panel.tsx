
"use client";
import React from "react";
import { 
  Jupyter, 
  Notebook, 
} from "@datalayer/jupyter-react";

import styles from "./right-panel.module.scss";

// import data from "./ipywidgets.ipynb.json";
import data from "./pbmc3k.ipynb.json";

export function RightPanel(
  {className}: {className?: string}
) {
  
  return(
    <div className={`${styles["right-panel"]} ${className}`}>
      <Jupyter 
        lite={true}             
  startDefaultKernel={true}
  collaborative={false}
  terminals={false}
      >
        <Notebook 
          nbformat={data}
        />
      </Jupyter>
    </div>
  );
}