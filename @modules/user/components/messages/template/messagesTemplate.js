import api from "pages/api/service/api";

import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";

import BackButton from "@modules/common/components/button/backButton";
import Container from "@modules/common/components/container/container";
import ProfileSidebarTemplate from "@modules/user/components/profile/template/profileSidebarTemplate";
import MessagesContent from "./messagesContent";
import MessagesChat from "./messagesChat";
import NotificationsContent from "./notificationsContent";

import getLayout from "helpers/getLayout";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import MotionContainer from "@modules/common/components/container/motionContainer";
import FallbackDevelopment from "@modules/common/components/fallback/FallbackDevelopment";

export default function MessagesTemplate({ chatTemplate, dialogue }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();
  const router = useRouter();

  const user = useSelector((state) => state.userLogin.value);

  const [notifications, setNotifications] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] =
    useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateCallback = async function () {
    await updateMsgNotifications();
  };

  async function updateMsgNotifications() {
    const response = await api.get.notificationsByUser(user);
    setNotifications(response);
    const countResponse = await api.get.notificationsUnreadCount(user);
    setUnreadNotificationsCount(countResponse?.count);
  }

  useEffect(() => {
    (async () => {
      if (selectedIndex == 1) {
        // перешёл в уведомления
        await api.set.notificationsRead(user); // сделать уведомления прочитанными
        await updateMsgNotifications();
      }
    })();
  }, [selectedIndex]);

  useEffect(() => {
    if (router.query?.notifications) {
      setSelectedIndex(1);
    } else {
      setSelectedIndex(0);
    }

    (async () => {
      await updateMsgNotifications();
    })();
  }, [router]);

  return (
    <MotionContainer>
      {MOBILE ? (
        <>
          <MobilePageHeader href={"/user/profile"} title="Сообщения" />
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Container>
              <div className="relative border-b-greyborder mb-2.5">
                <Tab.List>
                  <div className="flex justify-start gap-8">
                    
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <div
                          className={
                            selected
                              ? "border-b-blue border-b-2"
                              : "border-b-transparent border-b-2"
                          }
                        >
                          <button
                            className={
                              selected
                                ? "text-blue px-1 md:px-5 whitespace-nowrap"
                                : "text-primary px-1 md:px-5 whitespace-nowrap"
                            }
                          >
                            <span className="relative">
                              Уведомления
                            </span>
                          </button>
                        </div>
                      )}
                    </Tab>
                  </div>
                </Tab.List>
              </div>
            </Container>
            <Tab.Panels>
              <Tab.Panel>
                {/* {chatTemplate ? (
                  <MessagesChat dialogue={dialogue} />
                ) : (
                  <MessagesContent />
                )} */}
                <FallbackDevelopment
                  text={
                    <>
                      Внутренний чат уже готов. Мы включим эту функцию сразу,
                      как только закончим приложения. <br />
                      <br />
                      <a
                        target="_blank"
                        className="text-blue hover:text-bluelight"
                        href="https://t.me/FLATEPRO"
                      >
                        Подпишитесь на наши новости в телеграм. Там мы постим
                        анонсы и пишем о важных вещах
                      </a>
                    </>
                  }
                />
              </Tab.Panel>
              <Tab.Panel>
                <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
                  <NotificationsContent
                    items={notifications}
                    userId={user?.id}
                    updateCallback={updateCallback}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      ) : (
        <Container>
          <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
            <ProfileSidebarTemplate />
            <div className="flex flex-col w-full">
              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <div>
                  <div className="relative mb-2.5">
                    <Tab.List>
                      <div className="flex justify-start gap-8">
                        
                        <Tab as={Fragment}>
                          {({ selected }) => (
                            <div>
                              <button
                                className={
                                  selected
                                      ? "bg-primary text-white px-[15px] py-[10px] whitespace-nowrap rounded-[10px] border border-primary"
                                      : "text-primary border border-primary/10 whitespace-nowrap rounded-[10px] px-[15px] py-[10px] active:border-primary/10"
                              }
                              >
                                <span className="relative">
                                  Уведомления
                                  {unreadNotificationsCount > 0 && (
                                    <div className="absolute right-[-10px] top-[-1px] bg-red rounded-full w-2 h-2 text-white text-exs flex justify-center items-center"></div>
                                  )}
                                </span>
                              </button>
                            </div>
                          )}
                        </Tab>
                      </div>
                    </Tab.List>
                  </div>
                </div>

                <Tab.Panels>
                  <Tab.Panel>
                    <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
                      <NotificationsContent
                        items={notifications}
                        userId={user?.id}
                        updateCallback={updateCallback}
                      />
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </Container>
      )}
    </MotionContainer>
  );
}
