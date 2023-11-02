import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { contractAddress } from "./contractVars/ContractDetails";
import { ABI } from "./contractVars/ContractDetails";

function App() {
  const [manager, setManager] = useState("");
  const [contract, setContract] = useState("");
  const [error, setError] = useState(null);
  const [ signer, setSigner ] = useState(null);
  const [network, setNetwork] = useState("");
  const [ text, setText ] = useState("Connect wallet");
  const [ lotteryId, setLotteryId ] = useState("");
  const [ numOfParticipants, setNumOfParticipants] = useState('')

  const connectWallet = async () => {
    setText("Loading")
    if(window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      setContract(contract)
      console.log(contract)
      const owner = await contract.owner();
      const lotteryId = await contract.lotteryId();
      console.log(owner)
      console.log(lotteryId)
      setNetwork(network.name.toUpperCase());
      setManager(owner)
      setSigner(signer.address);
    }else{
      alert("Please install a crypto wallet")
    }
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const tx = await contract.createLottery(`${numOfParticipants}`);
    console.log(tx);
  }

  const handleOnEntry = async (e) => {
    setError(null)
    try {
      e.preventDefault();
    const tx = await contract.enterLottery(`${lotteryId}`, {value: ethers.parseEther("0.01")});
    console.log(tx);
    alert("You successfully entered into the lottery");
    } catch (error) {
      setError(error.reason)
    }
    
  }

  useEffect(() => {
    connectWallet();
  }, [])

  return (
    <div className="h-screen flex flex-col gap-6 items-center justify-center">
      <h1 className="text-xl text-red-600">BlockLot</h1>
      <h2>Lottery Contract: {contractAddress}</h2>
      <h2>Lottery Manager: {manager}</h2>
      {
        signer && 
        <h1>
          Account connected: {signer}
        </h1>
      }
    
      <p>Connected to network: {network}</p>
      {
        error &&  <p className="text-red-600">{error}</p>
      }
      {
        !signer &&  <button className="bg-gray-300 px-4 py-1 rounded-lg" onClick={connectWallet}>{text}</button>
      }

      {
        signer === manager ? 
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <input className="border-2 border-black py-1 px-3 w-[400px] rounded" type="text" placeholder="Enter number of participants you want" name="value" value={numOfParticipants} onChange={e => setNumOfParticipants(e.target.value)}/>
          <button className="bg-gray-300 px-4 py-1 rounded-lg">Create Lottery</button>
        </form> : <div></div> 
        
      }

      {
        signer === manager ? 
          <div></div> 
          : 
          <form onSubmit={handleOnEntry} className="flex flex-col gap-5">
            <input className="border-2 border-black py-1 px-3 w-[400px] rounded" type="text" placeholder="enter lottery" name="id" value={lotteryId} onChange={e => setLotteryId(e.target.value)}/>
            <button className="bg-gray-300 px-4 py-1 rounded-lg">Enter lottery</button>
          </form>
      }
    </div>
  )
}

export default App