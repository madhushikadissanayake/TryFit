import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminReview.css';

const AdminReview = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Function to fetch feedbacks
    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:3005/api/getallfeedback');
            console.log('Full API Response:', response.data);
            if (Array.isArray(response.data.feedbacks)) {
                setFeedbacks(response.data.feedbacks);
                console.log('Updated Feedbacks State:', response.data.feedbacks);
            } else {
                console.error('Unexpected data format:', response.data);
                setError('Unexpected data format from the API.');
            }
        } catch (error) {
            console.error('Error fetching the feedbacks:', error.response?.data || error.message);
            setError('Failed to fetch feedback data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch feedbacks when component mounts
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDeleteFeedback = async (id) => {
        try {
            await axios.post(`http://localhost:3005/api/deletemessage/${id}`);
            toast.success("Review deleted successfully!"); // Toast success message
            fetchFeedbacks(); // Refresh the feedback list
        } catch (error) {
            console.error('Error deleting feedback:', error);
            toast.error("Failed to delete the review."); // Toast error message
        }
    };

    // Function to render stars based on rating
    const renderStars = (rating) => {
        const totalStars = 5; // Total number of stars
        let stars = '';

        for (let i = 0; i < totalStars; i++) {
            if (i < rating) {
                stars += '★'; // Filled star
            } else {
                stars += '☆'; // Empty star
            }
        }

        return <span className="star-rating">{stars}</span>;
    };

    // Handle loading and error states
    if (loading) {
        return <div>Loading feedbacks...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    // Filter feedbacks based on search query
    const filteredFeedbacks = feedbacks.filter(feedback => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            feedback.cusid.toString().toLowerCase().includes(lowerCaseQuery) || // Match Customer ID
            feedback.id.toString().toLowerCase().includes(lowerCaseQuery)      // Match Item ID
        );
    });

    return (
        <div className="admin-review-container">
            <h1>User Feedbacks</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Customer ID or Item ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <span className="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" className="w-5 h-5">
                        <path d="M10.5 2a8.5 8.5 0 1 0 6.5 14.5l5 5a1 1 0 0 0 1.5-1.5l-5-5A8.5 8.5 0 0 0 10.5 2zM10.5 4a6.5 6.5 0 1 1-6.5 6.5A6.507 6.507 0 0 1 10.5 4z" />
                    </svg>
                </span>
            </div>

            <table className="feedback-table">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Item ID</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th className='admtable-heading'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map((feedback) => (
                            <tr key={feedback._id}>
                                <td>{feedback.cusid ?? 'N/A'}</td>
                                <td>{feedback.id ?? 'N/A'}</td>
                                <td>{renderStars(feedback.rating ?? 0)}</td> {/* Use renderStars here */}
                                <td>{feedback.comment ?? 'No comment'}</td>
                                <td>
                                    <button className='admdelete-button' onClick={() => handleDeleteFeedback(feedback._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No feedback available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Toast container to display toast messages */}
            <ToastContainer />
        </div>
    );
};

export default AdminReview;
