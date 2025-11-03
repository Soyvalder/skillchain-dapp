#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{StorageAddress, StorageU256, StorageString, StorageBool, StorageMap, StorageVec},
    msg, block,
};
use alloc::string::String;
use alloc::vec::Vec;

// ============================================
// STRUCTS - Estructuras de datos
// ============================================

/// Representa un certificado individual
#[storage]
pub struct Certificate {
    token_id: StorageU256,
    skill_name: StorageString,
    level: StorageU256,           // 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert
    issuer: StorageAddress,
    recipient: StorageAddress,
    issue_date: StorageU256,
    metadata_uri: StorageString,
}

/// Representa un emisor de certificados (institución o profesor)
#[storage]
pub struct Issuer {
    name: StorageString,
    is_verified: StorageBool,
    certificates_issued: StorageU256,
    reputation_score: StorageU256,  // 0-100
}

// ============================================
// CONTRATO PRINCIPAL
// ============================================

#[storage]
#[entrypoint]
pub struct SkillChainNFT {
    // Admin del contrato
    owner: StorageAddress,
    
    // Contadores NFT
    total_supply: StorageU256,
    next_token_id: StorageU256,
    
    // Mapeos (como diccionarios)
    certificates: StorageMap<U256, Certificate>,        // tokenId => Certificate
    issuers: StorageMap<Address, Issuer>,               // address => Issuer
    token_owners: StorageMap<U256, StorageAddress>,     // tokenId => owner
    owner_tokens: StorageMap<Address, StorageVec<StorageU256>>, // owner => tokenIds[]
    balances: StorageMap<Address, StorageU256>,         // address => balance
}

// ============================================
// IMPLEMENTACIÓN
// ============================================

#[public]
impl SkillChainNFT {
    
    /// Inicializa el contrato (solo se llama una vez)
    pub fn initialize(&mut self, admin: Address) -> Result<(), Vec<u8>> {
        // Verifica que no esté ya inicializado
        if self.owner.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        
        self.owner.set(admin);
        self.next_token_id.set(U256::from(1));
        self.total_supply.set(U256::from(0));
        Ok(())
    }
    
    /// Verifica que el caller sea el owner
    fn only_owner(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(b"Not authorized: only owner".to_vec());
        }
        Ok(())
    }
    
    /// Verifica que el caller sea un issuer verificado
    fn only_verified_issuer(&self) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        let issuer = self.issuers.get(caller);
        
        if !issuer.is_verified.get() {
            return Err(b"Not a verified issuer".to_vec());
        }
        Ok(())
    }
    
    // ============================================
    // FUNCIONES DE ADMIN
    // ============================================
    
    /// Añadir un emisor verificado (solo owner)
    pub fn add_verified_issuer(
        &mut self, 
        issuer_address: Address, 
        issuer_name: String
    ) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        
        // Crear el issuer
        let mut issuer = self.issuers.setter(issuer_address);
        issuer.name.set_str(&issuer_name);
        issuer.is_verified.set(true);
        issuer.certificates_issued.set(U256::from(0));
        issuer.reputation_score.set(U256::from(50)); // Comienza en 50/100
        
        Ok(())
    }
    
    /// Remover verificación de un issuer (solo owner)
    pub fn remove_issuer(&mut self, issuer_address: Address) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        
        let mut issuer = self.issuers.setter(issuer_address);
        issuer.is_verified.set(false);
        
        Ok(())
    }
    
    /// Actualizar reputación de issuer (solo owner)
    pub fn update_issuer_reputation(
        &mut self, 
        issuer_address: Address, 
        new_score: U256
    ) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        
        if new_score > U256::from(100) {
            return Err(b"Score must be 0-100".to_vec());
        }
        
        let mut issuer = self.issuers.setter(issuer_address);
        issuer.reputation_score.set(new_score);
        
        Ok(())
    }
    
    // ============================================
    // FUNCIONES DE LECTURA (VIEW)
    // ============================================
    
    /// Obtener información de un issuer
    pub fn get_issuer_info(&self, issuer_address: Address) -> (String, bool, U256, U256) {
        let issuer = self.issuers.get(issuer_address);
        
        (
            issuer.name.get_string(),
            issuer.is_verified.get(),
            issuer.certificates_issued.get(),
            issuer.reputation_score.get(),
        )
    }
    
    /// Total de certificados emitidos
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }
    
    /// Balance de certificados de un owner
    pub fn balance_of(&self, owner: Address) -> U256 {
        self.balances.get(owner)
    }
    
    /// Owner de un token específico
    pub fn owner_of(&self, token_id: U256) -> Address {
        self.token_owners.get(token_id).get()
    }
    
    /// Obtener el owner del contrato
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }
}