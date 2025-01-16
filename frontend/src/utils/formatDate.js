function formatDate(isoDate) {
    try {
        // Validate the input
        if (typeof isoDate !== "string") {
            throw new Error("Invalid input: Date must be a string in ISO 8601 format.");
        }

        // Parse the ISO date string
        const date = new Date(isoDate);

        // Validate the parsed date
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date: Unable to parse the provided ISO date string.");
        }

        // Convert to desired format
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = date.toLocaleDateString("en-GB", options);

        return formattedDate.replace(",", ""); // Remove the comma
        } catch (error) {
        return `Error: ${error.message}`;
    }
  }

export {formatDate}