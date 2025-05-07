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

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {

      if (error && error.code !== 0) {
        resolve({ stdout, stderr, error });
        return;
      }
      if (error) {
        reject({ error, stderr, stdout });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
};

(async () => {
  try { 
    const { stdout: stagedFilesOutput } = await execPromise("git diff --cached --name-only");
    const files = stagedFilesOutput.trim().split("\n").filter(file => file); // Filter out empty lines

    if (files.length === 0) { // Should ideally be caught by --quiet, but as a safeguard
      console.log("\nℹ️ Não há arquivos no stage para commitar.");
      console.log("Use 'git add <arquivo>...' para adicionar arquivos ao stage.");
      rl.close();
      return;
    }

    console.log("\n📁 Arquivos no stage para commitar:");
    files.forEach(file => console.log(`  - ${file}`));

    const confirmStaged = await ask("\n❓ Deseja commitar estes arquivos? (s/n): ");
    if (confirmStaged.toLowerCase() !== "s") {
      console.log("❌ Operação de commit cancelada pelo usuário.");
      rl.close();
      return;
    }

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
  } catch (error) {
    console.error("Um erro inesperado ocorreu:", error.message);
    if (rl && typeof rl.close === 'function') { // Ensure rl is defined and has close method
      rl.close();
    }
  }
})();
