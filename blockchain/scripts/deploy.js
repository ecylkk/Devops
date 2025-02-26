async function main() {
    const AIRequestCounter = await ethers.getContractFactory("AIRequestCounter");
    const contract = await AIRequestCounter.deploy();
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });