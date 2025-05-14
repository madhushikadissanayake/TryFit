const Feedback = require('../models/Feedback');

const createMessage = async (req, res, next) => {
    const { cusid, id, comment, rating } = req.body;

    console.log("Received data:", { cusid, id, comment, rating });

    try {
        const newFeedback = new Feedback({
            cusid,
            id,
            comment,
            rating
        });

        const savedFeedback = await newFeedback.save();
        console.log("Saved feedback:", savedFeedback);

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully!',
            response: savedFeedback
        });
    } catch (error) {
        console.error('Error creating feedback:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Retrieve feedback messages for a specific item
const getMessage = async (req, res, next) => {
    const { itemId } = req.query;

    // Debugging log
    console.log("Received itemId:", itemId);

    try {
        // Fetch feedbacks based on itemId
        const feedbacks = await Feedback.find({ id: itemId });
        console.log("Retrieved feedbacks:", feedbacks);

        // Calculate the average rating
        const totalRating = feedbacks.reduce((sum, feedback) => {
            const rating = Number(feedback.rating);
            console.log(`Processing feedback with rating: ${rating}`); // Debugging log for each rating
            return sum + (isNaN(rating) ? 0 : rating); // Prevent NaN from affecting the total
        }, 0);

        const averageRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : '0.0'; // Ensure consistent format

        // Log the average rating
        console.log("Calculated Average Rating:", averageRating);

        // Send the response including feedbacks and average rating
        res.json({ success: true, feedbacks, averageRating });
    } catch (error) {
        console.error('Error retrieving feedbacks:', error.message); // Log the error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update an existing feedback message
const updateMessage = async (req, res, next) => {
    const { cusid, rating, comment } = req.body;
    const feedbackId = req.params.id;

    try {
        // Check if the feedback exists
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found.' });
        }

        // Debugging: Log values to compare
        console.log('Request CusID:', cusid);
        console.log('Feedback CusID:', feedback.cusid);

        // Check if the feedback belongs to the user
        if (String(feedback.cusid) !== String(cusid)) {
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this feedback.' });
        }

        // Update the feedback
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { rating, comment },
            { new: true, runValidators: true }
        );

        // Send the updated feedback in the response
        res.json({ success: true, feedback: updatedFeedback });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ success: false, message: 'Error updating feedback.' });
    }
};

// Delete a feedback message
const deleteMessage = (req, res, next) => {
    const feedbackId = req.params.id; // Get the feedback ID from the request parameters

    Feedback.findByIdAndDelete(feedbackId)  // Delete the specific feedback item from the database
        .then(response => {
            if (response) {
                res.json({ message: "Feedback deleted successfully.", deletedId: feedbackId });
            } else {
                res.status(404).json({ message: "Feedback not found." });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message }); // Send error response with status code
        });
};

// Like a feedback message
const likeFeedback = async (req, res, next) => {
    const { id } = req.body; // Extract feedback ID from the request body

    // Debugging log
    console.log("Received feedback ID for like:", id);

    try {
        // Find the feedback by ID and increment the likes
        const feedback = await Feedback.findById(id);
        if (feedback) {
            feedback.likes = (feedback.likes || 0) + 1; // Increment likes
            await feedback.save(); // Save the updated feedback
            res.json({ success: true, likes: feedback.likes }); // Send success response with the new like count
        } else {
            res.status(404).json({ success: false, message: 'Feedback not found' });
        }
    } catch (error) {
        console.error('Error liking feedback:', error.message); // Log the error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllFeedback = (req, res, next) => {
    Feedback.find()
        .then(feedbacks => {
            res.json({ feedbacks });
        })
        .catch(error => {
            console.error('Error fetching feedbacks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Export all
exports.createMessage = createMessage;
exports.getMessage = getMessage;
exports.updateMessage = updateMessage;
exports.deleteMessage = deleteMessage;
exports.likeFeedback = likeFeedback;
exports.getAllFeedback = getAllFeedback; 