export const OWNER = "biocypher";
export const REPO = "biochatter-next";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const DOCS_URL = 'https://biocypher.org'

export const DEFAULT_CORS_HOST = "https://a.nextweb.fun";
export const DEFAULT_API_HOST = `${DEFAULT_CORS_HOST}/api/proxy`;
export const OPENAI_BASE_URL = "https://api.openai.com";
export const LOCAL_BASE_URL = "http://localhost:5001"

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Welcome = "/welcome",
  Masks = "/masks",
  NewProject = "/new-project",
  Auth = "/auth",
  RAG = "/rag",
  KG = "/kg"
}

export enum ApiPath {
  Cors = "/api/cors",
  OpenAI = "/api/openai",
  RAG = "/api/rag",
  KG = "/api/kg",
  TokenUsage = "/api/tokenusage",
  JobFiles = "/api/job/files",
  JobFile = "/api/job/file",
}

export enum ProjectTypeEnum {
  Unknown = "unknown",
  Scanpy = "scanpy",
  AnnData = "anndata",
  scGNN = "scgnn",
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "biochatter-next",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
  RAG = "rag-store",
  KG = "kg-store",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000 * 3; // 3 mins

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
}

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const BiochatterPath = {
  ChatPath: "v1/chat/completions",
  NewDocument: "v1/rag/newdocument",
  AllDocuments: "v1/rag/alldocuments",
  Document: "v1/rag/document",
  RAGConnectionStatus: "v1/rag/connectionstatus",
  KGConnectionStatus: "v1/kg/connectionstatus",
  TokenUsage: "v1/tokenusage",
}

export const Azure = {
  ExampleEndpoint: "https://{resource-url}/openai/deployments/{deploy-id}",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: {{cutoff}}
Current model: {{model}}
Current time: {{time}}
Latex inline: $x^2$
Latex block: $$e=mc^2$$
`;

export const SUMMARIZE_MODEL = "gpt-3.5-turbo";

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-1106-preview": "2023-04",
  "gpt-4-vision-preview": "2023-04",
};

export const DEFAULT_MODELS = [{
  name: "gpt-4o",
  available: true,
}, {
  name: "gpt-4",
  available: true,
}, {
  name: "gpt-3.5-turbo",
  available: true,
}] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;

// biochatter-server error
export const ERROR_BIOSERVER_OK = 0
export const ERROR_BIOSERVER_UNKNOWN = 5100
export const ERROR_BIOSERVER_MILVUS_UNKNOWN = 5101
export const ERROR_BIOSERVER_MILVUS_CONNECT_FAILED = 5102
export const ERROR_BIOSERVER_EXCEEDS_TOKEN_LIMIT = 5103
 
export const HDR_CONTENT_TYPE = "Content-Type";
export const HDR_APPLICATION_JSON = "application/json";

