import { useState } from "react";
import { motion } from "framer-motion";

export default function Checkbox({callback, defaultValue, formFields, formFieldName, setFormFields}) {
  const [isOn, setIsOn] = useState(defaultValue ? defaultValue : null);

  const toggleSwitch = () => { 
    setIsOn(!isOn); 
    
    if(callback) {
      callback(!isOn)
    }
    
    if(formFields && setFormFields && formFieldName) {
      setFormFields({...formFields, [formFieldName]: !isOn})
    }
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  // console.log(isOn);
  
  return (
    <>
      <div
        className={`w-10 h-5 flex justify-start rounded p-0.5 cursor-pointer ${ isOn ? 'justify-end bg-blue' : "bg-greymiddle" }`}
        onClick={() => toggleSwitch()}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded"
          layout
          transition={spring}
        />
      </div>
    </>
  );
}