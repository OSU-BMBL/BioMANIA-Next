
"use client";
import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-github";

import styles from "./right-panel.module.scss";

// import data from "./ipywidgets.ipynb.json";
// import data from "./pbmc3k.ipynb.json";

export function RightPanel(
  {className}: {className?: string}
) {
  
  function onChange(newValue: string) {
    console.log("New value:", newValue);
  }

  return(
    <div className={`${styles["right-panel"]} ${className}`}>
      <AceEditor
        mode="python"
        theme="github"
        name="right-panel-editor"
        value={`function onLoad(editor) {
  console.log("i've loaded");
}`}
        width="100%"
        height="90%"
        highlightActiveLine={true}
        onChange={onChange}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        setOptions={{
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false,
  enableSnippets: false,
  enableMobileMenu: true,
  showLineNumbers: true,
  tabSize: 2,
  }}
      />
    </div>
  );
}