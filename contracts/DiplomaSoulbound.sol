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

    event DiplomaIssued(uint256 indexed tokenId, address indexed student);
    event DiplomaRevoked(uint256 indexed tokenId);

    constructor() ERC721("CertiChainDiploma", "CCD") Ownable(msg.sender) {
        nextTokenId = 1;
    }

    function issueDiploma(
        address student,
        string memory studentName,
        string memory diplomaName,
        string memory year,
        string memory mention
    ) public onlyOwner returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(bytes(studentName).length > 0, "Student name is required");
        require(bytes(diplomaName).length > 0, "Diploma name is required");
        require(bytes(year).length > 0, "Year is required");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(student, tokenId);

        diplomas[tokenId] = Diploma({
            studentName: studentName,
            diplomaName: diplomaName,
            year: year,
            mention: mention,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit DiplomaIssued(tokenId, student);

        return tokenId;
    }

    function getDiploma(uint256 tokenId)
        public
        view
        returns (
            string memory studentName,
            string memory diplomaName,
            string memory year,
            string memory mention,
            uint256 issuedAt,
            bool revoked,
            address owner
        )
    {
        require(_ownerOf(tokenId) != address(0), "Diploma does not exist");

        Diploma memory diploma = diplomas[tokenId];

        return (
            diploma.studentName,
            diploma.diplomaName,
            diploma.year,
            diploma.mention,
            diploma.issuedAt,
            diploma.revoked,
            ownerOf(tokenId)
        );
    }

    function revokeDiploma(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Diploma does not exist");
        require(!diplomas[tokenId].revoked, "Diploma already revoked");

        diplomas[tokenId].revoked = true;

        emit DiplomaRevoked(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);

        require(
            from == address(0) || to == address(0),
            "Soulbound diploma: transfer is not allowed"
        );

        return super._update(to, tokenId, auth);
    }
}