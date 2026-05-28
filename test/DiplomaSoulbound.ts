import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("DiplomaSoulbound", function () {
  async function deploy() {
    const [owner, student, otherStudent, stranger] = await ethers.getSigners();
    const contract = await ethers.deployContract("DiplomaSoulbound");
    await contract.waitForDeployment();
    return { contract, owner, student, otherStudent, stranger };
  }

  describe("Émission de diplôme", function () {
    it("permet à l'owner d'émettre un diplôme et émet l'event DiplomaIssued", async function () {
      const { contract, owner, student } = await deploy();

      await expect(
        contract.issueDiploma(
          student.address,
          "Fitia Gershom",
          "Master MBDS",
          "2026",
          "Très Bien",
        ),
      )
        .to.emit(contract, "DiplomaIssued")
        .withArgs(1n, student.address);

      expect(await contract.ownerOf(1)).to.equal(student.address);
    });

    it("refuse l'émission par un non-owner", async function () {
      const { contract, student, stranger } = await deploy();

      await expect(
        contract
          .connect(stranger)
          .issueDiploma(student.address, "Fitia", "Master", "2026", ""),
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("refuse l'émission vers l'adresse zéro", async function () {
      const { contract } = await deploy();

      await expect(
        contract.issueDiploma(ethers.ZeroAddress, "Fitia", "Master", "2026", ""),
      ).to.be.revertedWith("Invalid student address");
    });

    it("refuse l'émission si le nom de l'étudiant est vide", async function () {
      const { contract, student } = await deploy();

      await expect(
        contract.issueDiploma(student.address, "", "Master", "2026", ""),
      ).to.be.revertedWith("Student name is required");
    });

    it("incrémente le tokenId à chaque émission", async function () {
      const { contract, student, otherStudent } = await deploy();

      await contract.issueDiploma(student.address, "Fitia", "Master MBDS", "2026", "");
      await contract.issueDiploma(otherStudent.address, "Kanto", "Master MBDS", "2026", "");

      expect(await contract.ownerOf(1)).to.equal(student.address);
      expect(await contract.ownerOf(2)).to.equal(otherStudent.address);
    });
  });

  describe("Lecture (getDiploma)", function () {
    it("retourne les bonnes métadonnées d'un diplôme émis", async function () {
      const { contract, student } = await deploy();
      await contract.issueDiploma(
        student.address,
        "Fitia Gershom",
        "Master MBDS",
        "2026",
        "Très Bien",
      );

      const [studentName, diplomaName, year, mention, , revoked, holder] =
        await contract.getDiploma(1);

      expect(studentName).to.equal("Fitia Gershom");
      expect(diplomaName).to.equal("Master MBDS");
      expect(year).to.equal("2026");
      expect(mention).to.equal("Très Bien");
      expect(revoked).to.equal(false);
      expect(holder).to.equal(student.address);
    });

    it("revert si le diplôme n'existe pas", async function () {
      const { contract } = await deploy();

      await expect(contract.getDiploma(999)).to.be.revertedWith(
        "Diploma does not exist",
      );
    });
  });

  describe("Révocation", function () {
    it("permet à l'owner de révoquer un diplôme et émet DiplomaRevoked", async function () {
      const { contract, student } = await deploy();
      await contract.issueDiploma(student.address, "Fitia", "Master", "2026", "");

      await expect(contract.revokeDiploma(1))
        .to.emit(contract, "DiplomaRevoked")
        .withArgs(1n);

      const [, , , , , revoked] = await contract.getDiploma(1);
      expect(revoked).to.equal(true);
    });

    it("refuse la révocation par un non-owner", async function () {
      const { contract, student, stranger } = await deploy();
      await contract.issueDiploma(student.address, "Fitia", "Master", "2026", "");

      await expect(
        contract.connect(stranger).revokeDiploma(1),
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("refuse la double révocation", async function () {
      const { contract, student } = await deploy();
      await contract.issueDiploma(student.address, "Fitia", "Master", "2026", "");
      await contract.revokeDiploma(1);

      await expect(contract.revokeDiploma(1)).to.be.revertedWith(
        "Diploma already revoked",
      );
    });
  });

  describe("Soulbound (transferts bloqués)", function () {
    it("refuse un transferFrom entre deux wallets", async function () {
      const { contract, student, otherStudent } = await deploy();
      await contract.issueDiploma(student.address, "Fitia", "Master", "2026", "");

      await expect(
        contract
          .connect(student)
          .transferFrom(student.address, otherStudent.address, 1),
      ).to.be.revertedWith("Soulbound diploma: transfer is not allowed");
    });

    it("refuse un safeTransferFrom entre deux wallets", async function () {
      const { contract, student, otherStudent } = await deploy();
      await contract.issueDiploma(student.address, "Fitia", "Master", "2026", "");

      await expect(
        contract
          .connect(student)
          ["safeTransferFrom(address,address,uint256)"](
            student.address,
            otherStudent.address,
            1,
          ),
      ).to.be.revertedWith("Soulbound diploma: transfer is not allowed");
    });
  });

  describe("Ownership (Ownable)", function () {
    it("permet le transfert de propriété du contrat", async function () {
      const { contract, owner, stranger } = await deploy();

      expect(await contract.owner()).to.equal(owner.address);

      await contract.transferOwnership(stranger.address);

      expect(await contract.owner()).to.equal(stranger.address);
    });
  });
});
