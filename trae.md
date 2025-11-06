# Memoria de Arquitectura — SkillChain DApp (Web3 + Stylus)

Esta memoria resume la arquitectura técnica del proyecto, con foco en la carpeta `contracts` y su papel dentro del sistema Web3. Sirve como referencia viva para el resto del desarrollo.

## Big Picture

- Capa On-chain (Arbitrum Stylus):
  - Contrato en Rust (`stylus-sdk`) desplegado en Arbitrum (Sepolia de testnet por ahora).
  - Compilado a `wasm32-unknown-unknown`; `cargo stylus check` valida activación onchain.
  - Almacenamiento orientado a certificados y emisores (NFT de tipo “soul-bound”).

- Capa Off-chain (Frontend/Web):
  - `packages/frontend` como UI (SPA), integra wallet (MetaMask u otros) y RPC público.
  - Consume el ABI del contrato y expone acciones para admin/issuer/usuarios.

- Tooling y DevOps:
  - `cargo-stylus` para `check`, `deploy`, `export-abi`.
  - Crates vendorizados en `contracts/vendor` y parches para compatibilidad (Windows `tiny-keccak`).
  - Flujo de build reproducible y verificación con endpoint público (`https://sepolia-rollup.arbitrum.io/rpc`).

## Contratos y Almacenamiento (contracts/src/lib.rs)

- `Certificate` (`#[solidity_storage]`):
  - `token_id: U256`
  - `skill_name: String`
  - `level: U256` (1-4)
  - `issuer: Address`
  - `recipient: Address`
  - `issue_date: U256` (timestamp de bloque)
  - `metadata_uri: String` (ej. IPFS)

- `Issuer` (`#[solidity_storage]`):
  - `name: String`
  - `is_verified: bool`
  - `certificates_issued: U256`
  - `reputation_score: U256` (0-100)

- `SkillChainNFT` (`#[solidity_storage]`, `#[entrypoint]`):
  - Campos de control: `owner`, `total_supply`, `next_token_id`.
  - Mapas:
    - `certificates: Map<U256, Certificate>`
    - `issuers: Map<Address, Issuer>`
    - `token_owners: Map<U256, Address>`
    - `owner_tokens: Map<Address, Vec<U256>>`
    - `balances: Map<Address, U256>`

## API del Contrato (#[external] impl)

- Inicialización y control:
  - `initialize(admin: Address)` — establece `owner`, `next_token_id`, `total_supply`.
  - `only_owner()` — verificación de acceso para funciones admin.
  - `only_verified_issuer()` — verificación de emisores.

- Administración (solo `owner`):
  - `add_verified_issuer(address, name)` — alta y verificación.
  - `remove_issuer(address)` — revoca verificación.
  - `update_issuer_reputation(address, score)` — actualiza reputación (0-100).

- Emisión (solo emisores verificados):
  - `issue_certificate(recipient, skill_name, level, metadata_uri) -> token_id`
    - Valida `level` 1–4.
    - Sella `issue_date` con `block::timestamp()`.
    - Actualiza ownership, balances y estadísticas del issuer.

- Lectura (view):
  - `get_issuer_info(address) -> (name, is_verified, issued, reputation)`
  - `total_supply() -> U256`
  - `balance_of(owner) -> U256`
  - `owner_of(token_id) -> Address`
  - `get_owner() -> Address`
  - `get_certificate(token_id) -> (skill_name, level, issuer, recipient, issue_date, metadata_uri)`
  - `get_certificates_by_owner(owner) -> Vec<U256>`

Notas:
- “Soul-bound” por omisión: no se implementan funciones de transferencia; los certificados no se transfieren.
- El diseño en `DESIGN.md` contempla eventos (emitir, alta issuer, etc.) — aún no existen en `lib.rs` y pueden añadirse como evolución.

## Seguridad y Acceso

- Acceso del caller: `msg::sender()`.
- Lectura de contexto de bloque: `block::timestamp()`.
- Controles:
  - Solo `owner` puede gestionar emisores y reputación.
  - Solo emisores verificados pueden emitir certificados.
  - Validación estricta de `level` dentro de 1–4.

## Integración Frontend / Web3

- ABI y llamadas:
  - Exportar ABI para el frontend: `cargo stylus export-abi --output ./abi.json --json`.
  - Si es necesario, habilitar la feature `export-abi` en el crate (`features = ["export-abi"]`).
  - Conectarse a RPC de Arbitrum Sepolia: `https://sepolia-rollup.arbitrum.io/rpc`.

- Flujos de UI esperados:
  - Admin: inicializa contrato, añade/revoca emisores, ajusta reputación.
  - Issuer: emite certificados (form con `recipient`, `skill_name`, `level`, `metadata_uri`).
  - Usuario: consulta certificados, su balance y detalles.

## Entorno, Build y Verificación

- Compilación a WASM:
  - `rustup target add wasm32-unknown-unknown`
  - `cargo build --release --target wasm32-unknown-unknown`

- Verificación onchain (sin desplegar):
  - `cargo stylus check --endpoint "https://sepolia-rollup.arbitrum.io/rpc" --verbose`
  - Requiere que la compilación sea válida y que el endpoint sea accesible.

- Despliegue (testnet):
  - `cargo stylus deploy --private-key-path=<PRIVKEY> --endpoint "https://sepolia-rollup.arbitrum.io/rpc"`

## Directorios Clave

- `contracts/`
  - `Cargo.toml`: dependencias y parches de crates vendorizados.
  - `src/lib.rs`: contrato principal `SkillChainNFT`.
  - `DESIGN.md`: intención de diseño, structs, funciones y eventos.
  - `vendor/`: conjunto de crates vendorizados (pines de versiones y compatibilidad, incluye `stylus-sdk-0.5.1` y `stylus-proc-0.5.2`).

- `packages/frontend/`: UI para interacción onchain.
- `stylus-template/` y `stylus-hello-world/`: ejemplos y scaffolds de referencia.

## Versionado y Compatibilidad

- `stylus-sdk = "=0.5.1"` (vendorizado) y `stylus-proc = 0.5.2` (vendorizado).
- `alloy-primitives = 0.7.7` con `tiny-keccak` (evita problemas de linkage en Windows).
- Parche en `Cargo.toml` para forzar uso de vendor y mantener coherencia de features.

## Riesgos y Próximos Pasos

- Eventos: implementar eventos en el contrato para trazabilidad (Issue/IssuerAdded/Removed/ReputationUpdated).
- Batch issuance: añadir emisión en lote si es necesaria.
- Revocación: mecanismo para invalidar/revocar certificados, si el modelo lo requiere.
- Indexación: considerar indexador (subgraph u otro servicio) para búsquedas avanzadas.
- Gas y tamaño: vigilar el tamaño brotli (<24KB) y costos; optimizar almacenamiento y strings.
- Frontend: integrar ABI, estados y flujos de firma de transacciones (admin/issuer/usuario).

## Comandos Reproducibles

- Verificación del contrato:
  - `cargo stylus check --endpoint "https://sepolia-rollup.arbitrum.io/rpc" --verbose`

- Compilación WASM:
  - `cargo build --release --target wasm32-unknown-unknown`

- Exportar ABI:
  - `cargo stylus export-abi --output ./abi.json --json`

- Despliegue a testnet:
  - `cargo stylus deploy --private-key-path=<PRIVKEY> --endpoint "https://sepolia-rollup.arbitrum.io/rpc"`