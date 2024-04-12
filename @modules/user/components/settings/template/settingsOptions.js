import Container from "@modules/common/components/container/container";
import Checkbox from "@modules/common/components/checkbox/checkbox";

export default function SettingsOptions() {
  return (
    <Container>
      <div className="mb-2.5 font-bold">Настройка email уведомлений</div>
      <div className="mb-5 text-sm">
        Системные уведомления приходят без возможности отписки от них.
      </div>
      <div className="pb-4 border-b-greyborder">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm">Платные услуги</div>
            <div className="text-sm text-grey">
              Изменения статусов подключенных услуг
            </div>
          </div>
          <Checkbox />
        </div>
      </div>
      <div className="pb-4 border-b-greyborder">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm">Платные услуги</div>
            <div className="text-sm text-grey">
              Изменения статусов подключенных услуг
            </div>
          </div>
          <Checkbox />
        </div>
      </div>
      <div className="pb-4 border-b-greyborder">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm">Платные услуги</div>
            <div className="text-sm text-grey">
              Изменения статусов подключенных услуг
            </div>
          </div>
          <Checkbox />
        </div>
      </div>
    </Container>
  );
}
