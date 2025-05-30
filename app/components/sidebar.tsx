import { useEffect, useRef, useMemo } from "react";

import styles from "./home.module.scss";

import { useAccessStore } from "../store/access";
import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ReadTheDocsIcon from "../icons/read-the-docs.svg";
// import ChatGptIcon from "../icons/chatgpt.svg";
import BioChatterIcon from "../icons/biochatter.svg";
import AboutIcon from "../icons/about.svg";
import DeleteIcon from "../icons/delete.svg";
import MaskIcon from "../icons/mask.svg";
import DragIcon from "../icons/drag.svg";
import LightIcon from "../icons/light.svg";
import DarkIcon from "../icons/dark.svg";
import AutoIcon from "../icons/auto.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore, Theme } from "../store";

import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
  DOCS_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { isIOS, useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showConfirm, showToast } from "./ui-lib";
import { DbConfiguration, ProductionInfo } from "../utils/datatypes";
import { getKnowledgeGraphInfo, getMaskInfo, getVectorStoreInfo } from "../utils/prodinfo";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const toggleSideBar = () => {
    config.update((config) => {
      if (config.sidebarWidth < MIN_SIDEBAR_WIDTH) {
        config.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      } else {
        config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
      }
    });
  };

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX;
    startDragWidth.current = config.sidebarWidth;
    const dragStartTime = Date.now();

    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20) {
        return;
      }
      lastUpdateTime.current = Date.now();
      const d = e.clientX - startX.current;
      const nextWidth = limit(startDragWidth.current + d);
      config.update((config) => {
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
        } else {
          config.sidebarWidth = nextWidth;
        }
      });
    };

    const handleDragEnd = () => {
      // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);

      // if user click the drag icon, should toggle the sidebar
      const shouldFireClick = Date.now() - dragStartTime < 300;
      if (shouldFireClick) {
        toggleSideBar();
      }
    };

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  };

  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragStart,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();
  const accessStore = useAccessStore();
  const prodInfo = 
    accessStore.productionInfo === "undefined" ? 
    undefined : 
    (JSON.parse(accessStore.productionInfo) as any) as ProductionInfo;
  const currentModel = chatStore.currentSession().mask.modelConfig.model ?? "gpt-3.5-turbo";
  const sessionId = chatStore.currentSession().id ?? "";
  const mask = getMaskInfo(prodInfo);

  // drag side bar
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const theme = config.theme;
  const isMobileScreen = useMobileScreen();
  const isIOSMobile = useMemo(
    () => isIOS() && isMobileScreen,
    [isMobileScreen],
  );

  useHotKey();

  useEffect(() => {
    accessStore.updateTokenUsage(sessionId, currentModel);
  }, []);

  // switch themes
  function nextTheme() {
    const themes = [Theme.Auto, Theme.Light, Theme.Dark];
    const themeIndex = themes.indexOf(theme);
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    config.update((config) => (config.theme = nextTheme));
  }

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${shouldNarrow && styles["narrow-sidebar"]
        }`}
      style={{
        // #3016 disable transition on ios mobile screen
        transition: isMobileScreen && isIOSMobile ? "none" : undefined,
      }}
    >
      <div className={styles["sidebar-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <BioChatterIcon />
        </div>
        <div className={styles['sidebar-header-text']}>
          <div className={styles["sidebar-title"]} data-tauri-drag-region>
            {Locale.Sidebar.AppTitle}
          </div>
          <div className={styles["sidebar-sub-title"]}>
            {Locale.Sidebar.AppSubtitle}
          </div>
        </div>
      </div>
      <div className={styles["sidebar-sub-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-sub-title"]}>
          {Locale.Sidebar.AppDescription}
        </div>
      </div>
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<AboutIcon width={16} height={16} />}
          text={shouldNarrow ? undefined : Locale.Welcome.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => {
            navigate(Path.Welcome, { state: { fromHome: true } });
          }}
          shadow
        />
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : "New Project"}
          className={styles["sidebar-bar-button"]}
          onClick={() => {
            if (mask) {
              chatStore.newSession(mask);
              navigate(Path.Chat);
            } else {
              if (config.dontShowMaskSplashScreen !== true) {
                navigate(Path.NewProject);
              } else {
                navigate(Path.Masks, { state: { fromHome: true } });
              }
            }
          }}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-footer-bar"]}>
        {!shouldNarrow && (
          <div className={styles["sidebar-token-usage"]}>
          {useAccessStore.getState().tokenUsage.auth_type.slice(0, 6) === "Server" ? (
            <div style={{fontSize: "14px", marginBottom: "10px"}}>Server token usage</div>
          ) : (
            <div style={{fontSize: "14px", marginBottom: "10px"}}>Client token usage</div>
          )}
          <div>Total tokens: {useAccessStore.getState().tokenUsage.tokens.total_tokens}</div>
          </div>
        )}
      </div>
      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<DeleteIcon />}
              onClick={async () => {
                if (await showConfirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} shadow />
            </Link>
          </div>
          <div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div>
          <div className={styles["sidebar-action"]}>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
              <IconButton icon={<ReadTheDocsIcon width={16} height={16} />} shadow />
            </a>
          </div>
        </div>
        <div className={styles["sidebar-action"]}>
          <IconButton
            icon={
              <>
                {theme === Theme.Auto ? (
                  <AutoIcon />
                ) : theme === Theme.Light ? (
                  <LightIcon />
                ) : theme === Theme.Dark ? (
                  <DarkIcon />
                ) : null}
              </>
            }
            onClick={nextTheme}
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onPointerDown={(e) => onDragStart(e as any)}
      >
        <DragIcon />
      </div>
    </div>
  );
}
