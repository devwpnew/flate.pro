import api from "pages/api/service/api";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useState } from "react";
import { forwardRef } from "react";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";

import arrowBottom from "public/icons/arrow-blue.svg";

import OutsideAlerter from "hooks/useOutsideAlerter";
import UserAvatar from "@modules/user/components/profile/common/userAvatar";
import UserName from "@modules/user/components/profile/common/userName";

import { Dialog } from "@headlessui/react";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";

import motionParams from "helpers/static/animation/motionParams";

export default function DropdownMenu() {
  const router = useRouter();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const user = useSelector((state) => state.userLogin.value);

  const DropdownLink = forwardRef((props, ref) => {
    let { href, children, ...rest } = props;
    return (
      <Link href={href}>
        <a
          ref={ref}
          {...rest}
          className={`whitespace-nowrap text-sm block mb-[13px]`}
        >
          {children}
        </a>
      </Link>
    );
  });

  const exitAccount = async () => {
    const exit = await api.auth.exitAccount(window.location.origin);
    if (exit === true) {
      window.location.reload();
    }
  };

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave") {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  };

  return (
    <>
      <div onMouseOver={hoverHandler} onMouseLeave={hoverHandler}>
        <OutsideAlerter action={() => setIsShow(false)}>
          <div
            className={`flex items-center group rounded transition-all truncate justify-end ${
              isShow
                ? "bg-bluelighter shadow"
                : "hover:bg-bluelighter hover:shadow"
            }`}
          >
            <Link href={"/user/profile/items"}>
              <a className="flex flex-row items-center gap-2">
                
                <div className="w-fit overflow-hidden text-sm pr-1">
                  <UserName name={user.user_name} />
                </div>
                <Image
                  className="group-hover:rotate-180 transition-all"
                  src={arrowBottom.src}
                  width={arrowBottom.width}
                  height={arrowBottom.height}
                />

                <div className="w-[30px] h-[30px]">
                  <UserAvatar
                    onClick={(ev) => {
                      ev.preventDefault();
                      router.push("/user/profile/items");
                    }}
                  />
                </div>
              </a>
            </Link>
          </div>

          <AnimatePresence>
            {isShow && (
              <motion.div
                {...motionParams.dropdownParams}
                className={
                  "px-[18px] py-[15px] flex flex-col absolute top-[30px] right-0 bg-white rounded shadow-lg"
                }
              >
                {user &&
                  user.user_group &&
                  (user.user_group?.id === 1 || user.user_group?.id === 5) && (
                    <div>
                      <DropdownLink href="/user/admin/">
                        <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                          <svg
                            className="fill-greyA0 group-hover:fill-blue"
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.49999 8.49998C11.8472 8.49998 13.75 6.59719 13.75 4.24999C13.75 1.90278 11.8472 0 9.49999 0C7.15278 0 5.25 1.90278 5.25 4.24999C5.25 6.59719 7.15278 8.49998 9.49999 8.49998Z" />
                            <path d="M9.49999 9.5C5.35788 9.5 2 12.8579 2 17C2 18.1046 2.89545 19 4.00001 19H15C16.1046 19 17 18.1046 17 17C17 12.8579 13.6421 9.5 9.49999 9.5Z" />
                          </svg>
                          <span>Администратор</span>
                        </span>
                      </DropdownLink>
                    </div>
                  )}
                <div>
                  <DropdownLink href="/user/profile/items/">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1.97915 3.16699H0.395846C0.177049 3.16699 0 3.34404 0 3.56284V5.14618C0 5.36498 0.177049 5.54203 0.395846 5.54203H1.97919C2.19799 5.54203 2.37504 5.36498 2.37504 5.14618V3.56284C2.375 3.34404 2.19795 3.16699 1.97915 3.16699Z" />
                        <path d="M1.97915 8.3125H0.395846C0.177049 8.3125 0 8.48955 0 8.70835V10.2917C0 10.5105 0.177049 10.6875 0.395846 10.6875H1.97919C2.19795 10.6875 2.375 10.5105 2.375 10.2917V8.70831C2.375 8.48955 2.19795 8.3125 1.97915 8.3125Z" />
                        <path d="M1.97915 13.459H0.395846C0.177049 13.459 0 13.636 0 13.8548V15.4381C0 15.6569 0.177049 15.834 0.395846 15.834H1.97919C2.19795 15.834 2.375 15.6569 2.375 15.4381V13.8548C2.375 13.636 2.19795 13.459 1.97915 13.459Z" />
                        <path d="M18.6038 3.95898H4.35385C4.13506 3.95898 3.95801 4.13603 3.95801 4.35483V5.14648C3.95801 5.36528 4.13506 5.54233 4.35385 5.54233H18.6038C18.8226 5.54233 18.9997 5.36528 18.9997 5.14648V4.35483C18.9997 4.13603 18.8226 3.95898 18.6038 3.95898Z" />
                        <path d="M18.6038 8.70898H4.35385C4.13506 8.70898 3.95801 8.88603 3.95801 9.10483V9.89649C3.95801 10.1153 4.13506 10.2923 4.35385 10.2923H18.6038C18.8226 10.2923 18.9997 10.1153 18.9997 9.89649V9.10483C18.9997 8.88603 18.8226 8.70898 18.6038 8.70898Z" />
                        <path d="M18.6038 13.459H4.35385C4.13506 13.459 3.95801 13.636 3.95801 13.8548V14.6465C3.95801 14.8653 4.13506 15.0423 4.35385 15.0423H18.6038C18.8226 15.0423 18.9997 14.8653 18.9997 14.6465V13.8548C18.9997 13.636 18.8226 13.459 18.6038 13.459Z" />
                      </svg>
                      <span>Мои объявления</span>
                    </span>
                  </DropdownLink>
                </div>
                <div>
                  <DropdownLink href="/user/profile/favorites/">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="18"
                        height="17"
                        viewBox="0 0 18 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.2358 0.900391C15.8471 0.900391 17.9643 3.07848 17.9643 5.76439C17.9643 10.2039 9.41404 16.1004 9.41404 16.1004C9.41404 16.1004 0.864258 10.4165 0.864258 5.76435C0.864258 2.4203 2.98145 0.900391 5.59226 0.900391C7.16494 0.900391 8.55415 1.69384 9.41404 2.90866C10.2741 1.69384 11.6635 0.900391 13.2358 0.900391Z" />
                      </svg>
                      <span>Избранное</span>
                    </span>
                  </DropdownLink>
                </div>

                <div>
                  <DropdownLink href="/user/profile/messages?notifications=1">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.41328 0.727051C4.77147 0.727051 0.863281 3.82657 0.863281 7.81259C0.863281 10.0256 2.09041 12.0797 4.17891 13.4174L2.80958 15.0159C2.45522 15.4296 2.85934 16.0524 3.40113 15.9049L7.65115 14.7475C12.9072 15.6586 17.9633 12.3676 17.9633 7.81262C17.9633 3.82732 14.056 0.727051 9.41328 0.727051Z" />
                      </svg>
                      <span>Уведомления</span>
                    </span>
                  </DropdownLink>
                </div>


                {/* <div>
                  <DropdownLink href="/user/profile/messages/">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.41328 0.727051C4.77147 0.727051 0.863281 3.82657 0.863281 7.81259C0.863281 10.0256 2.09041 12.0797 4.17891 13.4174L2.80958 15.0159C2.45522 15.4296 2.85934 16.0524 3.40113 15.9049L7.65115 14.7475C12.9072 15.6586 17.9633 12.3676 17.9633 7.81262C17.9633 3.82732 14.056 0.727051 9.41328 0.727051Z" />
                      </svg>
                      <span>Сообщения</span>
                    </span>
                  </DropdownLink>
                </div> */}
                {/* <div>
                  <DropdownLink href="/user/profile/selections/">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_3737_5189)">
                          <path d="M14.2841 6.40341H11.5329C11.1285 6.40432 10.7699 6.14367 10.6459 5.75884L9.79563 3.14197C9.75358 3.01445 9.63456 2.92822 9.50021 2.92822C9.36586 2.92822 9.24684 3.01445 9.20479 3.14197L8.35452 5.75853C8.23049 6.14382 7.87161 6.40448 7.46689 6.40341H4.71568C4.58087 6.40326 4.46125 6.48994 4.4195 6.61822C4.3779 6.7465 4.4236 6.88707 4.5329 6.96617L6.75871 8.58277C7.08631 8.81989 7.22324 9.24131 7.09755 9.62554L6.24757 12.2421C6.20567 12.3702 6.25106 12.5108 6.36006 12.59C6.46906 12.6694 6.61662 12.6696 6.72577 12.5904L8.95143 10.9737C9.27827 10.7353 9.72155 10.7353 10.0484 10.9737L12.274 12.5904C12.383 12.6694 12.5306 12.6693 12.6396 12.59C12.7484 12.5108 12.794 12.3705 12.7522 12.2424L11.9023 9.62599C11.7766 9.24177 11.9137 8.82035 12.2411 8.58353L14.4669 6.96677C14.5767 6.88783 14.623 6.74695 14.5812 6.61837C14.5395 6.48979 14.4192 6.40281 14.2841 6.40341Z" />
                          <path d="M19 2.54443C18.9985 1.23335 17.9361 0.170925 16.625 0.169434H2.375C1.06391 0.170925 0.001491 1.23335 0 2.54443V13.4016C0.001491 14.7127 1.06391 15.7751 2.375 15.7766H3.73214C3.8448 15.7766 3.95 15.8324 4.01311 15.9255C4.07623 16.0188 4.08916 16.1372 4.04741 16.2418L3.01216 18.8301L9.35405 15.8105C9.39961 15.7885 9.44947 15.7769 9.5 15.7766H16.625C17.9361 15.7751 18.9985 14.7127 19 13.4016V2.54443ZM15.3194 7.43923L12.8905 9.20358C12.7714 9.28989 12.7216 9.44313 12.767 9.58296L13.6949 12.4387C13.8362 12.858 13.6859 13.3204 13.3251 13.5767C12.9699 13.8408 12.4837 13.8408 12.1285 13.5767L9.69946 11.8123C9.58052 11.7259 9.41949 11.7259 9.30054 11.8123L6.87153 13.5767C6.51485 13.836 6.0316 13.836 5.67492 13.5769C5.31807 13.3176 5.16881 12.8582 5.30515 12.4387L6.23305 9.58329C6.27861 9.4433 6.22874 9.28989 6.10946 9.20358L3.68062 7.43923C3.32377 7.18012 3.17451 6.72056 3.31085 6.30126C3.4472 5.88179 3.838 5.59784 4.27901 5.598H7.28139C7.42834 5.598 7.55855 5.50357 7.60411 5.36392L8.53168 2.50815C8.66769 2.08835 9.05866 1.8039 9.5 1.8039C9.94134 1.8039 10.3323 2.08835 10.4683 2.50815L11.3959 5.36392C11.4415 5.50357 11.5717 5.598 11.7186 5.598H14.721C15.162 5.59784 15.5528 5.88179 15.6891 6.30126C15.8255 6.72056 15.6762 7.18012 15.3194 7.43923Z" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3737_5189">
                            <rect width="19" height="19" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Подборки</span>
                    </span>
                  </DropdownLink>
                </div> */}
                {/* <div>
                  <DropdownLink href="/user/profile/subscribe/">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="17"
                        height="15"
                        viewBox="0 0 17 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.88325 3.34561L11.6255 0.735486C12.5761 0.480767 13.5528 1.04483 13.8069 1.99483L14.1685 3.34383H15.0312C16.0151 3.34383 16.8125 4.14124 16.8125 5.12508V6.90633H11.4688C11.1541 6.90633 10.8518 7.03161 10.6292 7.25427C10.4065 7.47693 10.2812 7.77915 10.2812 8.09383V9.87508C10.2812 10.1898 10.4065 10.492 10.6292 10.7146C10.8518 10.9373 11.1541 11.0626 11.4688 11.0626H16.8125V12.8438C16.8125 13.8277 16.0151 14.6251 15.0312 14.6251C12.1557 14.6251 4.84428 14.6251 1.96875 14.6251C0.984906 14.6251 0.1875 13.8277 0.1875 12.8438C0.1875 10.9017 0.1875 7.06724 0.1875 5.12508C0.1875 4.17033 0.939187 3.39074 1.88325 3.34561V3.34561ZM16.8125 8.09383V9.87508H11.4688V8.09383H16.8125ZM12.9395 3.34383L12.6604 2.3024C12.5755 1.98533 12.2495 1.79771 11.9331 1.88262L6.47887 3.34383H12.9395Z"
                        />
                      </svg>
                      <span>Платные услуги</span>
                    </span>
                  </DropdownLink>
                </div> */}
                <div>
                  <DropdownLink href="/user/profile/settings/">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.1817 11.5821L16.4353 10.2165C16.4574 10.0059 16.4764 9.75969 16.4764 9.49922C16.4764 9.23875 16.4582 8.99257 16.4353 8.78197L18.1833 7.41557C18.5079 7.15907 18.5965 6.70385 18.3899 6.32466L16.5738 3.1825C16.3798 2.82785 15.9547 2.64575 15.5233 2.80487L13.4626 3.63215C13.0675 3.34715 12.6535 3.1065 12.2252 2.91412L11.9117 0.728346C11.8602 0.3135 11.4992 0 11.0725 0H7.43088C7.00416 0 6.64398 0.3135 6.59329 0.722L6.27901 2.91572C5.86416 3.10257 5.45648 3.34007 5.04401 3.63375L2.97776 2.8041C2.5906 2.65447 2.12747 2.82228 1.9351 3.17537L0.116662 6.32147C-0.0978673 6.68407 -0.00921307 7.1551 0.322508 7.41794L2.06891 8.78357C2.04119 9.05035 2.02776 9.28232 2.02776 9.50004C2.02776 9.71776 2.04123 9.94969 2.06891 10.2173L0.320912 11.5837C-0.00368377 11.841 -0.0915588 12.2962 0.115066 12.6746L1.93116 15.8167C2.12513 16.1706 2.54629 16.3542 2.98169 16.1943L5.04241 15.3671C5.43666 15.6513 5.85069 15.8919 6.27901 16.0851L6.59251 18.2701C6.64394 18.6865 7.00416 19 7.43166 19H11.0733C11.5 19 11.861 18.6865 11.9117 18.278L12.226 16.0851C12.6408 15.8975 13.0477 15.6607 13.461 15.3662L15.5272 16.1959C15.627 16.2347 15.7307 16.2545 15.8376 16.2545C16.1447 16.2545 16.4273 16.0867 16.5698 15.8254L18.3938 12.6667C18.5965 12.2962 18.5078 11.841 18.1817 11.5821ZM9.25169 12.6667C7.50529 12.6667 6.08504 11.2464 6.08504 9.5C6.08504 7.7536 7.50529 6.33335 9.25169 6.33335C10.9981 6.33335 12.4183 7.7536 12.4183 9.5C12.4183 11.2464 10.9981 12.6667 9.25169 12.6667Z" />
                      </svg>
                      <span>Настройки</span>
                    </span>
                  </DropdownLink>
                </div>
                <div>
                  <DropdownLink href="/help">
                    <span className="relative text-primary hover:text-blue transition-all flex items-center gap-2.5 group">
                      <svg
                        className="fill-greyA0 group-hover:fill-blue"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.5 0C4.26149 0 0 4.26149 0 9.5C0 14.7385 4.26149 19 9.5 19C14.7385 19 19 14.7385 19 9.5C19 4.26149 14.7385 0 9.5 0ZM9.5 15.0416C9.06295 15.0416 8.70838 14.687 8.70838 14.25C8.70838 13.813 9.06295 13.4584 9.5 13.4584C9.93705 13.4584 10.2916 13.813 10.2916 14.25C10.2916 14.687 9.93705 15.0416 9.5 15.0416ZM10.7532 10.0082C10.473 10.1372 10.2916 10.4199 10.2916 10.7279V11.0834C10.2916 11.5203 9.93777 11.875 9.5 11.875C9.06223 11.875 8.70838 11.5203 8.70838 11.0834V10.7279C8.70838 9.80398 9.2514 8.95699 10.0898 8.5698C10.8965 8.19856 11.4791 7.21284 11.4791 6.72912C11.4791 5.63831 10.5917 4.75 9.5 4.75C8.40832 4.75 7.52088 5.63831 7.52088 6.72912C7.52088 7.16617 7.16689 7.52088 6.72912 7.52088C6.29134 7.52088 5.9375 7.16617 5.9375 6.72912C5.9375 4.76508 7.53581 3.16662 9.5 3.16662C11.4642 3.16662 13.0625 4.76508 13.0625 6.72912C13.0625 7.79877 12.1346 9.37099 10.7532 10.0082Z" />
                      </svg>
                      <span>Помощь</span>
                    </span>
                  </DropdownLink>
                </div>
                <button
                  className={`whitespace-nowrap text-sm text-grey block pt-2.5 border-t border-greyborder flex items-center gap-2.5 group`}
                  onClick={() => setIsShowDialog(true)}
                >
                  <svg
                    className="fill-greyA0 group-hover:fill-blue"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2955_4292)">
                      <path d="M7.12512 10.2915C7.56289 10.2915 7.91673 10.6462 7.91673 11.0831V14.2499C7.91673 14.686 8.27144 15.0415 8.70849 15.0415H11.0835V3.16659C11.0835 2.49051 11.5141 1.88647 12.1617 1.66164L12.396 1.58322H8.70849C8.27144 1.58322 7.91673 1.93866 7.91673 2.37498V4.74995C7.91673 5.18685 7.56289 5.54156 7.12512 5.54156C6.68735 5.54156 6.33351 5.18685 6.33351 4.74995V2.37498C6.33351 1.06558 7.39909 0 8.70849 0H17.2188C17.2489 0 17.2741 0.013481 17.3034 0.0173948C17.3415 0.0142058 17.3779 0 17.4166 0C18.2899 0 19 0.71 19 1.58322V15.8331C19 16.5092 18.5693 17.1132 17.9218 17.338L13.1575 18.9262C12.996 18.976 12.8354 18.9998 12.6667 18.9998C11.7935 18.9998 11.0835 18.2897 11.0835 17.4164V16.6248H8.70849C7.39909 16.6248 6.33351 15.5593 6.33351 14.2499V11.0831C6.33351 10.6462 6.68735 10.2915 7.12512 10.2915Z" />
                      <path d="M0.231647 7.35677L3.39838 4.19018C3.62466 3.96376 3.96516 3.89563 4.26116 4.01826C4.55644 4.14104 4.74967 4.42994 4.74967 4.74986V7.12484H7.91625C8.3533 7.12484 8.70801 7.4794 8.70801 7.91645C8.70801 8.35349 8.3533 8.70806 7.91625 8.70806H4.74967V11.083C4.74967 11.403 4.55644 11.6919 4.26116 11.8146C3.96516 11.9373 3.62466 11.8691 3.39838 11.6429L0.231647 8.47613C-0.077836 8.16664 -0.077836 7.66625 0.231647 7.35677Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_2955_4292">
                        <rect
                          width="19"
                          height="19"
                          fill="white"
                          transform="matrix(-1 0 0 1 19 0)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Выйти</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </OutsideAlerter>
      </div>
      {/* {console.log("isShowDialog", isShowDialog)} */}
      <Dialog open={isShowDialog} onClose={() => setIsShowDialog(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              isShow={isShowDialog}
              onClose={() => setIsShowDialog(false)}
              onCloseText={"Нет"}
              onAccept={exitAccount}
              onAcceptText={"Да"}
              title={"Внимание!"}
              subtitle={"Вы дейтвительно хотите выйти?"}
              isOffTimeout={true}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
