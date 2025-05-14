import React from 'react';
import { FaStar } from 'react-icons/fa';
import './Feedback/Feedback.css';

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = React.useState(null); // Hover effect for stars

    return (
        <div className="star-rating-display">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={i}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)} // Update rating in parent component
                            style={{ display: 'none' }} // Hide the radio input
                        />
                        <FaStar
                            className="star"
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} // Highlight stars
                            size={30}
                            onMouseEnter={() => setHover(ratingValue)} // Hover effect
                            onMouseLeave={() => setHover(null)} // Remove hover effect
                            style={{ cursor: 'pointer', marginRight: '5px' }} // Styling for star display
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;
