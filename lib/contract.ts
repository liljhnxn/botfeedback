import { type Address } from "viem";

export const BOT_FEEDBACK_ABI = [
  {
    type: "function",
    name: "submitFeedback",
    stateMutability: "nonpayable",
    inputs: [
      { name: "message", type: "string" },
      { name: "rating", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getFeedbackCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getFeedback",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [
      { name: "sender", type: "address" },
      { name: "message", type: "string" },
      { name: "rating", type: "uint8" },
      { name: "timestamp", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getAverageRating",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getAllFeedback",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "sender", type: "address" },
          { name: "message", type: "string" },
          { name: "rating", type: "uint8" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "MAX_MESSAGE_LENGTH",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "FeedbackSubmitted",
    inputs: [
      { name: "feedbackId", type: "uint256", indexed: true },
      { name: "sender", type: "address", indexed: true },
      { name: "rating", type: "uint8", indexed: false },
      { name: "message", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const rawContractAddress = process.env.NEXT_PUBLIC_BOT_FEEDBACK_ADDRESS?.trim();

export const BOT_FEEDBACK_ADDRESS: Address | undefined =
  rawContractAddress && /^0x[a-fA-F0-9]{40}$/.test(rawContractAddress)
    ? (rawContractAddress as Address)
    : undefined;

export const EXPLORER_BASE_URL = "https://scan.bohr.life";

export function getExplorerTxUrl(hash: string): string {
  return `${EXPLORER_BASE_URL}/tx/${hash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/address/${address}`;
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
