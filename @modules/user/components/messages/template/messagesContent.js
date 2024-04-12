import API from "pages/api/service/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Container from "@modules/common/components/container/container";

import MessageItem from "../item/messageItem";
import Preloader from "@modules/common/components/preloader/preloader";

export default function MessagesContent() {
  const user = useSelector((state) => state.userLogin.value);

  const [isLoading, setIsLoading] = useState(null);
  const [dialogues, setDialogues] = useState(null);

  useEffect(() => {
    (async function fetchDialogues() {
      setIsLoading(true);

      const getDialogues = await API.get.dialogue({
        filter: { logicOr: { from_user: user.id, to_user: user.id } },
        sort: { date_created: "DESC" },
      });
      setDialogues(getDialogues);

      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <Container>
        <>
          <div className="md:bg-greylight p-[15px] flex flex-col gap-2.5 md:gap-[15px] rounded shadow-lg relative">
            <MessageItem
              name={"Поддержка Flate.pro"}
              title={"Будем рады помочь"}
              isAdmin={true}
              isLastChild={!dialogues}
            />

            {isLoading ? (
              <div className="h-[73px] w-full">
                <Preloader />
              </div>
            ) : (
              <>
                {dialogues &&
                  dialogues.map((dialogue, index, array) => {
                    const isLastChild = index + 1 === dialogues.length;
                    return (
                      <MessageItem
                        key={dialogue.id}
                        dialogue={dialogue}
                        user={user}
                        isLastChild={isLastChild}
                      />
                    );
                  })}
              </>
            )}
          </div>
        </>
      </Container>
    </>
  );
}
