import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReCAPTCHA from "react-google-recaptcha";
import ReactDOM from "react-dom";

const MySwal = withReactContent(Swal);

export const showCaptchaPopup = () => {
  return new Promise((resolve) => {
    // Revisar si el CAPTCHA ya se completó antes
    const captchaCompleted = typeof window !== 'undefined' && localStorage.getItem('captchaCompleted') === 'true';

    if (captchaCompleted) {
      resolve(true);
      return;
    }

    // Si no, mostrar el CAPTCHA
    const swalContent = document.createElement("div");
    swalContent.id = "recaptcha-container";

    MySwal.fire({
      title: 'Complete el CAPTCHA',
      html: swalContent,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: true,
      didOpen: () => {
        const root = ReactDOM.createRoot(
          document.getElementById("recaptcha-container")
        );
        root.render(
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            style={{ display: 'inline-block', margin: '0 auto' }}
            onChange={(token) => {
              if (token) {
                Swal.close(); // Cerrar popup
                localStorage.setItem('captchaCompleted', 'true'); 
                resolve(true); 
              }
            }}
          />
        );
      },
    });
  });
};
