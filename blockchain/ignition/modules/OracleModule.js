const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("OracleModule", (m) => {
  // Deploy do contrato RecebivelFactory
  const recebivelOracle = m.contract("RecebivelOracle", []);

  // Se você quiser fazer um depósito inicial no contrato (opcional)
  // const depositAmount = m.getParameter("depositAmount", "0"); // em wei
  // m.call(recebivelFactory, "deposit", [], { value: depositAmount });

  return { recebivelOracle };
});