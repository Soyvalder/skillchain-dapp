"use client";
import { useState } from "react";
import { Address } from "viem";

// Nota: requiere hooks de lectura/escritura. Adaptar a viem/wagmi.

export const IssuerManagement = () => {
  const [newIssuerAddress, setNewIssuerAddress] = useState("");
  const [newIssuerName, setNewIssuerName] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const writeContractAsync = async (_args: {
    functionName: string;
    args: [Address, string];
  }) => {
    throw new Error(
      "Hook de escritura no configurado. Integra viem/wagmi para habilitar."
    );
  };

  const readIssuerInfo = async (_address: Address) => {
    return null; // Implementar lectura con viem `readContract` si se integra.
  };

  const handleAddIssuer = async () => {
    if (!newIssuerAddress || !newIssuerName) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      await writeContractAsync({
        functionName: "add_verified_issuer",
        args: [newIssuerAddress as Address, newIssuerName],
      });

      alert("✅ Issuer added successfully!");
      setNewIssuerAddress("");
      setNewIssuerName("");
    } catch (error) {
      console.error("Error adding issuer:", error);
      alert("❌ Failed to add issuer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">🏛️ Issuer Management</h2>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Add Verified Issuer</h3>
          <div className="form-control gap-3">
            <input
              type="text"
              placeholder="Issuer Address (0x...)"
              className="input input-bordered"
              value={newIssuerAddress}
              onChange={(e) => setNewIssuerAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Institution Name"
              className="input input-bordered"
              value={newIssuerName}
              onChange={(e) => setNewIssuerName(e.target.value)}
            />
            <button
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              onClick={handleAddIssuer}
              disabled={isLoading}
            >
              Add Issuer
            </button>
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <h3 className="font-bold mb-2">Check Issuer Status</h3>
          <div className="form-control gap-3">
            <input
              type="text"
              placeholder="Check Address (0x...)"
              className="input input-bordered"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
            />

            {/* Implementar render con datos reales cuando se integre la lectura */}
          </div>
        </div>
      </div>
    </div>
  );
};