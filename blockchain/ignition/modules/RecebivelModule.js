const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RecebivelModule", (m) => {
  // Deploy do contrato RecebivelFactory
  const recebivelFactory = m.contract("RecebivelFactory", ["0x2ea66896A9fA67eEeFc062967428654189799595"]);

  // Se você quiser fazer um depósito inicial no contrato (opcional)
  // const depositAmount = m.getParameter("depositAmount", "0"); // em wei
  // m.call(recebivelFactory, "deposit", [], { value: depositAmount });

  return { recebivelFactory };
});

// Exemplo de como usar com parâmetros customizados:
// module.exports = buildModule("RecebivelModuleWithParams", (m) => {
//   // Parâmetros configuráveis
//   const initialDeposit = m.getParameter("initialDeposit", "0");
//   
//   const recebivelFactory = m.contract("RecebivelFactory", []);
//   
//   // Fazer depósito inicial se especificado
//   if (initialDeposit !== "0") {
//     m.call(recebivelFactory, "deposit", [], { value: initialDeposit });
//   }
//   
//   return { recebivelFactory };
// });