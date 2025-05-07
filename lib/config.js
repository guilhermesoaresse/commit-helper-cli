import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getConfig() {
  const cwd = process.cwd();

  const rcPath = path.join(cwd, ".commit-helperrc.json");
  if (fs.existsSync(rcPath)) {
    return JSON.parse(fs.readFileSync(rcPath, "utf-8"));
  }

  const pkgPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    if (pkg["commit-helper"]) {
      return pkg["commit-helper"];
    }
  }

  return {
    types: [
      { value: "feat", emoji: "✨", label: "Nova funcionalidade" },
      { value: "fix", emoji: "🐛", label: "Correção de bug" },
      { value: "docs", emoji: "📝", label: "Documentação" },
      { value: "refactor", emoji: "♻️", label: "Refatoração" },
      { value: "chore", emoji: "🔧", label: "Tarefa técnica" }
    ],
    scopes: ["geral"],
    taskPrefix: "CU-",
    taskUrl: "https://app.clickup.com/t/{id}"
  };
}
