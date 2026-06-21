const fs = require('fs');

const readmePath = 'E:\\LearningPlatform\\README.md';
const content = fs.readFileSync(readmePath, 'utf8');
const lines = content.split('\n');

function printRange(start, end, label) {
  console.log(`\n=== ${label} (Lines ${start}-${end}) ===`);
  for (let i = start - 1; i < end && i < lines.length; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

// Print database sections, CMS section, and sprint details
printRange(850, 885, "8. CONTENT MANAGEMENT SYSTEM (CMS)");
printRange(1225, 1256, "16. MVP DEVELOPMENT ROADMAP & SPRINTS (End)");
