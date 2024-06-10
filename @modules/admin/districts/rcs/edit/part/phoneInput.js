import React, { useState } from "react";

const PhoneInput = ({ initialPhones = [], onChange }) => {
    const [phones, setPhones] = useState(Array.isArray(initialPhones) ? initialPhones : []);

    const handlePhoneChange = (index, field, value) => {
        const newPhones = phones.map((phone, i) =>
            i === index ? { ...phone, [field]: value } : phone
        );
        setPhones(newPhones);
        onChange(newPhones);
    };

    const addPhone = () => {
        setPhones([...phones, { phone: "", whatsapp: false }]);
    };

    const removePhone = (index) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones);
        onChange(newPhones);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <h4>Телефоны</h4>
                <button
                    type="button"
                    onClick={addPhone}
                    className="bg-blue/40 text-white h-8 w-8 text-xl rounded-full"
                >
                    +
                </button>
            </div>
            {phones.length > 0 ? (
                phones.map((phone, index) => (
                    <div key={index} className="mb-4 w-full">
                        <div className="flex gap-5">
                            <input
                                type="text"
                                className="w-[500px] h-11 border-greyborder border px-3"
                                placeholder="Телефон"
                                value={phone.phone}
                                onChange={(e) =>
                                    handlePhoneChange(index, "phone", e.target.value)
                                }
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={phone.whatsapp}
                                    onChange={(e) =>
                                        handlePhoneChange(index, "whatsapp", e.target.checked)
                                    }
                                />
                                <span>WhatsApp</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removePhone(index)}
                                className="bg-red/20 px-4 rounded-lg"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Не указано ни одного телефона</p>
            )}
        </div>
    );
};

export default PhoneInput;
