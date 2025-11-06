"use client";
import { Address } from "viem";

interface CertificateCardProps {
  tokenId: bigint;
  skillName: string;
  level: bigint;
  issuer: Address;
  recipient: Address;
  issueDate: bigint;
  issuerName?: string;
}

export const CertificateCard = ({
  tokenId,
  skillName,
  level,
  issuer,
  recipient,
  issueDate,
  issuerName,
}: CertificateCardProps) => {
  
  const getLevelBadge = (lvl: bigint) => {
    const levels = [
      { label: "🌱 Beginner", color: "badge-success" },
      { label: "📚 Intermediate", color: "badge-info" },
      { label: "🎯 Advanced", color: "badge-warning" },
      { label: "⭐ Expert", color: "badge-error" },
    ];
    return levels[Number(lvl) - 1] || levels[0];
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const levelInfo = getLevelBadge(level);

  return (
    <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-xl font-bold">
            🎓 {skillName}
          </h2>
          <div className={`badge ${levelInfo.color} badge-lg`}>
            {levelInfo.label}
          </div>
        </div>

        {/* Certificate Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-80">Token ID:</span>
            <span className="font-mono">#{tokenId.toString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="opacity-80">Issued by:</span>
            <span className="font-mono text-xs">
              {issuerName || `${issuer.slice(0, 6)}...${issuer.slice(-4)}`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="opacity-80">Recipient:</span>
            <span className="font-mono text-xs">
              {recipient.slice(0, 6)}...{recipient.slice(-4)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="opacity-80">Issue Date:</span>
            <span>{formatDate(issueDate)}</span>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="card-actions justify-end mt-4">
          <div className="badge badge-outline">✓ Verified On-Chain</div>
        </div>
      </div>
    </div>
  );
};