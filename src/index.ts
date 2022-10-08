import { promises as fs } from "fs";
var readline = require("readline-sync");

function stringify(unicode: number) {
  return String.fromCharCode(unicode);
}

const run = async (codes: string) => {
  const statements = codes
    .trim()
    .split(codes.includes("~") ? "~" : "\n")
    .map((line) => line.trim());

  if (
    statements[0] !== "하이네" ||
    !statements.slice(-1)[0].startsWith("바이네")
  ) {
    throw new Error("Error: 눈깔찌르기~");
  }

  const vars: number[] = [];
  let pointer = 0;

  const evaluate = async (x: string): Promise<number> => {
    let n = 0;
    if (x.includes(" "))
      return (await Promise.all(x.split(" ").map(evaluate))).reduce(
        (a, b) => a * b
      );
    if (x.includes("네?")) {
      const answer = readline.question();
      x = x.replace("네?", "구".repeat(Number(answer)));
    }
    if (x.includes("이")) n += vars[x.split("이").length - 1];
    if (x.includes("구")) n += x.split("구").length - 1;
    if (x.includes("겔")) n -= x.split("겔").length - 1;
    return n;
  };

  const execute = async (statement: string): Promise<number | undefined> => {
    if (statement.includes("미웡") && statement.includes("!")) {
      const condition = await evaluate(
        statement.substring(2, statement.lastIndexOf("!") + 1)
      );
      if (condition === 0) {
        return execute(statement.substr(statement.lastIndexOf("!") + 1));
      }
      return;
    }

    if (statement.includes("아")) {
      const variablePointer = statement.split("아")[0].split("이").length;
      const setteeValue = await evaluate(statement.split("아")[1]);
      vars[variablePointer] = setteeValue;
    }

    if (statement.includes("네") && statement[statement.length - 1] === "!") {
      process.stdout.write(String(await evaluate(statement.slice(1, -1))));
    }

    if (statement.includes("네") && statement[statement.length - 1] === "~") {
      if (statement === "네~") process.stdout.write("\n");
      process.stdout.write(stringify(await evaluate(statement.slice(1, -1))));
    }
  };

  while (!statements[pointer].startsWith("바이네")) {
    const statement = statements[pointer++];
    const evaluated = await execute(statement);
    if (evaluated) return evaluated;
  }
};

const bootstrap = async (path: string) => {
  try {
    try {
      await fs.access(path);
    } catch (e) {
      throw new Error(`Error : 대가리~`);
    }
    await run(await fs.readFile(path, "utf-8"));
  } catch (e: any) {
    process.stderr.write(`${e.message}`);
  }
};

if (process.argv[2]) bootstrap(process.argv[2]);
