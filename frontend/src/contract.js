export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  "function createBet(string calldata metric, uint256 deadline, address verifier) external payable returns (uint256)",
  "function acceptBet(uint256 betId) external payable",
  "function settleBet(uint256 betId, address winner) external",
  "function cancelBet(uint256 betId) external",
  "function withdrawExpired(uint256 betId) external",
  "function getBet(uint256 betId) external view returns (tuple(address creator, address challenger, address verifier, uint256 stake, string metric, uint256 deadline, uint8 status, address winner))",
  "function betCount() external view returns (uint256)",
];
