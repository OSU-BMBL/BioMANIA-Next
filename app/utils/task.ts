

// contexts: Array<{mode: string, context: Array<[string, string]>}>
export function parse_task_id(
  contexts: Array<{
    mode: string, context: Array<[string, string]>
  }> | undefined): string | undefined {
  if (!contexts || contexts.length === 0) {
    return undefined;
  }

  let task_id = undefined;
  contexts.find((item: any) => {
    if (item.mode === "api_scanpy") {
      if (item.context) {
        const res = item.context.find((t: [string, string]) => (
          t[1] === "task_id"
        ));
        task_id = res ? res[0] : undefined;
        return res;
      }
      return undefined;
    }
  });

  return task_id;
}
