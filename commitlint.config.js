module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "refactor", "test", "style"],
    ],
    "type-empty": [2, "never"], // Não aceita tipo vazio
    "subject-empty": [2, "never"], // Não aceita mensagem vazia
  },
};
