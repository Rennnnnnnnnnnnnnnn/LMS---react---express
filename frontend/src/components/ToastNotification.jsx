
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastNotification() {
  return (
    <>
      <ToastContainer
        // position="top-right"
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          width: "400px",
        }}

      // OLD STYLE
      /*    style={{
           whiteSpace: 'nowrap',
           width: '400px'
         }} */
      />
    </>
  );
}

export default ToastNotification;
