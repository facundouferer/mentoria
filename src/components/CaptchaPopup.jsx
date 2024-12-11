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
      title: 'Complete el CAPTCHA',
      html: swalContent,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: true,
      didOpen: () => {
        ReactDOM.render(
          <ReCAPTCHA
            sitekey={process.env.RECAPTCHA_SITE_KEY}
            style={{ display: 'inline-block', margin: '0 auto' }}
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
