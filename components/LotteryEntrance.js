//function to enter the lottery

import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled, enableWeb3 } = useMoralis();

  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntrancefee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setrecentWinner] = useState("");

  const dispatch = useNotification();

  //to enter the entrance fee for the raffle
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  //to get the number of the players in the lottery
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  //To get the recent winner of the lottery
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  //To get entrance fee
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  // to set the states of the lottery
  async function updateUi() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();

    setEntrancefee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setrecentWinner(recentWinnerFromCall);
    //console.log("it is getting called = " + entranceFee);
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  // for notifications
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    console.log("enterRaffle transaction sucessful");
    handleNotification(tx);
    updateUi();
  };

  const handleNotification = () => {
    dispatch({
      type: "success",
      message: "Transaction Complete",
      title: "Tx notification",
      position: "topR",
      icon: "bell",
    });
  };

  //Listening the events

  return (
    <div className="p-5">
      {raffleAddress ? (
        <div className="">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => {
                  console.log(error);
                },
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance fee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Players : {numPlayers}</div>
          <div>Recent Winner : {recentWinner}</div>
        </div>
      ) : (
        <div>No raffle address detected</div>
      )}
    </div>
  );
}
