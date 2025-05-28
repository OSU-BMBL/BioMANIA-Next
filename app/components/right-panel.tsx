
"use client";
import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-github";
import dynamic from "next/dynamic";

import LoadingIcon from "../icons/three-dots.svg";
import styles from "./right-panel.module.scss";
import { IconButton } from "./button";
import ClearIcon from "../icons/clear.svg";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});


export function RightPanel(
  {className}: {className?: string}
) {
  
  function onChange(newValue: string) {
    console.log("New value:", newValue);
  }

  return(
    <div className={`${styles["right-panel"]} ${className}`}>
      <div className={styles['panel-item']}>
        <div className={styles["panel-item-header"]}>
        <div className={styles["panel-item-title"]}>
          Output: 
        </div>
        </div>
        <div id="task-window" className={styles["panel-item-body"]}>
        <div className={styles["logs-area"]} > 
          <Markdown
            content="## Task List\n\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3"
          ></Markdown>
        </div>
        </div>
      </div>
      <div id="logs-window" className={styles['panel-item']}>
        <div className={styles["panel-item-header"]}>
        <div className={styles["panel-item-title"]}>
          Code: 
        </div>
        <div className={styles["panel-item-clear"]}>
          <IconButton
            className={styles["clear-button"]}
            text="Submit"
            icon={<ClearIcon />}
          ></IconButton>
        </div>
        </div>
        <div className={styles["panel-item-body"]}>
          <AceEditor
        mode="python"
        theme="github"
        name="right-panel-editor"
        value={`def onLoad() {
  print("I've loaded all code.");
}`}
        width="100%"
        height="100%"
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
      </div>
    </div>
  );
}