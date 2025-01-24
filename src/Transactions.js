import React, { useEffect, useState } from "react";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const style = {
        container: "px-4 max-w-3xl mx-auto",
        heading: "text-center text-[25px] my-4 font-[600]",
        table: "w-full border-collapse border border-gray-300 my-4",
        th: "border border-gray-300 px-4 py-2 bg-gray-100 text-left font-semibold",
        td: "border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-50",
        loader: "text-center text-primary-500 my-4",
        modalOverlay:
            "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        modalContent:
            "bg-white p-6 rounded shadow-lg max-w-sm w-full z-60 relative",
        closeModal: "absolute top-2 right-2 text-gray-500 cursor-pointer",
        modalHeading: "text-lg font-semibold mb-4",
        modalDetails: "text-sm mb-2",
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const url = "https://api.paystack.co/transaction";
            const headers = {
                Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            };

            try {
                const response = await fetch(url, { headers, method: "GET" });
                const data = await response.json();

                if (data.status) {
                    setTransactions(data.data); // Assumes `data.data` contains the transactions array
                } else {
                    console.error(
                        "Failed to fetch transactions:",
                        data.message
                    );
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleRowClick = (transaction) => {
        setSelectedTransaction(transaction);
    };

    const closeModal = () => {
        setSelectedTransaction(null);
    };

    return (
        <div className={style.container}>
            <h1 className={style.heading}>Transaction History</h1>
            {loading ? (
                <p className={style.loader}>Loading transactions...</p>
            ) : transactions.length > 0 ? (
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th className={style.th}>Transaction ID</th>
                            <th className={style.th}>Name</th>
                            <th className={style.th}>Email</th>
                            <th className={style.th}>Amount (₦)</th>
                            <th className={style.th}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                onClick={() => handleRowClick(transaction)}
                            >
                                <td className={style.td}>{transaction.id}</td>
                                <td className={style.td}>
                                    {transaction.customer?.first_name ||
                                        transaction.metadata?.name ||
                                        "N/A"}
                                </td>
                                <td className={style.td}>
                                    {transaction.customer?.email || "N/A"}
                                </td>
                                <td className={style.td}>
                                    {(transaction.amount / 100).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </td>
                                <td className={style.td}>
                                    {new Date(
                                        transaction.created_at
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className={style.loader}>No transactions found.</p>
            )}

            {selectedTransaction && (
                <div className={style.modalOverlay} onClick={closeModal}>
                    <div
                        className={style.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className={style.closeModal} onClick={closeModal}>
                            ×
                        </span>
                        <h2 className={style.modalHeading}>
                            Transaction Details
                        </h2>
                        <p className={style.modalDetails}>
                            <strong>Transaction ID:</strong>{" "}
                            {selectedTransaction.id}
                        </p>
                        <p className={style.modalDetails}>
                            <strong>Name:</strong>{" "}
                            {selectedTransaction.customer?.first_name ||
                                selectedTransaction.metadata?.name ||
                                "N/A"}
                        </p>
                        <p className={style.modalDetails}>
                            <strong>Email:</strong>{" "}
                            {selectedTransaction.customer?.email || "N/A"}
                        </p>
                        <p className={style.modalDetails}>
                            <strong>Amount:</strong>{" "}
                            {(selectedTransaction.amount / 100).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </p>
                        <p className={style.modalDetails}>
                            <strong>Date:</strong>{" "}
                            {new Date(
                                selectedTransaction.created_at
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
