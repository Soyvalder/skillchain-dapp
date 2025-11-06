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
#[solidity_storage]
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
#[solidity_storage]
pub struct Issuer {
    name: StorageString,
    is_verified: StorageBool,
    certificates_issued: StorageU256,
    reputation_score: StorageU256,  // 0-100
}

// ============================================
// CONTRATO PRINCIPAL
// ============================================

#[solidity_storage]
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

#[external]
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
        // StorageMap<U256, StorageAddress>::get returns Address directly
        self.token_owners.get(token_id)
    }
    
    /// Obtener el owner del contrato
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }

    // ============================================
    // FUNCIONES DE EMISOR
    // ============================================
    
    /// Emitir un certificado (solo issuers verificados)
    pub fn issue_certificate(
        &mut self,
        recipient: Address,
        skill_name: String,
        level: U256,
        metadata_uri: String,
    ) -> Result<U256, Vec<u8>> {
        self.only_verified_issuer()?;
        
        // Validar level (1-4)
        if level < U256::from(1) || level > U256::from(4) {
            return Err(b"Level must be 1-4".to_vec());
        }
        
        let caller = msg::sender();
        let token_id = self.next_token_id.get();
        let timestamp = U256::from(block::timestamp());
        
        // Crear certificado
        let mut cert = self.certificates.setter(token_id);
        cert.token_id.set(token_id);
        cert.skill_name.set_str(&skill_name);
        cert.level.set(level);
        cert.issuer.set(caller);
        cert.recipient.set(recipient);
        cert.issue_date.set(timestamp);
        cert.metadata_uri.set_str(&metadata_uri);
        
        // Actualizar ownership
        self.token_owners.setter(token_id).set(recipient);
        
        // Añadir a la lista de tokens del owner
        let mut owner_token_list = self.owner_tokens.setter(recipient);
        let mut new_token = owner_token_list.grow();
        new_token.set(token_id);
        
        // Actualizar balances
        let current_balance = self.balances.get(recipient);
        self.balances.setter(recipient).set(current_balance + U256::from(1));
        
        // Actualizar estadísticas del issuer
        let mut issuer = self.issuers.setter(caller);
        let issued = issuer.certificates_issued.get();
        issuer.certificates_issued.set(issued + U256::from(1));
        
        // Actualizar estado del contrato
        self.next_token_id.set(token_id + U256::from(1));
        self.total_supply.set(self.total_supply.get() + U256::from(1));
        
        Ok(token_id)
    }

    /// Emitir certificados por lote (solo issuers verificados)
    pub fn batch_issue_certificates(
        &mut self,
        recipients: Vec<Address>,
        skill_name: String,
        level: U256,
        metadata_uri: String,
    ) -> Result<Vec<U256>, Vec<u8>> {
        // Verifica permisos del emisor
        self.only_verified_issuer()?;

        let mut token_ids: Vec<U256> = Vec::new();

        for recipient in recipients {
            let token_id = self.issue_certificate(
                recipient,
                skill_name.clone(),
                level,
                metadata_uri.clone(),
            )?;
            token_ids.push(token_id);
        }

        Ok(token_ids)
    }
    
    /// Obtener datos de un certificado
    pub fn get_certificate(&self, token_id: U256) -> Result<(String, U256, Address, Address, U256, String), Vec<u8>> {
        let cert = self.certificates.get(token_id);
        
        // Verificar que existe
        if cert.recipient.get() == Address::ZERO {
            return Err(b"Certificate does not exist".to_vec());
        }
        
        Ok((
            cert.skill_name.get_string(),
            cert.level.get(),
            cert.issuer.get(),
            cert.recipient.get(),
            cert.issue_date.get(),
            cert.metadata_uri.get_string(),
        ))
    }
    
    /// Obtener todos los certificados de un owner
    pub fn get_certificates_by_owner(&self, owner: Address) -> Vec<U256> {
        let token_list = self.owner_tokens.get(owner);
        let mut tokens = Vec::new();
        
        for i in 0..token_list.len() {
            if let Some(token) = token_list.get(i) {
                // token_list.get(i) retorna el valor U256 directamente (no un accessor),
                // por lo que no se debe llamar .get() aquí.
                tokens.push(token);
            }
        }
        
        tokens
    }    
}