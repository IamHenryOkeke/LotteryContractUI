import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { contractAddress } from "./contractVars/ContractDetails";
import { ABI } from "./contractVars/ContractDetails";
function App() {
  const [owner, setOwner] = useState();
  const [error, setError] = useState();
  const [contract, setContract] = useState();
  const [loading, setLoading] = useState();
  const [ signer, setSigner ] = useState(null);
  const [network, setNetwork] = useState('');
  const [ text, setText ] = useState("Connect wallet");
  const [ formData, setFormData ] = useState({
    value : ""
  });
  const [ id, setId] = useState('')

  const handleOnChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

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
      setOwner(owner)
      setSigner(signer.address);
    }else{
      alert("Please install a crypto wallet")
    }
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const tx = await contract.createLottery(`${formData.value}`);
    console.log(tx);
    const lotteryData = await contract.LotteryData();
    console.log(lotteryData)
  }

  const handleOnEntry = async (e) => {
    e.preventDefault()
    // const tx = await contract.enterLottery(`${id}`, {value: ethdeposit});
    // console.log(tx);
  }

  useEffect(() => {
    connectWallet();
  }, [])

  return (
    <div className="h-screen flex flex-col gap-6 items-center justify-center">
      <h1 className="text-xl text-red-600">BlockLot</h1>
      <h2>Lottery Contract: {contractAddress}</h2>
      <h2>Lottery Manager {owner}</h2>
      {
        signer && 
        <h1>
          Account connected: {signer}
        </h1>
      }
    
      <p>Connected to network: {network}</p>

      {
        !signer &&  <button className="bg-gray-300 px-4 py-1 rounded-lg" onClick={connectWallet}>{text}</button>
      }

      {
        signer && 
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <input className="border-2 border-black py-1 px-3 w-[400px] rounded" type="text" placeholder="enter value" name="value" value={formData.value} onChange={handleOnChange}/>
          <button className="bg-gray-300 px-4 py-1 rounded-lg">Create Lottery</button>
        </form>
      }

      {
        signer && 
        <form onSubmit={handleOnEntry} className="flex flex-col gap-5">
          <input className="border-2 border-black py-1 px-3 w-[400px] rounded" type="text" placeholder="enter value" name="value" value={id} onChange={(e) => setId(e.target.value)}/>
          <button className="bg-gray-300 px-4 py-1 rounded-lg">Enter lottery</button>
        </form>
      }
    </div>
  )
}

export default App