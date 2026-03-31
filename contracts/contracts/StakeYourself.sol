// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StakeYourself {
    enum Status { Pending, Active, Settled, Cancelled }

    struct Bet {
        address creator;
        address challenger;
        address verifier;
        uint256 stake;
        string metric;
        uint256 deadline;
        Status status;
        address winner;
    }

    mapping(uint256 => Bet) public bets;
    uint256 public betCount;

    event BetCreated(uint256 indexed betId, address creator, string metric, uint256 stake, uint256 deadline);
    event BetAccepted(uint256 indexed betId, address challenger);
    event BetSettled(uint256 indexed betId, address winner);
    event BetCancelled(uint256 indexed betId);

    function createBet(string calldata metric, uint256 deadline, address verifier) external payable returns (uint256) {
        require(msg.value > 0, "Must stake something");
        require(deadline > block.timestamp, "Deadline must be in the future");

        uint256 betId = betCount++;
        bets[betId] = Bet({
            creator: msg.sender,
            challenger: address(0),
            verifier: verifier,
            stake: msg.value,
            metric: metric,
            deadline: deadline,
            status: Status.Pending,
            winner: address(0)
        });

        emit BetCreated(betId, msg.sender, metric, msg.value, deadline);
        return betId;
    }

    function acceptBet(uint256 betId) external payable {
        Bet storage bet = bets[betId];
        require(bet.status == Status.Pending, "Bet not open");
        require(msg.value == bet.stake, "Must match the stake");
        require(msg.sender != bet.creator, "Cannot bet against yourself");

        bet.challenger = msg.sender;
        bet.status = Status.Active;

        emit BetAccepted(betId, msg.sender);
    }

    function settleBet(uint256 betId, address winner) external {
        Bet storage bet = bets[betId];
        require(bet.status == Status.Active, "Bet not active");
        require(msg.sender == bet.verifier, "Only verifier can settle");
        require(winner == bet.creator || winner == bet.challenger, "Invalid winner");

        bet.status = Status.Settled;
        bet.winner = winner;

        payable(winner).transfer(bet.stake * 2);
        emit BetSettled(betId, winner);
    }

    function cancelBet(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(bet.status == Status.Pending, "Can only cancel pending bets");
        require(msg.sender == bet.creator, "Only creator can cancel");

        bet.status = Status.Cancelled;
        payable(bet.creator).transfer(bet.stake);

        emit BetCancelled(betId);
    }

    function withdrawExpired(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(bet.status == Status.Active, "Bet not active");
        require(block.timestamp > bet.deadline, "Bet not expired yet");
        require(msg.sender == bet.creator || msg.sender == bet.challenger, "Not a participant");

        bet.status = Status.Cancelled;
        payable(bet.creator).transfer(bet.stake);
        payable(bet.challenger).transfer(bet.stake);
    }

    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
}