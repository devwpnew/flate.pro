import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Header from "../header/header";
import Footer from "../footer/footer";
import FooterMini from "../footer/footerMini";
import Loader from "@modules/common/components/preloader/loader";

import RegistrationModal from "@modules/user/components/auth/template/registration/registrationModal";
import RegistrationForm from "@modules/user/components/auth/template/registration/registrationForm";

import ButtonToTop from "@modules/common/components/button/buttonToTop";
import ButtonReview from "@modules/common/components/button/buttonReview";

import getLayout from "helpers/getLayout";
import BannerMain from "./part/bannerMain";
import Banner from "@modules/common/components/banner/banner";

export default function Layout({ children, layoutParams, ...props }) {
  const { LAPTOP_MOBILE } = getLayout();
  const [isRegistrationModalShow, setIsRegistrationModalShow] = useState(false);

  const user = useSelector((state) => state.userLogin.value);
  const ssrUser = props?.data?.user ? props.data.user : false;

  useEffect(() => {
    if (!user === false) {
      if (
        !user.user_name ||
        // !user.user_agency ||
        !user.professional_confirmation
      ) {
        setIsRegistrationModalShow(true);
      }
    }
  }, [user]);

  return (
    <div>
      <Loader />

      {isRegistrationModalShow === true ? (
        <>
          <div className="overflow-hidden flex flex-col justify-between">
            <div className="">
              <Header
                layoutParams={layoutParams}
                hideTopBar={true}
                ssrUser={ssrUser}
              />
            </div>

            <div className="">
              <RegistrationForm
                userId={user.id}
                setIsRegistrationModalShow={setIsRegistrationModalShow}
              />
            </div>

            <div className="">
              <FooterMini />
            </div>
          </div>
        </>
      ) : (
        <>
          <Header layoutParams={layoutParams} ssrUser={ssrUser} />
          <main
            className={`pb-[52px] min-h-[70vh] ${
              LAPTOP_MOBILE ? "overflow-hidden" : ""
            }`}
          >
            {children}
          </main>
          {/* <ButtonReview /> */}
          <ButtonToTop />
          <Footer />

          <Banner Component={BannerMain} type={"main-banner"} id={5} />
        </>
      )}
    </div>
  );
}
