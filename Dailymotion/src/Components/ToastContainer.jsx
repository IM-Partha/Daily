import React from 'react';
import { ToastContainer as ReactToastContainer } from 'react-toastify'; // Import the ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS for styling

const ToastContainer = () => {
  return (
    <ReactToastContainer
      position="top-right"       // Position of the toast on the screen
      autoClose={3000}           // Time in milliseconds after which the toast will auto close
      hideProgressBar={false}    // Whether to hide the progress bar of the toast
      closeOnClick              // Close the toast when clicked
      pauseOnHover              // Pause the toast when hovered over
      draggable                 // Allow dragging the toast
      pauseOnFocusLoss          // Pause if the window loses focus
    />
  );
};

export default ToastContainer;
