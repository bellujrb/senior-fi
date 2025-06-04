"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xC95c247A1c0B28f342Cf532B0fD50Cbf9FbCABb1';
const ABI =[{"inputs":[{"internalType":"address","name":"_oracle","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ilpi","type":"address"}],"name":"ILPIAuthorized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ilpi","type":"address"}],"name":"ILPIRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newOracle","type":"address"}],"name":"OracleUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"ilpi","type":"address"},{"indexed":false,"internalType":"uint8","name":"ilpiRating","type":"uint8"}],"name":"TokenCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbPrice","type":"uint256"}],"name":"TokenPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"TokenRedeemed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"TokenRedeemedEarly","type":"event"},{"inputs":[{"internalType":"address","name":"ilpi","type":"address"}],"name":"authorizeILPI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorizedILPIs","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseRiskRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"originalDiscount","type":"uint256"},{"internalType":"address","name":"ilpi","type":"address"}],"name":"calculateAdjustedDiscount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"canRedeem","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"ilpiName","type":"string"},{"internalType":"uint256","name":"discountValue","type":"uint256"},{"internalType":"uint256","name":"totalDebtValue","type":"uint256"},{"internalType":"uint256","name":"dueDate","type":"uint256"}],"name":"createRecebivel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"fundContract","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getTokenInfoWithOracle","outputs":[{"components":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"ilpi","type":"address"},{"internalType":"bool","name":"redeemed","type":"bool"},{"internalType":"uint256","name":"investmentAmount","type":"uint256"},{"internalType":"uint256","name":"creationTimestamp","type":"uint256"},{"internalType":"uint8","name":"ilpiRatingAtCreation","type":"uint8"}],"internalType":"struct RecebivelFactory.TokenInfo","name":"info","type":"tuple"},{"internalType":"uint8","name":"currentILPIRating","type":"uint8"},{"internalType":"bool","name":"isPaidInRealWorld","type":"bool"},{"internalType":"uint256","name":"currentBNBPrice","type":"uint256"},{"internalType":"uint256","name":"marketRate","type":"uint256"},{"internalType":"bool","name":"canRedeem_","type":"bool"},{"internalType":"string","name":"redeemReason","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ilpi","type":"address"}],"name":"isILPIAuthorized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract IRecebivelOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"purchaseToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"redeemToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"ilpi","type":"address"}],"name":"revokeILPI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rate","type":"uint256"}],"name":"setBaseRiskRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_oracle","type":"address"}],"name":"setOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenIdCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokens","outputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"ilpi","type":"address"},{"internalType":"bool","name":"redeemed","type":"bool"},{"internalType":"uint256","name":"investmentAmount","type":"uint256"},{"internalType":"uint256","name":"creationTimestamp","type":"uint256"},{"internalType":"uint8","name":"ilpiRatingAtCreation","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const ORACLE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ilpi","type":"address"},{"indexed":false,"internalType":"uint8","name":"rating","type":"uint8"}],"name":"ILPIRatingUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"InflationRateUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"MarketRateUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oracle","type":"address"}],"name":"OracleAuthorized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oracle","type":"address"}],"name":"OracleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"PriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isPaid","type":"bool"}],"name":"RecebivelStatusUpdated","type":"event"},{"inputs":[{"internalType":"address","name":"oracle","type":"address"}],"name":"authorizeOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorizedOracles","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bnbPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"isValid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBNBPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDataFreshness","outputs":[{"internalType":"uint256","name":"priceAge","type":"uint256"},{"internalType":"uint256","name":"marketRateAge","type":"uint256"},{"internalType":"uint256","name":"inflationAge","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ilpi","type":"address"}],"name":"getILPIRating","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getInflationRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarketInterestRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ilpiRatings","outputs":[{"internalType":"uint8","name":"rating","type":"uint8"},{"internalType":"uint256","name":"lastUpdated","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"inflationLastUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"inflationRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPriceDataFresh","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isRecebivelPaid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"markRecebivelAsPaid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"marketInterestRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketRateLastUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"recebivelStatus","outputs":[{"internalType":"bool","name":"isPaid","type":"bool"},{"internalType":"uint256","name":"paidDate","type":"uint256"},{"internalType":"uint256","name":"lastChecked","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"oracle","type":"address"}],"name":"revokeOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateBNBPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"ilpi","type":"address"},{"internalType":"uint8","name":"rating","type":"uint8"}],"name":"updateILPIRating","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"updateInflationRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"name":"updateMarketInterestRate","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const ORACLE_ADDRESS="0x2ea66896A9fA67eEeFc062967428654189799595";

export default function CreateRecebivel() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [ilpiName, setIlpiName] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [totalDebtValue, setTotalDebtValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  

  const createToken = async () => {
    if (!window.ethereum) {
      alert("Metamask não detectado");
      return;
    }

    try {
      setStatus("Conectando à carteira...");
      if (!window.ethereum) {
        throw new Error("MetaMask não encontrada");
      }
      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const signer = await provider.getSigner();

      // Update oracle rating
      const mainContract = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, signer);
      const oracleAddress = await mainContract.oracle();
      const oracleContract = new ethers.Contract(oracleAddress, ORACLE_ABI, signer);
      await oracleContract.updateILPIRating("0xB4A2dF10f6308f2040d727539Fc9D436686c3F91", 7);

      setStatus("Criando token...");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const discountWei = ethers.parseEther(discountValue);
      const totalDebtWei = ethers.parseEther(totalDebtValue);
      const dueTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);

      setStatus("Enviando transação...");

      const tx = await contract.createRecebivel(
        name,
        symbol,
        ilpiName,
        discountWei,
        totalDebtWei,
        dueTimestamp
      );

      await tx.wait();
      setStatus("Token criado com sucesso! Tx: " + tx.hash);
    } catch (err: any) {
      console.error(err);
      setStatus("Erro: " + (err?.data?.message || err?.message));
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Criar Token de Recebível</h2>

      <input
        type="text"
        placeholder="Nome do Token"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="text"
        placeholder="Símbolo"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="text"
        placeholder="Nome da ILPI"
        value={ilpiName}
        onChange={(e) => setIlpiName(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="text"
        placeholder="Valor com desconto (em BNB)"
        value={discountValue}
        onChange={(e) => setDiscountValue(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="text"
        placeholder="Valor da dívida (em BNB)"
        value={totalDebtValue}
        onChange={(e) => setTotalDebtValue(e.target.value)}
        className="w-full p-2 border mb-2"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 border mb-4"
      />

      <button
        onClick={createToken}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Criar Token
      </button>

      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </div>
  );
}
