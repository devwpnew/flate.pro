import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Container from "@modules/common/components/container/container";
import getLayout from "helpers/getLayout";
import AddHeader from "../part/addHeader";
import AddForm from "../part/addForm";
import Sidebar from "@modules/sidebar/components/sidebar";
import { CheckboxCheck } from "@modules/common/components/checkbox/checkboxCheck";

export default function AddTemplate({ user }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  // SIDEBAR STATES
  // const [isNameFilled, setIsNameField] = useState(null);
  const [isCategoryFilled, setIsCategoryFilled] = useState(false);
  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [isContactsFilled, setIsContactsFilled] = useState(false);
  const [isConnectFilled, setIsConnectFilled] = useState(false);
  const [isAboutFilled, setIsAboutFilled] = useState(false);
  const [isPhotosFilled, setIsPhotosFilled] = useState(false);
  const [isDescriptionFilled, setIsDescriptionFilled] = useState(false);
  const [isDealFilled, setIsDealFilled] = useState(false);
  // END SIDEBAR

  // const formCallback = async  (currentFields, previewGalery) => {

  //   /* Category Checkbox */
  //   const category = currentFields.section_relation
  //   if(category == 3 || category == 4 || category == 5){
  //     setIsCategoryFilled(true)
  //   }else if(currentFields.name && currentFields.name.length >= 3){
  //     setIsCategoryFilled(true)
  //   }else{
  //     setIsCategoryFilled(false)
  //   }
  //   /* Category Checkbox */

  //   /* Address Checkbox */
  //   if(currentFields.property_product_address && currentFields.property_product_address.length > 0){
  //     setIsAddressFilled(true)
  //   }else{
  //     setIsAddressFilled(false)
  //   }
  //   /* Address Checkbox */

  //   /* Contacts Checkbox */
  //   if(currentFields.product_phone && currentFields.product_phone.length > 0){
  //     setIsContactsFilled(true)
  //   }else{
  //     setIsContactsFilled(false)
  //   }
  //   /* Contacts Checkbox */

  //   /* Connect Checkbox */
  //   setIsConnectFilled(true)
  //   /* Connect Checkbox */

  //   /* About Checkbox */
  //   if(category == 3){
  //     if(currentFields.property_product_floor && currentFields.flat_floors && currentFields.living_squares){
  //       setIsAboutFilled(true)
  //     }else{
  //       setIsAboutFilled(false)
  //     }
  //   }else if(category == 4){
  //     if( currentFields.living_squares && currentFields.land_squares ){
  //       setIsAboutFilled(true)
  //     }else{
  //       setIsAboutFilled(false)
  //     }
  //   } else if (category == 5){
  //     if(currentFields.land_squares){
  //       setIsAboutFilled(true)
  //     }else{
  //       setIsAboutFilled(false)
  //     }
  //   } else if (category == 6) {
  //     if(currentFields.object_squares){
  //       setIsAboutFilled(true)
  //     }else{
  //       setIsAboutFilled(false)
  //     }
  //   } else if (category == 7) {
  //     if(currentFields.parking_types == 1){
  //       setIsAboutFilled(true)
  //     }else if(currentFields.object_squares){
  //       setIsAboutFilled(true)
  //     }else{
  //       setIsAboutFilled(false)
  //     }
  //   } else if( typeof category != 'undefined' ) {
  //     setIsAboutFilled(true)
  //   }else{
  //     setIsAboutFilled(false)
  //   }
  //   /* About Checkbox */

  //   /* Photos Checkbox */
  //   if(previewGalery && previewGalery.length > 0){
  //     setIsPhotosFilled(true)
  //   }else{
  //     setIsPhotosFilled(false)
  //   }
  //   /* Photos Checkbox */

  //   /* Description Checkbox */
  //   if(currentFields.product_description && currentFields.product_description.length >= 30){
  //     setIsDescriptionFilled(true)
  //   }else{
  //     setIsDescriptionFilled(false)
  //   }
  //   /* Description Checkbox */

  //   /* Deal Checkbox */
  //   if(category == 3){
  //     if( ( currentFields.comission == "Включена" && currentFields.comission_sum_terms && currentFields.product_price && currentFields.product_price.length > 0 ) ){
  //       setIsDealFilled(true)
  //     } else if (currentFields.comission != "Включена" && currentFields.product_price && currentFields.product_price.length > 0) {
  //       setIsDealFilled(true)
  //     } else{
  //       setIsDealFilled(false)
  //     }
  //   } else if(currentFields.product_price && currentFields.product_price.length > 0) {
  //     setIsDealFilled(true)
  //   } else {
  //     setIsDealFilled(false)
  //   }
  //   /* Deal Checkbox */

  //   // setFormFields(currentFields)
  //   // setIsAddressFilled(true)
  //   // setIsContactsFilled(true)
  // }

  return (
    <motion.div
      initial="init"
      animate="show"
      exit="hide"
      variants={VARIANTS}
      className={
        MOBILE ? "bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20"
          : ''
      }
    >
      <AddHeader />

      <Container>
        <div className="lg:flex lg:flex-start lg:justify-between lg:gap-2.5">
          <AddForm user={user} />
          {/* <div className="hidden lg:block min-w-[235px] w-[235px] relative">
            <div className="fixed right top">
              <Sidebar title={"Обязательно для заполнения"} hideFooter={true}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'categoryCheckbox'} disabled={true} checked={isCategoryFilled} />
                    <div className="text-sm">Категория</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'addressCheckbox'} disabled={true} checked={isAddressFilled} />
                    <div className="text-sm">Адрес</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'contactCheckbox'} disabled={true} checked={isContactsFilled} />
                    <div className="text-sm">Контакты</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'connectCheckbox'} disabled={true} checked={isConnectFilled} />
                    <div className="text-sm">Способ связи</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'aboutCheckbox'} disabled={true} checked={isAboutFilled} />
                    <div className="text-sm">Об объекте</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'photosCheckbox'} disabled={true} checked={isPhotosFilled} />
                    <div className="text-sm">Фотографии</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'descCheckbox'} disabled={true} checked={isDescriptionFilled} />
                    <div className="text-sm">Описание</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckboxCheck key={'dealCheckbox'} disabled={true} checked={isDealFilled} />
                    <div className="text-sm">Условия сделки</div>
                  </div>
                </div>
              </Sidebar>
            </div>
          </div> */}
        </div>
      </Container>
    </motion.div>
  );
}
// export async function getServerSideProps(context) {
//   const data = {};

//   const getSectionsFields = {
//       table: "sections",
//       filter: {
//         active: true,
//       },
//       sort: { sort: "ASC" },
//       limit: 'all',
//       select: [
//         "id",
//         "slug",
//         "name",
//         "parent_category",
//       ],
//   };

//   const sections = await getData(getSectionsFields);
//   if(sections){
//     data.sections = sections;
//   }
//   // return { props: { data: data } };
// }
