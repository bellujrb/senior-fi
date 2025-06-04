const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Enhanced RecebivelFactory with Oracle Integration", function () {
  
  async function deployEnhancedContractsFixture() {
    const [owner, ilpi, investor, otherAccount, oracleUpdater] = await ethers.getSigners();

    // Deploy Oracle
    const RecebivelOracle = await ethers.getContractFactory("RecebivelOracle");
    const oracle = await RecebivelOracle.deploy();
    await oracle.waitForDeployment();

    // Deploy Factory
    const RecebivelFactory = await ethers.getContractFactory("RecebivelFactory");
    const factory = await RecebivelFactory.deploy(oracle.target);
    await factory.waitForDeployment();

    // CONFIGURAÇÃO CRÍTICA: Autorizar ILPIs e definir ratings
    await factory.authorizeILPI(ilpi1.address);
    await factory.authorizeILPI(ilpi2.address);
    
    // IMPORTANTE: Definir ratings das ILPIs no Oracle
    await oracle.updateILPIRating(ilpi1.address, 5); // Rating 5/10
    await oracle.updateILPIRating(ilpi2.address, 7); // Rating 7/10

    // Financiar o contrato
    await factory.fundContract({ value: ethers.parseEther("10") });

    return { factory, oracle, owner, ilpi1, ilpi2, investor1, investor2 };
  }

  async function deployWithRatedILPIFixture() {
    const fixture = await loadFixture(deployEnhancedContractsFixture);
    const { factory, oracle, owner, ilpi, oracleUpdater } = fixture;
    
    // Autorizar ILPI na factory
    await factory.connect(owner).authorizeILPI(ilpi.address);
    
    // Dar um rating bom para a ILPI no oracle
    await oracle.connect(oracleUpdater).updateILPIRating(ilpi.address, 8);

    return fixture;
  }
  

  async function deployWithTokenFixture() {
    const fixture = await loadFixture(deployWithRatedILPIFixture);
    const { factory, oracle, ilpi, oracleUpdater } = fixture;

    const tokenName = "Enhanced Recebivel";
    const tokenSymbol = "EREC";
    const ilpiName = "Enhanced ILPI";
    const discountValue = ethers.parseEther("0.1");
    const totalDebtValue = ethers.parseEther("0.12");
    const dueDate = Math.floor(Date.now() / 1000) + 86400; // 1 dia

    // Atualizar dados do oracle
    await oracle.connect(oracleUpdater).updateBNBPrice(ethers.parseEther("1500"));

    // ILPI cria o token
    await factory.connect(ilpi).createRecebivel(
      tokenName,
      tokenSymbol,
      ilpiName,
      discountValue,
      totalDebtValue,
      dueDate
    );

    const tokenInfo = await factory.tokens(0);
    const tokenContract = await ethers.getContractAt("RecebivelToken", tokenInfo.tokenAddress);

    return {
      ...fixture,
      tokenContract,
      tokenName,
      tokenSymbol,
      ilpiName,
      discountValue,
      totalDebtValue,
      dueDate
    };
  }

  describe("Enhanced Factory Deployment", function () {
    it("Should deploy with oracle integration", async function () {
      const { factory, oracle, owner } = await loadFixture(deployEnhancedContractsFixture);
      
      expect(await factory.owner()).to.equal(owner.address);
      expect(await factory.oracle()).to.equal(oracle.target);
      expect(await factory.baseRiskRate()).to.equal(200); // 2%
    });

    it("Should allow owner to update oracle address", async function () {
      const { factory, owner } = await loadFixture(deployEnhancedContractsFixture);
      
      // Deploy novo oracle
      const NewOracle = await ethers.getContractFactory("RecebivelOracle");
      const newOracle = await NewOracle.deploy();

      await expect(factory.connect(owner).setOracle(newOracle.target))
        .to.emit(factory, "OracleUpdated")
        .withArgs(newOracle.target);

      expect(await factory.oracle()).to.equal(newOracle.target);
    });

    it("Should allow owner to set base risk rate", async function () {
      const { factory, owner } = await loadFixture(deployEnhancedContractsFixture);

      const newRate = 300; // 3%
      await factory.connect(owner).setBaseRiskRate(newRate);
      expect(await factory.baseRiskRate()).to.equal(newRate);
    });

    it("Should revert base risk rate update with rate too high", async function () {
      const { factory, owner } = await loadFixture(deployEnhancedContractsFixture);

      await expect(factory.connect(owner).setBaseRiskRate(1001)) // > 10%
        .to.be.revertedWith("Risk rate too high");
    });
  });

  describe("Token Creation with Oracle Integration", function () {
    it("Should create token with ILPI rating verification", async function () {

      await oracle.updateILPIRating(ilpiAddress, desiredRating);

      const { factory, oracle, owner, ilpi, oracleUpdater } = await loadFixture(deployEnhancedContractsFixture);
      
      // Autorizar ILPI
      await factory.connect(owner).authorizeILPI(ilpi.address);
      
      // Dar rating alto para ILPI
      await oracle.connect(oracleUpdater).updateILPIRating(ilpi.address, 9);

      const tokenName = "High Rated Token";
      const tokenSymbol = "HRT";
      const ilpiName = "High Rated ILPI";
      const discountValue = ethers.parseEther("0.2");
      const totalDebtValue = ethers.parseEther("0.25");
      const dueDate = Math.floor(Date.now() / 1000) + 86400;

      await expect(factory.connect(ilpi).createRecebivel(
        tokenName,
        tokenSymbol,
        ilpiName,
        discountValue,
        totalDebtValue,
        dueDate
      )).to.emit(factory, "TokenCreated");

      const tokenInfo = await factory.tokens(0);
      expect(tokenInfo.ilpiRatingAtCreation).to.equal(9);
    });

    it("Should revert token creation with low ILPI rating", async function () {

      await oracle.updateILPIRating(ilpiAddress, desiredRating);

      const { factory, oracle, owner, ilpi, oracleUpdater } = await loadFixture(deployEnhancedContractsFixture);
      
      await factory.connect(owner).authorizeILPI(ilpi.address);
      
      // Dar rating baixo para ILPI
      await oracle.connect(oracleUpdater).updateILPIRating(ilpi.address, 2);

      await expect(factory.connect(ilpi).createRecebivel(
        "Low Rated Token",
        "LRT",
        "Low Rated ILPI",
        ethers.parseEther("0.1"),
        ethers.parseEther("0.12"),
        Math.floor(Date.now() / 1000) + 86400
      )).to.be.revertedWith("ILPI rating too low");
    });

    it("Should revert token creation with due date in the past", async function () {

      await oracle.updateILPIRating(ilpiAddress, desiredRating);
      const { factory, ilpi } = await loadFixture(deployWithRatedILPIFixture);

      const pastDate = Math.floor(Date.now() / 1000) - 3600; // 1 hora atrás

      await expect(factory.connect(ilpi).createRecebivel(
        "Past Due Token",
        "PDT",
        "Past Due ILPI",
        ethers.parseEther("0.1"),
        ethers.parseEther("0.12"),
        pastDate
      )).to.be.revertedWith("Due date must be in the future");
    });
  });
});

describe("RecebivelFactory and RecebivelToken", function () {
  // Fixture para deploy dos contratos - CORRIGIDO
  async function deployContractsFixture() {
    const [owner, ilpi, investor, otherAccount] = await ethers.getSigners();

    // Deploy Oracle primeiro (ADICIONADO)
    const RecebivelOracle = await ethers.getContractFactory("RecebivelOracle");
    const oracle = await RecebivelOracle.deploy();

    // Deploy Factory com Oracle (CORRIGIDO)
    const RecebivelFactory = await ethers.getContractFactory("RecebivelFactory");
    const factory = await RecebivelFactory.deploy(oracle.target);

    return { factory, oracle, owner, ilpi, investor, otherAccount };
  }

  // Fixture com ILPI autorizada e token já criado - CORRIGIDO
  async function deployWithTokenFixture() {
    const { factory, oracle, owner, ilpi, investor, otherAccount } = await loadFixture(deployContractsFixture);
    
    // Autorizar a ILPI primeiro
    await factory.connect(owner).authorizeILPI(ilpi.address);

    // Configurar Oracle com rating mínimo (ADICIONADO)
    // Assumindo que existe um método para isso, ou pode ser mock
    // Se não tiver método no oracle, você pode precisar implementar um mock

    const tokenName = "Recebivel Test";
    const tokenSymbol = "REC";
    const ilpiName = "ILPI Test";
    const discountValue = ethers.parseEther("0.1");
    const totalDebtValue = ethers.parseEther("0.11"); // 10% de rentabilidade
    const dueDate = Math.floor(Date.now() / 1000) + 86400; // 1 dia

    // ILPI cria o token
    await factory.connect(ilpi).createRecebivel(
      tokenName,
      tokenSymbol,
      ilpiName,
      discountValue,
      totalDebtValue,
      dueDate
    );

    const tokenInfo = await factory.tokens(0);
    const tokenContract = await ethers.getContractAt("RecebivelToken", tokenInfo.tokenAddress);

    return {
      factory,
      oracle, // ADICIONADO
      tokenContract,
      owner,
      ilpi,
      investor,
      otherAccount,
      tokenName,
      tokenSymbol,
      ilpiName,
      discountValue,
      totalDebtValue,
      dueDate
    };
  }

  describe("RecebivelFactory Deployment", function () {
    it("Should deploy with correct owner", async function () {
      const { factory, owner } = await loadFixture(deployContractsFixture);
      expect(await factory.owner()).to.equal(owner.address);
    });

    it("Should initialize tokenIdCounter to 0", async function () {
      const { factory } = await loadFixture(deployContractsFixture);
      expect(await factory.tokenIdCounter()).to.equal(0);
    });

    it("Should accept ETH deposits from owner", async function () {
      const { factory, owner } = await loadFixture(deployContractsFixture);
      
      const depositAmount = ethers.parseEther("1");
      await expect(factory.connect(owner).deposit({ value: depositAmount }))
        .to.changeEtherBalance(factory, depositAmount);
    });

    it("Should revert deposit from non-owner", async function () {
      const { factory, otherAccount } = await loadFixture(deployContractsFixture);
      
      await expect(factory.connect(otherAccount).deposit({ value: ethers.parseEther("1") }))
        .to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });
  });

  describe("ILPI Whitelist Management", function () {
    it("Should authorize ILPI correctly", async function () {
      const { factory, owner, ilpi } = await loadFixture(deployContractsFixture);

      await expect(factory.connect(owner).authorizeILPI(ilpi.address))
        .to.emit(factory, "ILPIAuthorized")
        .withArgs(ilpi.address);

      expect(await factory.isILPIAuthorized(ilpi.address)).to.be.true;
    });

    it("Should revoke ILPI authorization", async function () {
      const { factory, owner, ilpi } = await loadFixture(deployContractsFixture);

      // Primeiro autoriza
      await factory.connect(owner).authorizeILPI(ilpi.address);
      expect(await factory.isILPIAuthorized(ilpi.address)).to.be.true;

      // Depois revoga
      await expect(factory.connect(owner).revokeILPI(ilpi.address))
        .to.emit(factory, "ILPIRevoked")
        .withArgs(ilpi.address);

      expect(await factory.isILPIAuthorized(ilpi.address)).to.be.false;
    });

    it("Should revert ILPI management from non-owner", async function () {
      const { factory, ilpi, otherAccount } = await loadFixture(deployContractsFixture);

      await expect(factory.connect(otherAccount).authorizeILPI(ilpi.address))
        .to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");

      await expect(factory.connect(otherAccount).revokeILPI(ilpi.address))
        .to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });

    it("Should return false for unauthorized ILPIs", async function () {
      const { factory, ilpi } = await loadFixture(deployContractsFixture);

      expect(await factory.isILPIAuthorized(ilpi.address)).to.be.false;
    });
  });

  describe("Token Creation", function () {
    it("Should create token with correct parameters when ILPI is authorized", async function () {
      const { factory, oracle, owner, ilpi } = await loadFixture(deployContractsFixture);
      
      // Autorizar ILPI primeiro
      await factory.connect(owner).authorizeILPI(ilpi.address);

      // NOTA: Este teste pode falhar se o oracle não retornar rating suficiente
      // Você pode precisar configurar o oracle mock ou implementar métodos de teste

      const tokenName = "Test Token";
      const tokenSymbol = "TST";
      const ilpiName = "Test ILPI";
      const discountValue = ethers.parseEther("0.5");
      const totalDebtValue = ethers.parseEther("0.55");
      const dueDate = Math.floor(Date.now() / 1000) + 86400;

      await expect(factory.connect(ilpi).createRecebivel(
        tokenName,
        tokenSymbol,
        ilpiName,
        discountValue,
        totalDebtValue,
        dueDate
      )).to.emit(factory, "TokenCreated");

      const tokenInfo = await factory.tokens(0);
      expect(tokenInfo.tokenAddress).to.not.equal(ethers.ZeroAddress);
      expect(tokenInfo.ilpi).to.equal(ilpi.address);
      expect(tokenInfo.redeemed).to.be.false;
      expect(tokenInfo.investmentAmount).to.equal(0);
      
      expect(await factory.tokenIdCounter()).to.equal(1);

      // Verificar propriedades do token
      const tokenContract = await ethers.getContractAt("RecebivelToken", tokenInfo.tokenAddress);
      expect(await tokenContract.totalDebtValue()).to.equal(totalDebtValue);
    });

    it("Should revert token creation from unauthorized ILPI", async function () {
      const { factory, ilpi } = await loadFixture(deployContractsFixture);
      
      const tokenName = "Test Token";
      const tokenSymbol = "TST";
      const ilpiName = "Test ILPI";
      const discountValue = ethers.parseEther("0.5");
      const totalDebtValue = ethers.parseEther("0.55");
      const dueDate = Math.floor(Date.now() / 1000) + 86400;

      await expect(factory.connect(ilpi).createRecebivel(
        tokenName,
        tokenSymbol,
        ilpiName,
        discountValue,
        totalDebtValue,
        dueDate
      )).to.be.revertedWith("ILPI not authorized to create tokens");
    });

    it("Should revert if total debt is not greater than discount value", async function () {
      const { factory, owner, ilpi } = await loadFixture(deployContractsFixture);
      
      await factory.connect(owner).authorizeILPI(ilpi.address);

      const discountValue = ethers.parseEther("0.5");
      const totalDebtValue = ethers.parseEther("0.4"); // Menor que discount

      await expect(factory.connect(ilpi).createRecebivel(
        "Test Token",
        "TST",
        "Test ILPI",
        discountValue,
        totalDebtValue,
        Math.floor(Date.now() / 1000) + 86400
      )).to.be.revertedWith("Total debt must be greater than discount value");
    });

    it("Should create multiple tokens with incremental IDs", async function () {
      const { factory, owner, ilpi, otherAccount } = await loadFixture(deployContractsFixture);
      
      // Autorizar ambas as ILPIs
      await factory.connect(owner).authorizeILPI(ilpi.address);
      await factory.connect(owner).authorizeILPI(otherAccount.address);
      
      // Primeiro token
      await factory.connect(ilpi).createRecebivel(
        "Token 1", "TK1", "ILPI 1", 
        ethers.parseEther("0.1"),
        ethers.parseEther("0.11"),
        Math.floor(Date.now() / 1000) + 86400
      );
      
      // Segundo token
      await factory.connect(otherAccount).createRecebivel(
        "Token 2", "TK2", "ILPI 2", 
        ethers.parseEther("0.2"),
        ethers.parseEther("0.24"),
        Math.floor(Date.now() / 1000) + 172800
      );

      expect(await factory.tokenIdCounter()).to.equal(2);
      
      const token1Info = await factory.tokens(0);
      const token2Info = await factory.tokens(1);
      
      expect(token1Info.ilpi).to.equal(ilpi.address);
      expect(token2Info.ilpi).to.equal(otherAccount.address);
    });
  });

  describe("RecebivelToken Properties", function () {
    it("Should have correct token properties", async function () {
      const { tokenContract, tokenName, tokenSymbol, ilpiName, discountValue, totalDebtValue, dueDate } = 
        await loadFixture(deployWithTokenFixture);

      expect(await tokenContract.name()).to.equal(tokenName);
      expect(await tokenContract.symbol()).to.equal(tokenSymbol);
      expect(await tokenContract.ilpiName()).to.equal(ilpiName);
      expect(await tokenContract.discountValue()).to.equal(discountValue);
      expect(await tokenContract.totalDebtValue()).to.equal(totalDebtValue);
      expect(await tokenContract.dueDate()).to.equal(dueDate);
    });

    it("Should mint 1 token to factory", async function () {
      const { factory, tokenContract } = await loadFixture(deployWithTokenFixture);
      
      const factoryBalance = await tokenContract.balanceOf(factory.target);
      expect(factoryBalance).to.equal(ethers.parseEther("1"));
    });

    it("Should set ILPI as owner", async function () {
      const { tokenContract, ilpi } = await loadFixture(deployWithTokenFixture);
      
      expect(await tokenContract.owner()).to.equal(ilpi.address);
    });
  });

  describe("Token Purchase", function () {
    it("Should purchase token with correct payment", async function () {
      const { factory, tokenContract, ilpi, investor, discountValue } = 
        await loadFixture(deployWithTokenFixture);

      const ilpiBalanceBefore = await ethers.provider.getBalance(ilpi.address);

      await expect(factory.connect(investor).purchaseToken(0, { value: discountValue }))
        .to.emit(factory, "TokenPurchased")
        .withArgs(0, investor.address, discountValue);

      // Verifica se o token foi transferido
      const investorBalance = await tokenContract.balanceOf(investor.address);
      expect(investorBalance).to.equal(ethers.parseEther("1"));

      // Verifica se a ILPI recebeu o pagamento
      const ilpiBalanceAfter = await ethers.provider.getBalance(ilpi.address);
      expect(ilpiBalanceAfter - ilpiBalanceBefore).to.equal(discountValue);

      // Verifica se o investmentAmount foi registrado
      const tokenInfo = await factory.tokens(0);
      expect(tokenInfo.investmentAmount).to.equal(discountValue);
    });

    it("Should revert with incorrect payment amount", async function () {
      const { factory, investor, discountValue } = await loadFixture(deployWithTokenFixture);

      const wrongAmount = discountValue + ethers.parseEther("0.01");
      
      await expect(factory.connect(investor).purchaseToken(0, { value: wrongAmount }))
        .to.be.revertedWith("Incorrect payment amount");
    });

    it("Should revert purchase of already redeemed token", async function () {
      const { factory, investor, discountValue, owner, dueDate } = await loadFixture(deployWithTokenFixture);

      // Deposita ETH na factory para permitir resgates
      await factory.connect(owner).fundContract({ value: ethers.parseEther("2") });

      // Compra o token
      await factory.connect(investor).purchaseToken(0, { value: discountValue });
      
      // Avança o tempo e resgata o token (marca como redeemed)
      await time.increaseTo(dueDate + 1);
      await factory.connect(investor).redeemToken(0);
      
      // Tenta comprar novamente um token já resgatado
      await expect(factory.connect(investor).purchaseToken(0, { value: discountValue }))
        .to.be.revertedWith("Token already redeemed");
    });

    it("Should revert if token ID doesn't exist", async function () {
      const { factory, investor, discountValue } = await loadFixture(deployWithTokenFixture);

      await expect(factory.connect(investor).purchaseToken(999, { value: discountValue }))
        .to.be.reverted; // Token address seria 0x0
    });
  });

  describe("Token Redemption with Proportional Returns", function () {
    async function setupForRedemption() {
      const fixture = await loadFixture(deployWithTokenFixture);
      const { factory, investor, discountValue } = fixture;
      
      // Deposita ETH na factory para permitir resgates
      await factory.connect(fixture.owner).fundContract({ value: ethers.parseEther("2") });
      
      // Compra o token
      await factory.connect(investor).purchaseToken(0, { value: discountValue });
      
      return fixture;
    }

    it("Should redeem token with proportional return after due date", async function () {
      const { factory, investor, discountValue, totalDebtValue, dueDate } = await setupForRedemption();

      // Avança o tempo para após a data de vencimento
      await time.increaseTo(dueDate + 1);

      const investorBalanceBefore = await ethers.provider.getBalance(investor.address);

      const tx = await factory.connect(investor).redeemToken(0);
      const receipt = await tx.wait();

      // Calcula o payout esperado: (totalDebtValue * investmentAmount) / discountValue
      const expectedPayout = (totalDebtValue * discountValue) / discountValue; // = totalDebtValue
      
      // Verifica o evento emitido
      await expect(tx)
        .to.emit(factory, "TokenRedeemed")
        .withArgs(0, investor.address, expectedPayout);

      // Verifica se recebeu o valor proporcional
      const investorBalanceAfter = await ethers.provider.getBalance(investor.address);
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      expect(investorBalanceAfter - investorBalanceBefore + gasUsed)
        .to.be.closeTo(expectedPayout, ethers.parseEther("0.001"));

      // Verifica se foi marcado como resgatado
      const tokenInfo = await factory.tokens(0);
      expect(tokenInfo.redeemed).to.be.true;
    });

    it("Should calculate correct payout for different investment ratios", async function () {
      const { factory, oracle, owner, ilpi, investor, otherAccount } = await loadFixture(deployContractsFixture);
      
      // Autorizar ILPI
      await factory.connect(owner).authorizeILPI(ilpi.address);

      // Criar token com valores específicos para teste
      const discountValue = ethers.parseEther("100"); // 100 ETH de desconto
      const totalDebtValue = ethers.parseEther("120"); // 120 ETH valor total da dívida
      const dueDate = Math.floor(Date.now() / 1000) + 86400;

      await factory.connect(ilpi).createRecebivel(
        "Proportional Test",
        "PROP",
        "Test ILPI",
        discountValue,
        totalDebtValue,
        dueDate
      );

      // Depositar fundos suficientes
      await factory.connect(owner).fundContract({ value: ethers.parseEther("150") });

      // Investidor compra o token
      await factory.connect(investor).purchaseToken(0, { value: discountValue });

      // Avançar tempo e resgatar
      await time.increaseTo(dueDate + 1);

      const investorBalanceBefore = await ethers.provider.getBalance(investor.address);
      const tx = await factory.connect(investor).redeemToken(0);
      const receipt = await tx.wait();

      // Payout esperado: (120 * 100) / 100 = 120 ETH
      const expectedPayout = totalDebtValue;
      
      const investorBalanceAfter = await ethers.provider.getBalance(investor.address);
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      expect(investorBalanceAfter - investorBalanceBefore + gasUsed)
        .to.be.closeTo(expectedPayout, ethers.parseEther("0.001"));
    });

    it("Should revert redemption before due date", async function () {
      const { factory, investor } = await setupForRedemption();

      await expect(factory.connect(investor).redeemToken(0))
        .to.be.revertedWith("Token not due yet and not paid early");
    });

    it("Should revert double redemption", async function () {
      const { factory, investor, dueDate } = await setupForRedemption();

      // Avança o tempo e resgata
      await time.increaseTo(dueDate + 1);
      await factory.connect(investor).redeemToken(0);

      // Tenta resgatar novamente
      await expect(factory.connect(investor).redeemToken(0))
        .to.be.revertedWith("Already redeemed");
    });

    it("Should revert if factory has insufficient funds", async function () {
      const { factory, investor, discountValue, dueDate } = 
        await loadFixture(deployWithTokenFixture);

      // Compra sem depositar fundos suficientes na factory
      await factory.connect(investor).purchaseToken(0, { value: discountValue });
      
      // Avança o tempo
      await time.increaseTo(dueDate + 1);

      await expect(factory.connect(investor).redeemToken(0))
        .to.be.revertedWith("Redemption payment failed");
    });
  });

  describe("Contract Funding", function () {
    it("Should allow owner to fund contract", async function () {
      const { factory, owner } = await loadFixture(deployContractsFixture);

      const fundAmount = ethers.parseEther("5");
      
      await expect(factory.connect(owner).fundContract({ value: fundAmount }))
        .to.changeEtherBalance(factory, fundAmount);

      expect(await factory.getContractBalance()).to.equal(fundAmount);
    });

    it("Should revert funding from non-owner", async function () {
      const { factory, otherAccount } = await loadFixture(deployContractsFixture);

      await expect(factory.connect(otherAccount).fundContract({ value: ethers.parseEther("1") }))
        .to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });

    it("Should return correct contract balance", async function () {
      const { factory, owner } = await loadFixture(deployContractsFixture);

      expect(await factory.getContractBalance()).to.equal(0);

      await factory.connect(owner).fundContract({ value: ethers.parseEther("3") });
      expect(await factory.getContractBalance()).to.equal(ethers.parseEther("3"));
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should handle authorized ILPI with zero discount value", async function () {
      const { factory, owner, ilpi } = await loadFixture(deployContractsFixture);

      await factory.connect(owner).authorizeILPI(ilpi.address);

      await factory.connect(ilpi).createRecebivel(
        "Free Token", "FREE", "Free ILPI", 
        0, // Zero discount
        ethers.parseEther("0.1"), // Mas debt value > 0
        Math.floor(Date.now() / 1000) + 86400
      );

      const tokenInfo = await factory.tokens(0);
      const tokenContract = await ethers.getContractAt("RecebivelToken", tokenInfo.tokenAddress);
      
      expect(await tokenContract.discountValue()).to.equal(0);
    });})
  }
)