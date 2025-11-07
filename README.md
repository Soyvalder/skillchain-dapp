# 🎨 SkillChain - Decentralized Skill Certification Platform

## 🎯 Vision
A blockchain-based platform where educational institutions and professionals can issue verifiable skill certificates as NFTs, creating a permanent, tamper-proof record of achievements.

## 🏗️ Architecture

### Smart Contract Structure
```
SkillChainNFT (ERC721)
├── Roles
│   ├── Issuer (institutions/teachers)
│   └── Student (certificate holders)
├── Certificate Metadata
│   ├── Skill name
│   ├── Level (Beginner/Intermediate/Advanced/Expert)
│   ├── Issuer info
│   ├── Issue date
│   └── Description
└── Issuer Reputation System
    ├── Certificates issued
    ├── Verification count
    └── Trust score
```

### User Flows
1. **Institution Registration**: Apply to become verified issuer
2. **Issue Certificate**: Mint NFT certificate to student's wallet
3. **Student Portfolio**: View all earned certificates
4. **Employer Verification**: Check authenticity of certificates

## 📊 Data Models

### Certificate (NFT)
- tokenId: Unique identifier
- skillName: e.g., "Solidity Development"
- level: 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert
- issuer: Address of certifying entity
- recipient: Student's address
- issueDate: Timestamp
- metadata: IPFS link to detailed info

### Issuer
- address: Wallet address
- name: Institution name
- isVerified: Admin approval status
- certificatesIssued: Counter
- reputationScore: 0-100

## 🛠️ Tech Stack
- Stylus (Rust) — Smart contracts (WASM)
- ERC721-like (soul-bound) — NFT certificates
- Vite + React + TypeScript — Frontend UI
- Viem + Wagmi + RainbowKit — Wallet & RPC
- IPFS — Metadata storage (URIs)
- Arbitrum Sepolia — Testnet & Deployment

## 🎯 Objetivo del Challenge
- Elegir plantilla Scaffold-Stylus y mejorarla (contratos Rust + UI)
- Demostrar capacidades Stylus: contratos Rust, hooks reutilizables, playground
- Probar en Devnet/Sepolia y desplegar en Arbitrum Sepolia
- Desplegar frontend en Vercel
- Documentar: dirección del contrato y link de Vercel

## 📅 Avances
- [x] Arquitectura y setup base
- [x] Contrato Rust SkillChainNFT (emisión y lectura)
- [x] Playground de contrato (lectura/escritura genérica)
- [ ] Integración avanzada de UI (admin/issuer/usuario)
- [ ] Despliegue final en Vercel
- [ ] Documentación final con enlaces

## 🚀 Desarrollo Local

### Prerrequisitos
- `node >= 18.0.0`
- `rust >= 1.70.0`
- `cargo-stylus` y `cargo-stylus-check`
- Objetivo WASM: `rustup target add wasm32-unknown-unknown`

### Variables de entorno (frontend)
Crear `packages/frontend/.env` a partir de `packages/frontend/.env.example`:
```
VITE_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
# opcional para escritura con viem (DEV):
VITE_PRIVATE_KEY=0x...
# opcional: WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=YOUR_ID
```

### Iniciar
```bash
# Instalar dependencias del frontend
cd packages/frontend
npm install

# Servidor de desarrollo
npm run dev
```

Visita `http://localhost:5173`.

## 🔧 Contratos Stylus (Rust)
Ubicación: `contracts/`

Comandos clave:
```bash
# Exportar ABI (requiere feature export-abi)
cargo stylus export-abi --output ./abi.json --json --features export-abi

# Compilar a WASM
rustup target add wasm32-unknown-unknown
cargo build --release --target wasm32-unknown-unknown

# Verificación onchain (sin desplegar)
cargo stylus check --endpoint "https://sepolia-rollup.arbitrum.io/rpc" --verbose

# Despliegue a testnet (Arbitrum Sepolia)
cargo stylus deploy --private-key-path <PRIVKEY> --endpoint "https://sepolia-rollup.arbitrum.io/rpc"
```

Notas:
- El contrato `SkillChainNFT` implementa emisión de certificados, emisión en lote y lecturas.
- No hay funciones de transferencia (soul-bound por diseño).
- Estructuras: `Certificate`, `Issuer`; controles de acceso para admin y emisores verificados.

## 🌐 RPC y Red
- RPC público: `https://sepolia-rollup.arbitrum.io/rpc`
- Chain ID: `421614` (Arbitrum Sepolia)
- En `frontend`, el RPC se toma de `VITE_RPC_URL` con fallback al endpoint público.

## 📄 Dirección del Contrato y ABI
- Dirección desplegada (frontend `deployment.json`): `0xbb9c6128bf415341f074f1db2b7334c8e5d11c0a`
- ABI utilizado por el frontend: `packages/frontend/src/contracts/SkillChainNFT.json`

## 🧪 Playground del Contrato
- Página `ContractDashboard` incluye un playground que lista funciones del ABI y permite:
  - Lecturas con `publicClient` (Viem)
  - Escrituras si se define `VITE_PRIVATE_KEY` (solo DEV)

## 🚀 Despliegue en Vercel
Desde `packages/frontend`:
```bash
npm run build
npx vercel --prod
```
Incluye el `VITE_RPC_URL` en variables de entorno del proyecto en Vercel.

## 📝 Entregables del Challenge
- Repo público con al menos 5 commits en 3 días
- Contrato y frontend funcionando en Arbitrum Sepolia
- Link de Vercel publicado en este README
- Dirección del contrato y endpoint de verificación documentados

## 📝 License
MIT
<!--
# 🦀 Scaffold-Stylus

A blazing-fast, developer-friendly framework for building dapps on Arbitrum using Rust and WebAssembly.

⚡️ Built using Rust, Next.js, Tailwind CSS, and the Stylus SDK.

## ✨ Features

* 🦀 **Rust Smart Contracts**: Write your smart contracts in Rust and compile them to WebAssembly for superior performance and safety
* 🔄 **Cross-VM Debug Bridge**: Visualize and debug interactions between Solidity and Rust contracts
* 💻 **Interactive Contract Playground**: Test your contracts through an intuitive interface
* 📊 **Ink Usage Monitor**: Track and optimize your contract's resource consumption
* 🎯 **Contract Templates**: Quick-start your development with pre-built contract templates
* 🔍 **Transaction Monitor**: Real-time transaction tracking and status updates

## Prerequisites

Before you begin, ensure you have installed:
* Rust (latest stable)
* Node.js (>= v18)
* npm or yarn
* Git

## Quick Start

1. Create a new Scaffold-Stylus project:
```bash
npx create-scaffold-stylus my-stylus-app
cd my-stylus-app
```

2. Build the Rust contracts (in one terminal):
```bash
cd packages/contracts
cargo build --release
```

3. Start the frontend development server (in another terminal):
```bash
cd packages/frontend
npm run dev
```

Visit your app at: `http://localhost:5173`

## Project Structure

```
scaffold-stylus/
├── packages/
│   ├── contracts/        # Rust smart contracts
│   │   ├── src/
│   │   └── tests/
│   └── frontend/        # Next.js frontend
│       ├── src/
│       └── public/
```

## Development

### Smart Contracts

Your Rust smart contracts live in `packages/contracts/src/`. To modify:

1. Edit the contract code in `src/lib.rs`
2. Build your contracts:
```bash
cd packages/contracts
cargo build --release
```
3. Deploy to Arbitrum:
```bash
cargo run --bin deploy
```

### Frontend

The frontend is built with Next.js and lives in `packages/frontend/`. To modify:

1. Edit pages in `src/pages/`
2. Modify components in `src/components/`
3. Configure your app in `src/config/`

## Testing

Run contract tests:
```bash
cd packages/contracts
cargo test
```

Run frontend tests:
```bash
cd packages/frontend
npm test
```

## Documentation

For detailed documentation:
- [Smart Contract Development](docs/contracts.md)
- [Frontend Development](docs/frontend.md)
- [Deployment Guide](docs/deployment.md)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.