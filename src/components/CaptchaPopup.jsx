import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReCAPTCHA from 'react-google-recaptcha';
import ReactDOM from 'react-dom';

const MySwal = withReactContent(Swal);

export const showCaptchaPopup = () => {
  return new Promise((resolve) => {
    const swalContent = document.createElement('div');
    swalContent.id = 'recaptcha-container';

    MySwal.fire({
      title: 'Complete CAPTCHA',
      html: swalContent,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        ReactDOM.render(
          <ReCAPTCHA
            sitekey="6LcYkpYqAAAAAHVs8eHgSBjZAEJ94kGiL_O-Tx_y"
            onChange={(token) => {
              if (token) {
                Swal.close(); // Close the popup
                resolve(true); // Resolve the promise
              }
            }}
          />,
          document.getElementById('recaptcha-container')
        );
      },
    });
  });
};
