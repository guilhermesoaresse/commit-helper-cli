#!/usr/bin/env node

import readline from "readline";
import { exec } from "child_process";
import { buildCommitMessage } from "../lib/commitBuilder.js";
import { getConfig } from "../lib/config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

(async () => {
  const config = getConfig();

  console.log("\n🚀 Commit Helper - Padronize seus commits com facilidade\n");

  const typeChoices = config.types.map(t => `${t.emoji || ''} ${t.value}`).join(", ");
  const scopeChoices = config.scopes.join(", ");

  const typeInput = await ask(`Tipo (${typeChoices}): `);
  const scope = await ask(`Escopo (${scopeChoices}): `);
  const title = await ask("Título (resumo do commit): ");
  const body = await ask("Descrição técnica (opcional): ");
  let taskPrompt = "ID da tarefa (opcional";

  if (config.taskPrefix) {
    taskPrompt += ` - ex: ${config.taskPrefix}123ABC ou apenas 123ABC`;
  }
  taskPrompt += "): ";

  let taskIdRaw = await ask(taskPrompt);
  let taskId = taskIdRaw.trim();

  // Aplica o prefixo se necessário
  if (config.taskPrefix && taskId && !taskId.startsWith(config.taskPrefix)) {
    taskId = `${config.taskPrefix}${taskId}`;
  }

  const type = config.types.find(t => typeInput.includes(t.value)) || { value: typeInput.trim(), emoji: "" };

  const message = buildCommitMessage({ type, scope, title, body, taskId, config });

  console.log("\n📝 Commit gerado:\n");
  console.log(message);

  const confirm = await ask("\nDeseja aplicar este commit? (s/n): ");
  if (confirm.toLowerCase() === "s") {
    exec(`git commit -m "${message.replace(/"/g, '\\"')}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Erro ao executar commit:", stderr);
      } else {
        console.log("✅ Commit realizado com sucesso!");
      }
      rl.close();
    });
  } else {
    console.log("❌ Commit cancelado.");
    rl.close();
  }
})();
