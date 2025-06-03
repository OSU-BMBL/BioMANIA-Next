
"use client";
import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-github";
import dynamic from "next/dynamic";
import NotebookViewer from "./notebook-render";

import LoadingIcon from "../icons/three-dots.svg";
import styles from "./right-panel.module.scss";
import { IconButton } from "./button";
import ClearIcon from "../icons/clear.svg";
import {useChatStore} from "../store/chat";


const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});


export function RightPanel(
  {className}: {className?: string}
) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const taskData = session.currentTask;
  const [code, setCode] = React.useState<string>("");
  function onCellClick(cellId: string) {
    const taskData = session.currentTask;
    if (!taskData) {
      return;
    }
    const jsondata = JSON.parse(taskData.ipynb??"{\"cells\": []}");
    jsondata.cells.forEach((cell: any) => {
      if (cell.metadata.id === cellId) {
        setCode(cell.source.join(""));
      }
    });
  }
  
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
          <NotebookViewer
            htmlContent={taskData?.html ?? ""}
            onCellClick={onCellClick}
          />
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
        value={code}
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