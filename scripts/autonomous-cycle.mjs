#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const checks = [
  { name: "lint", args: ["run", "lint"] },
  { name: "typecheck", args: ["run", "typecheck"] },
  { name: "test", args: ["run", "test"] },
  { name: "build", args: ["run", "build"] },
];

const maxCycles = Number(process.env.AUTONOMOUS_MAX_CYCLES ?? "5");

function runCheck(check) {
  const command = `npm ${check.args.join(" ")}`;
  const result = spawnSync(command, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  if (result.error) {
    console.error(result.error.message);
  }

  return result.status ?? 1;
}

function runCycle(cycleNumber) {
  console.log(`\n=== Autonomous cycle ${cycleNumber}/${maxCycles} ===`);

  for (const check of checks) {
    console.log(`\n-> Running ${check.name}`);
    const status = runCheck(check);
    if (status !== 0) {
      console.error(`\n[FAIL] ${check.name} failed in cycle ${cycleNumber}.`);
      console.error("Fix the reported issue, then re-run: npm run autonomous:cycle");
      return false;
    }
  }

  console.log(`\n[PASS] Cycle ${cycleNumber} completed successfully.`);
  return true;
}

let allPassed = false;
for (let cycle = 1; cycle <= maxCycles; cycle++) {
  allPassed = runCycle(cycle);
  if (!allPassed) {
    process.exit(1);
  }
}

console.log(`\nAll ${maxCycles} cycles passed.`);
