# SeniorFi: We connect investors with institutions that care for lives

> _TEAM SeniorFi: HackaNation

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-BNBChain-orange)

---

### 🌐 Introduction

ILPIs (Long-Term Care Institutions for the Elderly) take care of those who need it most, but they face a silent crisis: lack of liquidity. They rely on future monthly payments, have no access to credit, and often delay salaries and essential supplies.

Our solution turns these receivables into tokens via blockchain, allowing ILPIs to securely access upfront capital. Investors acquire impact-backed assets, guided by an AI that assesses the risk of each operation.

---

### BNB Chain

Our platform is built on the BNB Chain, a scalable, secure blockchain with low transaction fees. Choosing BNB Chain allows us to provide an accessible and efficient infrastructure—ideal for democratizing credit access for long-term care institutions and attracting investors worldwide.

With its wide adoption and smart contract compatibility, BNB Chain ensures speed, transparency, and trust at every stage of receivables tokenization.

--- 

<details>
<summary>🌟 Features</summary>

### 🔹 Receivables Tokenization  
Long-term care institutions (ILPIs) register their future receivables on the platform, which are converted into tradable tokens on the blockchain.

### 🔹 Investment Marketplace  
Investors access a curated marketplace of receivable-backed tokens, evaluating opportunities based on risk and expected returns.

### 🔹 AI-Powered Risk Scoring  
A proprietary AI model analyzes each receivable and assigns a risk score (low, medium, or high), based on factors such as the ILPI’s history, guarantees, and payment terms.

### 🔹 Generative AI Interpretation  
After the score is calculated, a second AI layer generates clear, human-readable explanations of each token's strengths and risks to guide investor decisions.

### 🔹 Powered by BNB Chain  
All operations are transparently, immutably, and automatically recorded via smart contracts on the BNB Chain, ensuring trust and scalability.

</details>

---

## 🛠 Installation (Front-end)

1. **Pre-requisites**
    - Make sure you have NodeJS installed on your machine.

2. **Clone the Repository**

    ```bash
    git clone https://github.com/bellujrb/senior-fi/front-end
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

4. **Run the App**

    ```bash
    npm run dev
    ```

---

## 📂 Project File Tree
    
```
senior-fi
├── front-end
│   └── ...
├── blockchain
│   └── ...
├── README.MD
│   └── ...
```
---

#### `hackathon-lumx`

- `front-end`
    - Frontend Application
- `blockchain`
    - Blockchain Application: Our solution is built on the **BNB Chain**, a high-performance blockchain known for its scalability, low transaction fees, and wide adoption. By leveraging BNB Chain, we ensure fast, transparent, and cost-effective tokenization of receivables. All transactions — from token issuance to settlement — are executed via smart contracts, providing a secure and decentralized infrastructure without relying on banks or intermediaries.

- `README.md`
    - Documentation Project

---

## 🛠 Tech Stack Web

### Design Patterns
- Component Pattern (clear separation of responsibilities)  
- Provider Pattern (`theme-provider.tsx`)  
- Modal Pattern (modais)  
- Layout Pattern (`layout.tsx` Next.js)  

### External Packages 
- **UI:** `@radix-ui/*`, `framer-motion`, `lucide-react`, `tailwindcss`, `clsx`, `class-variance-authority`  
- **Forms:** `react-hook-form`, `@hookform/resolvers`, `zod`  
- **Tema:** `next-themes`  
- **Notificações:** `sonner`  
- **Core:** `next`, `react`, `react-dom`, `typescript`

### Architecture 
- Next.js 13+ with App Router  
- Component-based framework: `/app`, `/components`, `/lib`, `/hooks`  

---

## 🌈 Future Roadmap

Our roadmap includes implementing an oracle that connects the blockchain to real-world data, validating in real-time the legitimacy of receivables based on:

- Financial systems of ILPIs  
- Registered invoices  
- Proof of relationship with family members/payers  
- Institution’s payment history  

---

## 🙏 Acknowledgments

Special thanks to Token Nation and BNB Chain for this ambitious opportunity.

---
