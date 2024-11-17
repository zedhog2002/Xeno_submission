import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./sendMessages.css";

const SendMessagesPage = () => {
    const { campaignId } = useParams();
    const [audienceGroup, setAudienceGroup] = useState([]);
    const [messageTemplate, setMessageTemplate] = useState("");
    const [messageLogs, setMessageLogs] = useState([]);

    useEffect(() => {
        fetchAudienceGroup();
        fetchMessageLogs();
    }, [campaignId]); // Re-fetch when campaignId changes

    const fetchAudienceGroup = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/audienceGroup/get_audience/${campaignId}`);
            setAudienceGroup(response.data || []);
        } catch (err) {
            console.error("Error fetching audience group", err);
        }
    };

    const fetchMessageLogs = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/messageLogs/${campaignId}`);
            console.log(response.data); // Debug to check what is returned
            // Access the 'customers' array from the response data
            setMessageLogs(response.data[0]?.customers || []); // Fix: Access customers from the first element in the response
        } catch (err) {
            console.error("Error fetching message logs", err);
        }
    };

    const sendMessages = async () => {
        if (!messageTemplate) {
            alert("Please enter a message template.");
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/messageLogs/send_message`, {
                campaignId,
                messageTemplate,
            });

            if (response.status === 200) {
                alert("Messages sent successfully!");
                fetchMessageLogs(); // Refresh message logs after sending
            }
        } catch (err) {
            console.error("Error sending messages", err);
            alert("Failed to send messages. Please try again.");
        }
    };

    return (
        <div className="send-messages-page">
            <h2>Send Messages for Campaign</h2>
            <p>Campaign ID: {campaignId}</p>
            <textarea
                placeholder="Enter your message template here..."
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
            ></textarea>
            <button onClick={sendMessages} className="send-btn">
                Send Messages
            </button>

            <h3>Message Logs</h3>
            {messageLogs.length > 0 ? (
                <table className="message-log-table">
                    <thead>
                        <tr>
                            <th>Recipient</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messageLogs.map((log, index) => (
                            <tr key={log._id || index}>
                                <td>{log.recipientName}</td>
                                <td>{log.message}</td>
                                <td>{log.status}</td>
                                <td>{new Date(log.sentAt).toLocaleString()}</td>
                            </tr> // Make sure there's no extra whitespace or line breaks here
                        ))}
                    </tbody>

                </table>
            ) : (
                <p>No message logs available.</p>
            )}
        </div>
    );
};

export default SendMessagesPage;
