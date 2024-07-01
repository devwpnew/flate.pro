import { useState, useEffect, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import axios from "axios";

function SelectOrCreateAgency({ onSelectAgency, initialAgencyId }) {
    const [agencies, setAgencies] = useState([]);
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Fetch agencies from the API
        axios
            .get(`${process.env.NEXT_PUBLIC_API_V2}/agencies`)
            .then((response) => {
                setAgencies(response.data);
                // Set initial selected agency based on initialAgencyId
                if (initialAgencyId !== undefined) {
                    const initialAgency = response.data.find(
                        (agency) => agency.id === initialAgencyId
                    );
                    setSelectedAgency(initialAgency || null);
                }
            })
            .catch((error) => {
                console.error("Error fetching agencies:", error);
            });
    }, [initialAgencyId]);

    const filteredAgencies =
        query === ""
            ? agencies
            : agencies.filter((agency) =>
                  agency.name.toLowerCase().includes(query.toLowerCase())
              );

    const handleSelect = (agency) => {
        setSelectedAgency(agency);
        onSelectAgency(agency ? agency.id : null);
        setIsOpen(false);
    };

    const handleCreateAgency = () => {
        axios
            .post(`${process.env.NEXT_PUBLIC_API_V2}/agencies`, { name: query, token: "789hghj23sdfsdfsadfhghHDSFJho7y8tugfisdu9f" })
            .then((response) => {
                const newAgency = response.data;
                setAgencies([...agencies, newAgency]);
                handleSelect(newAgency);
            })
            .catch((error) => {
                console.error("Error creating agency:", error);
            });
    };

    return (
        <Combobox value={selectedAgency} onChange={handleSelect}>
            <div className="relative mt-1">
                <Combobox.Input
                    className="w-full border border-greyborder rounded-md shadow-sm px-4 py-2 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(agency) => agency ? agency.name : "Не работаю в агентстве"}
                    placeholder="Начните вводить название"
                    onClick={() => setIsOpen(true)}
                />
                <Transition
                    as={Fragment}
                    show={isOpen}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <Combobox.Option
                            value={null}
                            className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    active ? "bg-bluelight text-white" : "text-primary"
                                }`
                            }
                        >
                            {({ selected, active }) => (
                                <>
                                    <span
                                        className={`block truncate ${
                                            selected ? "font-medium" : "font-normal"
                                        }`}
                                    >
                                        Не работаю в агентстве
                                    </span>
                                    {selected ? (
                                        <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active ? "text-white" : "text-bluelight2"
                                            }`}
                                        >
                                            ✓
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </Combobox.Option>
                        {filteredAgencies.length === 0 && query !== "" ? (
                            <div 
                                onClick={handleCreateAgency} 
                                className="relative cursor-pointer select-none py-2 px-4 text-primary hover:bg-bluelight hover:text-white"
                            >
                                Создать агентство "{query}"
                            </div>
                        ) : (
                            filteredAgencies.map((agency) => (
                                <Combobox.Option
                                    key={agency.id}
                                    value={agency}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? "bg-bluelight text-white"
                                                : "text-primary"
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {agency.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        active
                                                            ? "text-white"
                                                            : "text-bluelight2"
                                                    }`}
                                                >
                                                    ✓
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}

export default SelectOrCreateAgency;
