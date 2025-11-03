# Smart Contract Design - SkillChain NFT

## Structs

### Certificate
```rust
struct Certificate {
    token_id: U256,
    skill_name: String,      // "Rust Programming"
    level: u8,                // 1-4 (Beginner to Expert)
    issuer: Address,
    recipient: Address,
    issue_date: U256,         // timestamp
    metadata_uri: String,     // IPFS link
}
```

### Issuer
```rust
struct Issuer {
    issuer_address: Address,
    name: String,             // "MIT" or "John Doe"
    is_verified: bool,
    certificates_issued: U256,
    reputation_score: u8,     // 0-100
}
```

## Key Functions

### Admin Functions (only owner)
- `initialize(admin: Address)` - Initialize contract
- `add_verified_issuer(address: Address, name: String)` - Add new institution
- `remove_issuer(address: Address)` - Revoke issuer status
- `update_issuer_reputation(address: Address, score: u8)` - Update reputation

### Issuer Functions (only verified issuers)
- `issue_certificate(recipient, skill_name, level, metadata)` - Mint single NFT
- `batch_issue_certificates(recipients[], skill, level, metadata)` - Mint multiple

### View Functions (public)
- `get_certificate(tokenId)` - Retrieve certificate data
- `get_issuer_info(address)` - Check issuer stats
- `get_certificates_by_owner(address)` - All certs for a student
- `total_supply()` - Total certificates issued
- `balance_of(address)` - Number of certificates owned
- `owner_of(tokenId)` - Owner of specific certificate

## Events
- `CertificateIssued(tokenId, recipient, issuer, skill_name, level)`
- `IssuerAdded(address, name)`
- `IssuerRemoved(address)`
- `ReputationUpdated(issuer, new_score)`

## Security Considerations
- Only admin can add/remove issuers
- Only verified issuers can mint certificates
- Certificates are non-transferable (soul-bound NFTs)
- Level must be 1-4 (validated on-chain)