import AdminInfo from "@modules/admin/sidebar/parts/adminInfo";
import Container from "@modules/common/components/container/container";

import getLayout from "helpers/getLayout";
export default function AdminSidebar() {
  const { MOBILE } = getLayout();
  
  return (
    <>
      {MOBILE ? (
        <>
          <Container>
            <AdminInfo />
          </Container>
        </>
      ) : (
        <div className="sticky left-0 top-[107px] pb-[18px]">
          <div className="bg-bluedeep max-w-[200px] min-w-[200px] w-[200px] lg:max-w-[230px] lg:min-w-[230px] lg:w-[230px]">
            <AdminInfo />
          </div>
        </div>
      )}
    </>
  );
}
