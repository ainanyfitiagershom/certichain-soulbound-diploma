// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiplomaSoulbound is ERC721, Ownable {
    struct Diploma {
        string studentName;
        string diplomaName;
        string year;
        string mention;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(uint256 => Diploma) private diplomas;

    uint256 private nextTokenId;

    event DiplomaIssued(
        uint256 indexed tokenId,
        address indexed student
    );

    event DiplomaRevoked(
        uint256 indexed tokenId
    );

    constructor() ERC721("CertiChainDiploma", "CCD") Ownable(msg.sender) {
        nextTokenId = 1;
    }
}