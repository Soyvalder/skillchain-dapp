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