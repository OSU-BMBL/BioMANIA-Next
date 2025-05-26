import { ApiPath, HDR_APPLICATION_JSON, HDR_CONTENT_TYPE } from "../constant";
import { getFetchUrl } from "../utils";
import { DbConnectionArgs } from "../utils/datatypes";
import { getHeaders } from "./api";

const AUTHORIZATION = "Authorization";
const APIKEY = "api-key";
function get_auth_header(): Record<string, string> {
  const jsonHeaders = getHeaders();
  if (jsonHeaders[AUTHORIZATION]) {
    return { [AUTHORIZATION]: jsonHeaders[AUTHORIZATION] };
  }
  return { [APIKEY]: jsonHeaders[APIKEY] };
}

export const requestKGConnectionStatus = async (
  connectionArgs: DbConnectionArgs
) => {
  const KG_UAL = ApiPath.KG;
  let fetchUrl = KG_UAL as string;
  if (!fetchUrl.endsWith('/')) {
    fetchUrl += '/';
  }
  const connectionStatusUrl = fetchUrl + 'connectionstatus';
  const res = await fetch(connectionStatusUrl, {
    method: "POST",
    headers: {
      [HDR_CONTENT_TYPE]: HDR_APPLICATION_JSON,
    },
    body: JSON.stringify({connectionArgs})
  });

  return res;
}

export const requestAllVSDocuments = async (
  connectionArgs: DbConnectionArgs,
  docIds?: string[]
) => {
  const RAG_URL = ApiPath.RAG;
  let fetchUrl = RAG_URL as string;
  if (!fetchUrl.endsWith('/')) {
    fetchUrl += '/';
  }
  fetchUrl += 'alldocuments';
  const res = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      ...get_auth_header(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connectionArgs, docIds }),
  });
  return res;
}

export const requestVSConnectionStatus = async(
  connectionArgs: DbConnectionArgs
) => {
  const RAG_URL = ApiPath.RAG;
  let fetchUrl = RAG_URL as string;
  if (!fetchUrl.endsWith('/')) {
    fetchUrl += '/';
  }
  const connectionStatusUrl = fetchUrl + "connectionstatus";
  const res = await fetch(connectionStatusUrl, {
    method: 'POST',
    headers: {
      ...get_auth_header(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connectionArgs }),
  });

  return res;
}

export const requestUploadFile = async (
  sessionId: string,
  file: File,
  dataType: string,
  demoMode: boolean,
  subPath: string,
) => {
  const FILEUPLOAD = ApiPath.JobFile;
  let uploadPath = getFetchUrl(subPath, FILEUPLOAD);
  const data = new FormData();
  data.set('file', file);
  data.set('sessionId', sessionId);
  data.set("dataType", dataType);
  data.set("example_mode", demoMode.toString())
  const res = await fetch(uploadPath, {
    method: "POST",
    body: data,
  });
  return res;
}

export const requestRemoveDocument = async (
  connectionArgs: DbConnectionArgs,
  docId: string,
  docIds: string[],
) => {
  const RAG_URL = ApiPath.RAG;
  const path = "document";
  let delPath = RAG_URL as string;
  if (!delPath.endsWith('/')) {
    delPath += '/';
  }
  delPath += path;
  const res = await fetch(delPath, {
    method: "DELETE",
    body: JSON.stringify({ docId, connectionArgs, docIds}),
    headers: {
      ...get_auth_header()
    }
  });
  return res;
}

export const requestTokenUsage = async (
  session_id?: string,
  model?: string
) => {
  const TokenUsage_URL = ApiPath.TokenUsage;
  let url = TokenUsage_URL as string;
  if (!url.endsWith('/')) {
    url += '/';
  }
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      "session_id": session_id ?? "",
      "model": model ?? "gpt-3.5-turbo",
    }),
    headers: {
      ...get_auth_header()
    }
  });
  return res;
}

export const requestJobFiles = async (sessionId: string, demoMode: boolean, subPath: string) => {
  const FILEURL = getFetchUrl(subPath, ApiPath.JobFiles + '/' + sessionId);
  try {
    const res = await fetch(FILEURL, {
      method: "POST",     
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({example_mode: demoMode}) 
    })
    return res;
  } catch (e: any) {
    console.log(e);
  }
}

export const requestDownloadJobFile = async (
  sessionId: string, filename: string, demoMode: boolean, subPath: string
) => {
  const fetchUrl = getFetchUrl(subPath, ApiPath.JobFile + '?' + new URLSearchParams({
    sessionId: sessionId,
    filename,
    example_mode: demoMode.toString(),
  }));
  try {
    const res = await fetch(fetchUrl, {method: "GET"});
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error(e);
  }
}
