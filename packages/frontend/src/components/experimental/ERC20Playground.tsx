"use client";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import erc20ABI from "../../contracts/ERC20.json";
import erc20Deployment from "../../contracts/erc20.deployment.json";

const formatUnits = (value?: bigint, decimals?: number) => {
  if (value === undefined || decimals === undefined) return "-";
  const s = value.toString();
  if (decimals === 0) return s;
  const pad = decimals - s.length + 1;
  const whole = pad > 0 ? "0" : s.slice(0, -decimals);
  const fraction = pad > 0 ? "0".repeat(pad) + s : s.slice(-decimals);
  return `${whole}.${fraction}`.replace(/\.?0+$/, "");
};

export const ERC20Playground = () => {
  const [contractAddrInput, setContractAddrInput] = useState<string>(erc20Deployment.address || "");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [spender, setSpender] = useState<string>("");
  const [approveAmount, setApproveAmount] = useState<string>("0");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  const addressMemo = useMemo(() => (contractAddrInput ? (contractAddrInput as Address) : undefined), [contractAddrInput]);

  const { data: name } = useContractRead({
    address: addressMemo,
    abi: erc20ABI as any[],
    functionName: "name",
    enabled: !!addressMemo,
  });
  const { data: symbol } = useContractRead({
    address: addressMemo,
    abi: erc20ABI as any[],
    functionName: "symbol",
    enabled: !!addressMemo,
  });
  const { data: decimals } = useContractRead({
    address: addressMemo,
    abi: erc20ABI as any[],
    functionName: "decimals",
    enabled: !!addressMemo,
  });
  const { data: totalSupply } = useContractRead({
    address: addressMemo,
    abi: erc20ABI as any[],
    functionName: "totalSupply",
    enabled: !!addressMemo,
  });
  const { data: myBalance } = useContractRead({
    address: addressMemo,
    abi: erc20ABI as any[],
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!addressMemo && !!address,
  });
  const { data: allowance } = useContractRead({
    address: addressMemo,
    abi: erc20ABI as any[],
    functionName: "allowance",
    args: address && spender ? [address, spender as Address] : undefined,
    enabled: !!addressMemo && !!address && !!spender,
  });

  const transferWrite = useContractWrite({ address: addressMemo, abi: erc20ABI as any[], functionName: "transfer" });
  const approveWrite = useContractWrite({ address: addressMemo, abi: erc20ABI as any[], functionName: "approve" });
  const waitTx = useWaitForTransaction({ hash: txHash as `0x${string}` | undefined });

  useEffect(() => {
    // reset tx state when changing contract address
    setTxHash(undefined);
    setErrorMsg(undefined);
  }, [contractAddrInput]);

  const handleTransfer = async () => {
    setErrorMsg(undefined);
    if (!isConnected) return setErrorMsg("Wallet no conectada.");
    if (chainId !== 421614) return setErrorMsg("Red incorrecta. Usa Arbitrum Sepolia (421614).");
    if (!addressMemo) return setErrorMsg("Configura el address del contrato ERC-20.");
    if (!to || !amount) return setErrorMsg("Completa 'to' y 'amount'.");
    try {
      const value = BigInt(amount);
      const hash = await transferWrite.writeAsync({ args: [to as Address, value] });
      setTxHash(hash as string);
    } catch (e: any) {
      setErrorMsg(e?.shortMessage || e?.message || "Error en transfer");
    }
  };

  const handleApprove = async () => {
    setErrorMsg(undefined);
    if (!isConnected) return setErrorMsg("Wallet no conectada.");
    if (chainId !== 421614) return setErrorMsg("Red incorrecta. Usa Arbitrum Sepolia (421614).");
    if (!addressMemo) return setErrorMsg("Configura el address del contrato ERC-20.");
    if (!spender || !approveAmount) return setErrorMsg("Completa 'spender' y 'amount'.");
    try {
      const value = BigInt(approveAmount);
      const hash = await approveWrite.writeAsync({ args: [spender as Address, value] });
      setTxHash(hash as string);
    } catch (e: any) {
      setErrorMsg(e?.shortMessage || e?.message || "Error en approve");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">🪙 ERC-20 Playground (Rust Stylus)</h2>
        <div className="form-control gap-3 mb-4">
          <input
            type="text"
            placeholder="ERC-20 Address (0x...)"
            className="input input-bordered"
            value={contractAddrInput}
            onChange={(e) => setContractAddrInput(e.target.value)}
          />
          <div className="text-sm text-gray-400">Chain: Arbitrum Sepolia (421614)</div>
        </div>

        {addressMemo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-3 rounded border border-gray-700">
              <div className="text-sm">Name: <span className="font-mono">{String(name ?? "-")}</span></div>
              <div className="text-sm">Symbol: <span className="font-mono">{String(symbol ?? "-")}</span></div>
              <div className="text-sm">Decimals: <span className="font-mono">{String(decimals ?? "-")}</span></div>
              <div className="text-sm">Total Supply: <span className="font-mono">{formatUnits(totalSupply as bigint | undefined, Number(decimals ?? 18))}</span></div>
              <div className="text-sm">Mi balance: <span className="font-mono">{formatUnits(myBalance as bigint | undefined, Number(decimals ?? 18))}</span></div>
            </div>

            <div className="p-3 rounded border border-gray-700">
              <div className="text-sm">Allowance (spender): <span className="font-mono">{formatUnits(allowance as bigint | undefined, Number(decimals ?? 18))}</span></div>
            </div>
          </div>
        ) : (
          <div className="mb-4 text-warning">Configura el address del contrato para consultar datos.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">Transfer</h3>
            <div className="form-control gap-3">
              <input type="text" className="input input-bordered" placeholder="To (0x...)" value={to} onChange={(e) => setTo(e.target.value)} />
              <input type="text" className="input input-bordered" placeholder="Amount (wei)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <button className="btn btn-primary" onClick={handleTransfer}>Enviar</button>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Approve</h3>
            <div className="form-control gap-3">
              <input type="text" className="input input-bordered" placeholder="Spender (0x...)" value={spender} onChange={(e) => setSpender(e.target.value)} />
              <input type="text" className="input input-bordered" placeholder="Amount (wei)" value={approveAmount} onChange={(e) => setApproveAmount(e.target.value)} />
              <button className="btn btn-secondary" onClick={handleApprove}>Aprobar</button>
            </div>
          </div>
        </div>

        {txHash && (
          <div className="mt-3 text-sm">
            <div>Tx Hash: <span className="font-mono break-all">{txHash}</span></div>
            <a className="link" href={`https://sepolia-explorer.arbitrum.io/tx/${txHash}`} target="_blank" rel="noreferrer">Ver en explorer</a>
            <div className="mt-2">Estado: {waitTx.isLoading ? "Confirmando..." : waitTx.isSuccess ? "Confirmada" : waitTx.isError ? "Fallida" : "Pendiente"}</div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded bg-red-900/30 border border-red-700 text-red-200 text-sm">{errorMsg}</div>
        )}
      </div>
    </div>
  );
};

export default ERC20Playground;