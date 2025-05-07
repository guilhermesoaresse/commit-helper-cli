export function buildCommitMessage({ type, scope, title, body, taskId, config }) {
  const emoji = type.emoji ? `${type.emoji} ` : "";
  const scopeText = scope ? `(${scope})` : "";
  let message = `${type.value}${scopeText}: ${emoji}${title.trim()}`;

  if (body && body.trim()) {
    message += `\n\n${body.trim()}`;
  }

  if (taskId && taskId.trim()) {
    const url = config.taskUrl?.replace("{id}", taskId.trim()) || "";
    message += `\n\nRefs: ${taskId.trim()}${url ? ` (${url})` : ""}`;
  }

  return message;
}
