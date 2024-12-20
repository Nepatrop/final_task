"use client";
import { useEffect, useState } from "react";
import { useContractWrite, useContractRead, useAccount } from "wagmi";
import { YourContractABI } from "../../../abi/YourContractABI";

export default function Home() {
    const { address } = useAccount();
    const [options, setOptions] = useState<number[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const { data: votingActive } = useContractRead({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: YourContractABI,
        functionName: "votingActive",
    });

    const { data: contractOptions } = useContractRead({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: YourContractABI,
        functionName: "getOptions",
    });

    const { data: votes } = useContractRead({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: YourContractABI,
        functionName: "getVotes",
        args: [selectedOption || 0],
    });

    const { write: addVoter } = useContractWrite({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: YourContractABI,
        functionName: "addVoter",
    });

    const { write: vote } = useContractWrite({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: YourContractABI,
        functionName: "vote",
    });

    useEffect(() => {
        if (contractOptions) {
            setOptions(contractOptions as number[]);
        }
    }, [contractOptions]);

    const handleVote = () => {
        if (selectedOption !== null) {
            vote({ args: [selectedOption] });
        }
    };

    return (
        <div>
            <h1>Voting App</h1>
            {votingActive ? (
                <div>
                    <h2>Options:</h2>
                    <ul>
                        {options.map((option) => (
                            <li key={option}>
                                <label>
                                    <input
                                        type="radio"
                                        name="option"
                                        value={option}
                                        onChange={() => setSelectedOption(option)}
                                    />
                                    Option {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleVote}>Vote</button>
                </div>
            ) : (
                <p>Voting is not active.</p>
            )}
            {votes !== undefined && <p>Votes for selected option: {votes.toString()}</p>}
            {address && (
                <button onClick={() => addVoter({ args: [address] })}>Register as Voter</button>
            )}
        </div>
    );
}