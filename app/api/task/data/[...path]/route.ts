
import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_BIOSERVER_OK, LOCAL_BASE_URL, BiochatterPath, ERROR_BIOSERVER_UNKNOWN } from "@/app/constant";
import { BioChatterServerResponse } from "@/app/api/common";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

async function requestTaskData(
  sessionId: string,
  taskId: string,
) {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;
  const dt = new Date();

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const path = BiochatterPath.TaskData;
  const fetchUrl = `${baseUrl}/${path}/${sessionId}/${taskId}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 1 * 60 * 1000);
  const fetchOptions: RequestInit = {
    method: "GET",
  };
  try {
    const res = await fetch(fetchUrl, fetchOptions);
    const jsonBody = await res.json();
    if (jsonBody.code !== ERROR_BIOSERVER_OK) {
      return NextResponse.json({code: ERROR_BIOSERVER_UNKNOWN});
    }
    const value = jsonBody as any;
    return NextResponse.json(jsonBody);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleGetFile(
  request: NextRequest, 
  { params }: { params: {path: string[]} }
) {
  try {
    const sessionId = params.path[0];
    const taskId = params.path[1];

    const url = new URL(request.url)
    
    const res = await requestTaskData(sessionId, taskId);    
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handleGetFile;

