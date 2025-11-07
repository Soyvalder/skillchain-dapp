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
- RPC público: `https://rpc.ankr.com/arbitrum_sepolia` (fallback en frontend)
- Chain ID: `421614` (Arbitrum Sepolia)
- En `frontend`, el RPC se toma de `VITE_RPC_URL` con fallback al endpoint público.

## 📄 Direcciones de Contrato y ABI
- ERC-20 Stylus desplegado: `0x0eb0196d3e847fe19c6bbe860cc3567d8fdc00e9`
  - Tx deploy: `0x1c25d32f97f5affa715f5d50a50379ffcd333de788c7fa25511b21542acfc481`
  - Tx activación: `0xf522a846b1b0880c68c4ab8060899a171a970e121450abb8633da6de065bdf10`
  - Cache bid: `0xfe58ad28163354690ebe29f600a10d8296bb96a9a8460ae214c59aa2141b1c8b`
- ABI ERC-20: `packages/frontend/src/contracts/ERC20.json`
- Address usado por el playground: `packages/frontend/src/contracts/erc20.deployment.json`

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

Ejemplo variables en Vercel:
```
VITE_RPC_URL=https://rpc.ankr.com/arbitrum_sepolia
VITE_WALLETCONNECT_PROJECT_ID=<tu_id>
```

Link de producción: [pendiente]

## 🔄 Inicialización ERC-20 (post-deploy)
Script de ayuda: `packages/frontend/scripts/init-erc20.js`

Uso (PowerShell):
```
cd packages/frontend
setx RPC_URL "https://rpc.ankr.com/arbitrum_sepolia"
$env:RPC_URL="https://rpc.ankr.com/arbitrum_sepolia"
$env:PRIVATE_KEY="0x<tu_private_key>"
node scripts/init-erc20.js "SkillToken" "SKL" 18 1
```
Esto ejecuta `initialize(name, symbol, decimals, initial_supply, owner)` y asigna el supply inicial al owner.

## ✅ Checklist del Challenge (Objetivo)
- [x] Plantilla Scaffold-Stylus seleccionada y mejorada (contratos Rust + UI)
- [x] Contrato ERC-20 Stylus verificado y desplegado en Arbitrum Sepolia
- [x] Frontend con playground ERC-20 funcionando en Dev
- [x] Cache bid ejecutado para abaratar llamadas
- [ ] Inicialización ERC-20 ejecutada y verificada onchain (pendiente de `PRIVATE_KEY`)
- [ ] Repo público en GitHub con ≥5 commits en ≥3 días (pendiente publicar)
- [ ] Frontend desplegado en Vercel y documentado (pendiente publicar)

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
# SkillChain DApp – Scaffold Stylus

Este proyecto demuestra integración de contratos Stylus en Rust con una dApp React (Vite) y `wagmi/RainbowKit`, incluyendo gestión de emisores y certificados (NFT-like) y ahora un Playground ERC‑20.

## Checklist de requisitos

- [x] Plantilla inicial `skillchain-dapp` basada en Scaffold Stylus.
- [ ] Elegida plantilla ERC‑20: dApp que usa contratos ERC‑20 en Rust Stylus.
- [x] Mejoras de interfaz de usuario: integración de `wagmi` con firma de wallet y feedback de transacciones.
- [x] Demostración de capacidades de Scaffold Stylus: contrato Stylus (Rust) activo y reutilización de hooks/componentes.
- [ ] Pruebas en Devnet o Sepolia; despliegue en Arbitrum Sepolia.
- [ ] Despliegue completo en Vercel (`yarn vercel`).
- [ ] Documentación del enfoque (este README).
- [ ] Dirección del contrato desplegado y enlace de Vercel visibles.

## Cómo validar cada punto

1) Plantilla inicial
- Estructura monorepo con `packages/frontend` y `contracts`. Ejecuta `npm run frontend:dev` o `cd packages/frontend && npm run dev`.

2) DApp ERC‑20 en Rust
- Opciones:
  - Implementar un contrato ERC‑20 en `contracts/src/lib.rs` (Stylus Rust) o añadir una crate separada.
  - Exportar ABI: `npm run contracts:abi`.
  - Desplegar a Arbitrum Sepolia (guía abajo) y copiar el address en `packages/frontend/src/contracts/erc20.deployment.json`.
- Frontend listo: usa el nuevo `ERC-20 Playground` en el Dashboard, pegando el address del contrato y probando `balanceOf`, `transfer`, `approve`.

3) Mejoras de UI / Contratos
- UI: componentes `IssuerManagement`, `IssueCertificate` y `ERC20Playground` con validación de red (421614) y feedback (hash/estado/enlace explorer).
- Contratos: `contracts/src/lib.rs` contiene el contrato Stylus para certificados (NFT-like).

4) Demostración Scaffold Stylus
- Contratos en Rust (Stylus) y hooks `wagmi` reutilizados (`useContractRead`, `useContractWrite`, `useWaitForTransaction`).

5) Pruebas y despliegue en Arbitrum Sepolia
- Prueba local con Sepolia/Arbitrum Sepolia en tu wallet.
- Despliegue Stylus (resumen genérico):
  - `cd contracts`
  - `cargo stylus build` (o `cargo build --features export-abi` para ABI)
  - Usa la CLI de Arbitrum Stylus para `deploy` en cadena 421614 (ver docs oficiales de Stylus/Arbitrum). Guarda el `address`.
  - Actualiza `packages/frontend/src/contracts/erc20.deployment.json` con el `address`.

6) Despliegue en Vercel
- Comandos agregados: `yarn vercel` y `yarn vercel:prod` ejecutan Vercel desde `packages/frontend`.
- Requisitos: tener `vercel` CLI autenticado (`npx vercel login`).

7) Documentación
- Este README resume el enfoque y pasos de validación.

8) Dirección de contrato y enlace Vercel
- Añade aquí tras el despliegue:
  - Address contrato ERC‑20 (Arbitrum Sepolia): `0x...`
  - URL Vercel: `https://<tu-proyecto>.vercel.app/`

## Uso en la dApp

- Conecta tu wallet a Arbitrum Sepolia (421614) desde el header.
- Dashboard:
  - Contract Playground: pruebas varias del contrato actual.
  - Issuers & Certificates: añadir emisores (owner-only), consultar issuer info, emitir certificados (issuer verificado).
  - ERC‑20 Playground: consulta `name/symbol/decimals/supply/balance`, ejecuta `transfer` y `approve`.

## Notas

- Si `Add Issuer` falla, probablemente no eres admin (owner) del contrato; cambia a la cuenta owner o llama `initialize` con ese admin.
- Para ERC‑20 en Rust, puedes partir de implementaciones públicas de Stylus o adaptar una mínima (almacenando `balances`, `allowances` y eventos `Transfer/Approval`).