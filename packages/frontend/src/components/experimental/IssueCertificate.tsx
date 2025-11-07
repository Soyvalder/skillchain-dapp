"use client";
import { useState } from "react";
import { Address } from "viem";

// Nota: este componente es experimental y requiere hooks de Scaffold-Stylus.
// Adaptar a viem/wagmi si se desea usar en producción.

export const IssueCertificate = () => {
  const [recipient, setRecipient] = useState("");
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState("1");
  const [metadataUri, setMetadataUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const writeContractAsync = async (_args: {
    functionName: string;
    args: [Address, string, bigint, string];
  }) => {
    throw new Error(
      "Hook de escritura no configurado. Integra viem/wagmi para habilitar."
    );
  };

  const handleIssue = async () => {
    if (!recipient || !skillName) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await writeContractAsync({
        functionName: "issue_certificate",
        args: [
          recipient as Address,
          skillName,
          BigInt(level),
          metadataUri || `ipfs://default-${Date.now()}`,
        ],
      });

      alert("✅ Certificate issued successfully!");

      setRecipient("");
      setSkillName("");
      setLevel("1");
      setMetadataUri("");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      alert("❌ Failed to issue certificate");
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
        </div>
      </div>
    </div>
  );
};