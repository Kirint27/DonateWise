const fs = require('fs');

// Read the original JSON file
fs.readFile('/path/to/your/file.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    // Parse and fix the JSON structure
    let cleanedData = data.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']'); // Remove trailing commas
    let jsonData = JSON.parse(cleanedData);  // Try parsing the JSON

    // Save the cleaned JSON back to a new file
    fs.writeFile('/Users/kirinthapar/Downloads/.charity.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("Error writing cleaned file:", err);
        return;
      }
      console.log('Cleaned JSON saved successfully!');
    });
  } catch (err) {
    console.error("Error parsing JSON:", err);
  }
});
