import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startTour = () => {
  console.log("Starting tour...");
  
  try {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: [
        { element: '#app-title', popover: { title: 'Welcome to Safety Sign Pro', description: 'Create professional safety signs in minutes. Let us take you on a quick tour.', side: "bottom", align: 'start' } },
        { element: '#sidebar-library', popover: { title: 'Template Library', description: 'Choose from thousands of pre-made safety sign templates or access your saved designs here.', side: "right", align: 'start' } },
        { element: '#add-elements-section', popover: { title: 'Add Elements', description: 'Enhance your sign with icons, shapes, QR codes, or upload your own images.', side: "right", align: 'start' } },
        { element: '#main-canvas', popover: { title: 'Design Canvas', description: 'This is your workspace. Click on elements to edit text, colors, and layout.', side: "left", align: 'start' } },
        { element: '#undo-redo-controls', popover: { title: 'Undo / Redo', description: 'Made a mistake? Easily undo or redo your changes.', side: "bottom", align: 'start' } },
        { element: '#view-controls', popover: { title: 'View Controls', description: 'Zoom in/out and toggle the grid for precise alignment.', side: "bottom", align: 'start' } },
        { element: '#save-download-controls', popover: { title: 'Save & Download', description: 'Save your template for later or download it as a high-quality PNG or PDF.', side: "bottom", align: 'end' } },
      ]
    });

    console.log("Driver initialized, starting drive...");
    driverObj.drive();
  } catch (error) {
    console.error("Error starting tour:", error);
    alert("Failed to start tour. Please check console for details.");
  }
};
