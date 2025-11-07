"use client";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useContractWrite, useWaitForTransaction } from "wagmi";
import contractABI from "../../contracts/SkillChainNFT.json";
import deploymentInfo from "../../contracts/deployment.json";

export const IssueCertificate = () => {
  const [recipient, setRecipient] = useState("");
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState("1");
  const [metadataUri, setMetadataUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const contractAddress = deploymentInfo.address as Address;
  const { writeAsync } = useContractWrite({
    address: contractAddress,
    abi: contractABI as any[],
    functionName: "issue_certificate",
  });

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed, isError: isFailed } = useWaitForTransaction({
    hash: txHash as `0x${string}` | undefined,
  });

  const handleIssue = async () => {
    if (!recipient || !skillName) {
      alert("Please fill all required fields");
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
        args: [
          recipient as Address,
          skillName,
          BigInt(level),
          metadataUri || `ipfs://default-${Date.now()}`,
        ],
      });
      setTxHash(hash as string);

      alert("✅ Certificate issued successfully!");

      setRecipient("");
      setSkillName("");
      setLevel("1");
      setMetadataUri("");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      const msg = (error as any)?.shortMessage || (error as any)?.message || "❌ Failed to issue certificate";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const levelOptions = [
    { value: "1", label: "🌱 Beginner", color: "badge-success" },
    { value: "2", label: "📚 Intermediate", color: "badge-info" },
    { value: "3", label: "🎯 Advanced", color: "badge-warning" },
    { value: "4", label: "⭐ Expert", color: "badge-error" },
  ];

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">🎓 Issue Certificate</h2>

        <div className="form-control gap-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Student Address</span>
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="input input-bordered w-full"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Skill Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Solidity Development"
              className="input input-bordered w-full"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Skill Level</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  className={`badge badge-lg ${
                    level === option.value ? option.color : "badge-ghost"
                  } cursor-pointer`}
                  onClick={() => setLevel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Metadata URI (optional)</span>
            </label>
            <input
              type="text"
              placeholder="ipfs://..."
              className="input input-bordered w-full"
              value={metadataUri}
              onChange={(e) => setMetadataUri(e.target.value)}
            />
          </div>

          <button
            className={`btn btn-primary ${isLoading ? "loading" : ""}`}
            onClick={handleIssue}
            disabled={isLoading}
          >
            {isLoading ? "Issuing..." : "🎖️ Issue Certificate"}
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
    </div>
  );
};