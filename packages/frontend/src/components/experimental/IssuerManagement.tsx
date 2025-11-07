"use client";
import { useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useContractWrite, useContractRead, useWaitForTransaction } from "wagmi";
import contractABI from "../../contracts/SkillChainNFT.json";
import deploymentInfo from "../../contracts/deployment.json";

export const IssuerManagement = () => {
  const [newIssuerAddress, setNewIssuerAddress] = useState("");
  const [newIssuerName, setNewIssuerName] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const contractAddress = deploymentInfo.address as Address;
  const { writeAsync } = useContractWrite({
    address: contractAddress,
    abi: contractABI as any[],
    functionName: "add_verified_issuer",
  });

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed, isError: isFailed } = useWaitForTransaction({
    hash: txHash as `0x${string}` | undefined,
  });

  const checkAddr = useMemo(() => (checkAddress ? (checkAddress as Address) : undefined), [checkAddress]);
  const { data: issuerInfo, refetch } = useContractRead({
    address: contractAddress,
    abi: contractABI as any[],
    functionName: "get_issuer_info",
    args: checkAddr ? [checkAddr] : undefined,
  });

  const handleAddIssuer = async () => {
    if (!newIssuerAddress || !newIssuerName) {
      alert("Please fill all fields");
      return;
    }

    setErrorMsg(undefined);

    if (!isConnected) {
      setErrorMsg("Wallet no conectada. Conecta tu wallet para firmar.");
      return;
    }
    if (chainId !== 421614) {
      setErrorMsg("Red incorrecta. Cambia a Arbitrum Sepolia (421614).");
      return;
    }

    setIsLoading(true);
    try {
      const hash = await writeAsync({
        args: [newIssuerAddress as Address, newIssuerName],
      });
      setTxHash(hash as string);
      alert("✅ Issuer added successfully!");
      setNewIssuerAddress("");
      setNewIssuerName("");
    } catch (error) {
      console.error("Error adding issuer:", error);
      const msg = (error as any)?.shortMessage || (error as any)?.message || "❌ Failed to add issuer";
      setErrorMsg(msg);
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

            {txHash && (
              <div className="mt-3 text-sm">
                <div>Tx Hash: <span className="font-mono break-all">{txHash}</span></div>
                <a className="link" href={`https://sepolia-explorer.arbitrum.io/tx/${txHash}`} target="_blank" rel="noreferrer">Ver en explorer</a>
                <div className="mt-2">Estado: {isConfirming ? "Confirmando..." : isConfirmed ? "Confirmada" : isFailed ? "Fallida" : "Pendiente"}</div>
                {receipt && (
                  <div className="mt-1">Bloque: {String(receipt.blockNumber ?? "-")}</div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 p-3 rounded bg-red-900/30 border border-red-700 text-red-200 text-sm">
                {errorMsg}
              </div>
            )}
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
            <button className="btn btn-secondary" onClick={() => refetch?.()}>Check</button>
            {issuerInfo && Array.isArray(issuerInfo) && (
              <div className="mt-3 p-3 rounded border border-gray-700">
                <div className="text-sm">Name: <span className="font-mono">{String(issuerInfo[0])}</span></div>
                <div className="text-sm">Verified: <span className="font-mono">{String(issuerInfo[1])}</span></div>
                <div className="text-sm">Certificates Issued: <span className="font-mono">{String(issuerInfo[2])}</span></div>
                <div className="text-sm">Reputation Score: <span className="font-mono">{String(issuerInfo[3])}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};