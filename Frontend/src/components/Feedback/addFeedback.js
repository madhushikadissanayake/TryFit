import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Feedback.css';
import StarRating from '../../components/StarRating';
import { FaStar, FaUserCircle, FaThumbsUp, FaEdit } from 'react-icons/fa';

const AddFeedback = () => {
    const location = useLocation();
    const { state } = location;
    const { row } = state || {};
    const itemId = row ? row.id : null;

    const [feedbacks, setFeedbacks] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const userID = sessionStorage.getItem('userID');
    const [likedFeedbacks, setLikedFeedbacks] = useState({});

    useEffect(() => {
        if (itemId) {
            fetchFeedbacks();
        } else {
            console.error("No itemId available");
        }
    }, [itemId]);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`http://localhost:3005/api/getmessage?itemId=${itemId}`);
            console.log("Fetch Feedbacks Response:", response.data); // Log response data
            if (response.data.success) {
                setFeedbacks(response.data.feedbacks);
                const rating = Number(response.data.averageRating);
                setAverageRating(rating >= 0 ? rating : 0);
            } else {
                console.error('Failed to fetch feedbacks:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        const feedbackData = {
            cusid: userID,
            id: itemId,
            comment,
            rating
        };

        try {
            console.log('Submitting Feedback:', feedbackData); // Log feedback data being sent

            const response = editingFeedbackId
                ? await axios.post(`http://localhost:3005/api/updatemessage/${editingFeedbackId}`, { ...feedbackData })
                : await axios.post('http://localhost:3005/api/createmessage', feedbackData);

            if (response.data.success) {
                if (editingFeedbackId) {
                    setFeedbacks((prevFeedbacks) =>
                        prevFeedbacks.map((feedback) =>
                            feedback._id === editingFeedbackId ? { ...feedback, comment, rating } : feedback
                        )
                    );
                } else {
                    const newFeedback = {
                        _id: response.data.response._id,
                        comment,
                        rating,
                        email: response.data.response.email,
                        likes: 0
                    };
                    setFeedbacks((prevFeedbacks) => [...prevFeedbacks, newFeedback]);
                }

                resetForm();
                setSuccessMessage('Feedback submitted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchFeedbacks();
            } else {
                console.error('Failed to submit feedback:', response.data.message);
            }
        } catch (error) {
            console.error('Error while submitting feedback:', error.response ? error.response.data : error.message);
        }
    };

    const resetForm = () => {
        setComment('');
        setRating(0);
        setEditingFeedbackId(null);
    };

    const handleEdit = (feedback) => {
        setComment(feedback.comment);
        setRating(feedback.rating);
        setEditingFeedbackId(feedback._id);
    };

    const handleLike = async (feedbackId) => {
        try {
            const isLiked = likedFeedbacks[feedbackId];
            const response = await axios.post('http://localhost:3005/api/likefeedback', { id: feedbackId });

            if (response.status === 200) {
                setFeedbacks((prevFeedbacks) =>
                    prevFeedbacks.map((feedback) =>
                        feedback._id === feedbackId
                            ? { ...feedback, likes: (feedback.likes || 0) + (isLiked ? -1 : 1) }
                            : feedback
                    )
                );
                setLikedFeedbacks((prevLikes) => ({
                    ...prevLikes,
                    [feedbackId]: !isLiked
                }));
            }
        } catch (error) {
            console.error('Failed to like feedback:', error);
        }
    };

    const renderStarRating = (ratingValue) => (
        [...Array(5)].map((_, i) => {
            const starRating = i + 1;
            return (
                <FaStar
                    key={i}
                    size={20}
                    color={starRating <= ratingValue ? "#ffc107" : "#e4e5e9"}
                    style={{ marginRight: '5px' }}
                />
            );
        })
    );

    return (
        <div id="feedback-section">
            <h3 className="product-reviews-title">Product Reviews</h3>

            <div className="average-rating-box">
                <h4>Average Rating</h4>
                <div className="star-rating-display" style={{ display: 'flex', justifyContent: 'center' }}>
                    {renderStarRating(averageRating)}
                </div>
                <p className="average-rating-value">
                    {Number.isFinite(averageRating) && averageRating > 0 ? averageRating.toFixed(1) : '0.0'} out of 5
                </p>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="feedback-container">
                <div className="feedback-box">
                    <h4 className="all-reviews-title">All Reviews</h4>
                    <div id="feedback-list">
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <div key={feedback._id} className="feedback-item">
                                    <div className="feedback-content">
                                        <FaUserCircle size={40} className="avatar" />
                                        <div style={{ marginLeft: '10px' }}>
                                            <strong>{feedback.email}</strong>
                                            <div>{feedback.comment}</div>
                                            <div className="star-rating-display" style={{ display: 'flex', marginTop: '5px' }}>
                                                {renderStarRating(feedback.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="feedback-actions">
                                        <button onClick={() => handleEdit(feedback)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <FaEdit size={20} color="#007bff" />
                                        </button>
                                        <div className="like-icon">
                                            <button onClick={() => handleLike(feedback._id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <FaThumbsUp
                                                    size={20}
                                                    color={likedFeedbacks[feedback._id] ? "#007bff" : "#e4e5e9"}
                                                    style={{ marginRight: '5px' }}
                                                />
                                            </button>
                                            <span>({feedback.likes || 0}) Helpful</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No feedback available.</p>
                        )}
                    </div>
                </div>

                <div className="form-box">
                    <h4>{editingFeedbackId ? 'Edit Your Feedback' : 'Submit Your Feedback'}</h4>
                    <form id="feedback-form" onSubmit={submitFeedback}>
                        <textarea
                            className="revtextarea"
                            placeholder="Write your feedback here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)} // Ensure this is correctly set
                            required
                        />
                        <StarRating rating={rating} setRating={setRating} />
                        <button type="submit">{editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFeedback; 
