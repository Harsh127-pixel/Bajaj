const express = require('express');
const router = express.Router();
const { processData } = require('../utils/processor');

/**
 * POST /bfhl
 * Processes an array of edge strings to build hierarchies and detect cycles.
 */
router.post('/', (req, res) => {
    try {
        const { data } = req.body;

        // Validate that data is an array
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ 
                error: "data must be an array" 
            });
        }

        // Call processData logic
        const result = processData(data);

        // Return the response with required placeholders and processed results
        return res.status(200).json({
            user_id: "yourname_ddmmyyyy",       // Placeholder: Replace with actual value
            email_id: "your@email.com",          // Placeholder: Replace with actual value
            college_roll_number: "ROLLNUMBER",    // Placeholder: Replace with actual value
            hierarchies: result.hierarchies,
            invalid_entries: result.invalid_entries,
            duplicate_edges: result.duplicate_edges,
            summary: result.summary
        });

    } catch (error) {
        console.error('Error in POST /bfhl:', error);
        return res.status(500).json({ 
            error: "Internal server error" 
        });
    }
});

module.exports = router;
