import { Dialog } from "@headlessui/react";
import BackButton from "@modules/common/components/button/backButton";
import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import H1 from "@modules/common/components/heading/h1";
import Input from "@modules/common/components/input/input";
import MapSuggestedInput from "@modules/common/components/map/mapSuggestedInput";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Textarea from "@modules/common/components/textarea/textarea";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";
import FieldImages from "@modules/user/components/add/part/fields/fieldImages";
import { formateDate } from "helpers/formateDate";
import getLayout from "helpers/getLayout";
import { useRouter } from "next/router";
import api from "pages/api/service/api";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Checkbox from "@modules/common/components/checkbox/checkbox";
//import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import HeadlessMultiSelect from "@modules/common/components/select/listBox/headlessMultiSelect";

import VideoUpload from "@modules/common/components/video/Upload";
import VideoPlayer from "@modules/common/components/video/Player";

import PhoneInput from "@modules/admin/districts/rcs/edit/part/phoneInput";

export default function EditRcsTemplate({ rcId }) {
    const router = useRouter();
    const { MOBILE, DESKTOP, VARIANTS } = getLayout();
    const user = useSelector((state) => state.userLogin.value);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedCity, setSelectedCity] = useState({ name: "Сочи", id: 5 });
    const [selectedParentArea, setSelectedParentArea] = useState(null);
    const [selectedMicroArea, setSelectedMicroArea] = useState(null);

    const [microAreasList, setMicroAreasList] = useState(null);
    const [areasParentsList, setAreasParentsList] = useState(null);
    const [citiesList, setCitiesList] = useState(null);

    const [rc, setRc] = useState(null);
    const [publishedValues, setPublishedValues] = useState(null);

    const formRef = useRef(null);
    const [fields, setFields] = useState({});

    const [mapAddress, setMapAddress] = useState("");

    const [rcTypesList, setRcTypesList] = useState(null);

    const [documentType, setDocumentType] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [rating, setRating] = useState(null);

    useEffect(() => {
        (async function fetchRcTypes() {
            const getRcTypesList = await api.get.rcTypes({
                sort: { id: "asc" },
            });
            setRcTypesList(getRcTypesList);
        })();
    }, []);

    const [rcClassesList, setRcClassesList] = useState(null);

    useEffect(() => {
        (async function fetchRcClasses() {
            const getRcClassesList = await api.get.rcClasses({
                sort: { id: "asc" },
            });
            setRcClassesList(getRcClassesList);
        })();
    }, []);

    useEffect(() => {
        (async function fetchCities() {
            const getCitiesList = await api.get.cities({ sort: { id: "asc" } });
            setCitiesList(getCitiesList);
        })();
    }, []);

    useEffect(() => {
        (async function fetchAreas() {
            setIsLoading(true);
            const getAreasList = await api.get.areas({
                filter: { link_city: selectedCity.id, parent_area: "null" },
                limit: "all",
            });
            setAreasParentsList(getAreasList);

            setIsLoading(false);
        })();
    }, [selectedCity]);

    useEffect(() => {
        (async function fetchCities() {
            if (!selectedCity || !selectedParentArea) return;

            const getMicroAreasList = await api.get.areas({
                window_host: window.location.origin,
                filter: {
                    city_link: selectedCity.id,
                    parent_area: selectedParentArea.id,
                },
                sort: {
                    id: "asc",
                },
                limit: "all",
            });

            setMicroAreasList(getMicroAreasList);
        })();
    }, [selectedParentArea, selectedCity]);

    useEffect(() => {
        (async function fetchRcs() {
            if (rcId != "add") {
                const getRc = await api.get.rcs({
                    window_host: window.location.origin,
                    filter: { id: rcId },
                    limit: 1,
                    limit: "all",
                });
                if (getRc) {
                    setRc(getRc[0]);
                }
            }
            const getCitiesList = await api.get.cities({ sort: { id: "asc" } });
            setCitiesList(getCitiesList);
            const getPubInfo = await api.get.fieldInfo("rcs", "published");
            setPublishedValues(
                getPubInfo.descObj.result_options.map((value, index) => {
                    return { id: index, name: value };
                })
            );
        })();
    }, [rcId]);

    const changeFields = (event, forceName = false, forceValue = false) => {
        //console.log("changeFields", event);
        let currentFields = fields;

        if (forceName && forceValue) {
            currentFields[forceName] = forceValue;
        } else if (Array.isArray(event)) {
            // Если событие - это массив телефонов
            currentFields["sales_contacts"] = event;
        } else if (typeof event === "function") {
            const callbackEvent = event();
            if (callbackEvent) {
                if (callbackEvent.name && callbackEvent.value != null) {
                    currentFields[callbackEvent.name] = callbackEvent.value;
                }
            }
        } else if (event) {
            if (event.target) {
                if (event.target.files) {
                    currentFields[event.target.name] = event.target.files;
                } else if (event.target.value) {
                    currentFields[event.target.name] = event.target.value;
                }
            }
        }

        setFields(currentFields);
    };

    const sendForm = async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);

        for (const key in fields) {
            if (key === "images") {
                const galleryFiles = fields[key];
                const galleryFilesResult = [];

                if (
                    galleryFiles &&
                    galleryFiles.length > 0 &&
                    galleryFiles[0].name !== ""
                ) {
                    galleryFiles.forEach((file) => {
                        galleryFilesResult.push(file);
                    });

                    formData.delete("images");

                    galleryFilesResult.forEach((file) => {
                        formData.append("images", file);
                    });
                }
            } else if (key === "sales_contacts") {
                formData.set(key, JSON.stringify(fields[key]));
            } else {
                formData.set(key, fields[key]);
            }
        }

        if (selectedCity) {
            formData.set("city_link", selectedCity.id);
        }

        if (selectedParentArea?.id) {
            formData.set("area_link", selectedParentArea.id);
        }

        if (selectedMicroArea?.id) {
            formData.set("area_link", selectedMicroArea.id);
        }

        const action = formRef.current.getAttribute("name");
        if (action === "editAd" && rc && user) {
            formData.append("id", rc.id);
            const res = await api.update.rcs(formData, true);
            if (res) {
                alert("ЖК успешно изменён");
            }
        } else if (action === "addAd") {
            const res = await api.add.rcs(formData, true);
            if (res) {
                alert("ЖК успешно добавлен");
            }
        }
    };

    const deleteRcItem = async (e) => {
        e.preventDefault();
        const res = await api.remove.rcs(rcId);
        if (res) {
            if (res.Error) {
                alert(res.Error);
            } else {
                alert("ЖК успешно удален");
                router.push("/user/admin/rcs/");
            }
        }
    };

    const handleMapCoordinatesChange = (coords) => {
        if (!coords) return;
        const coordsJson = JSON.stringify(coords);
        setFields({ ...fields, coordinates: coordsJson });
    };

    const [defValueParent, setDefValueParent] = useState(null);
    const [defValue, setDefValue] = useState(null);

    useEffect(() => {
        if (rc) {
            const rcInfo = rc;

            if (rcInfo.area_link?.parent_area) {
                setDefValueParent(rcInfo.area_link?.parent_area);
            }

            if (rcInfo.area_link?.id) {
                setDefValue(rcInfo.area_link?.id);
            }

            setFz214(rcInfo.fz214);
            setSoldout(rcInfo.soldout);
            setTrustManagement(rcInfo.trust_management);
            //setDocumentType(rcInfo.document_type);
            //setPaymentType(rcInfo.payment_type);
            //setRating(rcInfo.rating);

            setFields({
                ...fields,
                published: rcInfo.published,
                type_id: rcInfo.type_id,
                class_id: rcInfo.class_id,
                fz214: rcInfo.fz214 || false,
                soldout: rcInfo.soldout || false,
                trust_management: rcInfo.trust_management || false,
                //document_type: rcInfo.document_type || [],
                //payment_type: rcInfo.payment_type || [],
                //rating: rcInfo.rating || null,
            });
        }
    }, [rc]);

    useEffect(() => {
        if (rc) {
            setDocumentType(rc.document_type);
            setPaymentType(rc.payment_type);
            setRating(rc.rating);
        }
    }, [rc]);

    const [status, setStatus] = useState(rc?.status || "");

    const handleStatusChange = (selectedStatus) => {
        setStatus(selectedStatus);
        changeFields({ target: { name: "status", value: selectedStatus } });
    };

    const [fz214, setFz214] = useState(false);
    const [soldout, setSoldout] = useState(false);
    const [trustManagement, setTrustManagement] = useState(false);

    const handleFz214Change = () => {
        setFz214(!fz214);
        setFields((prevFields) => ({
            ...prevFields,
            fz214: !fz214,
        }));
    };

    const handleSoldoutChange = () => {
        setSoldout(!soldout);
        setFields((prevFields) => ({
            ...prevFields,
            soldout: !soldout,
        }));
    };

    const handleTrustManagementChange = () => {
        setTrustManagement(!trustManagement);
        setFields((prevFields) => ({
            ...prevFields,
            trust_management: !trustManagement,
        }));
    };

    const handleDocumentTypeChange = (selectedIds) => {
        setDocumentType(selectedIds);
        //changeFields({ target: { name: "document_type", value: JSON.stringify(selectedIds) } });
        setFields((prevFields) => ({
            ...prevFields,
            document_type: JSON.stringify(selectedIds),
        }));
    };

    const handlePaymentTypeChange = (selectedIds) => {
        setPaymentType(selectedIds);
        setFields((prevFields) => ({
            ...prevFields,
            payment_type: JSON.stringify(selectedIds),
        }));
    };

    const handleRatingChange = (selectedRating) => {
        setRating(selectedRating);
        setFields((prevFields) => ({
            ...prevFields,
            rating: selectedRating,
        }));
    };

    const [uploadId, setUploadId] = useState(null);

    const checkPlaybackStatus = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_V2}/mux/get-by-rc-id/${rcId}`
            );
            const data = await response.json();
            return data.videos;
        } catch (error) {
            console.error("Error checking playback status:", error);
            return false;
        }
    };


    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const videosResponse = await checkPlaybackStatus();
            setVideos(videosResponse);
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        //console.log('timer start')
        if (uploadId) {
            const interval = setInterval(async () => {

                //console.log('iteration')

                const videosResponse = await checkPlaybackStatus();

                if (videosResponse.every((video) => video.playback_id)) {
                    clearInterval(interval);
                    console.log("All videos have playback IDs");
                    setVideos(videosResponse);
                    setUploadId(null);
                }
            }, 5000); // Check every 10 seconds

            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, [uploadId]);

    // console.log(defValueParent, "defValueParent", defValue, "defValue");
    // console.log(rc);

    //console.log(mapAddress);

    return (
        <>
            <div className="w-full">
                {rc || rcId == "add" ? (
                    <Container>
                        <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
                            {rc ? (
                                <H1>Редактировать {rc.name}</H1>
                            ) : (
                                <H1>Добавить ЖК</H1>
                            )}
                        </div>

                        {/* <pre>{JSON.stringify(fields)}</pre> */}

                        <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
                            <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder">
                                <div className="flex flex-col gap-5 mb-[35px]">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">
                                            Дата создания
                                        </span>
                                        <span className="text-grey text-sm">
                                            {rc?.date_created &&
                                                formateDate(rc.date_created)}
                                        </span>
                                    </div>
                                    {rc && rc.date_edited && (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">
                                                Последний раз редактировалось
                                            </span>
                                            {rc.last_edited_by ? (
                                                <Link
                                                    href={`/user/admin/users/${rc.last_edited_by.id}`}
                                                >
                                                    <a
                                                        className="text-blue cursor-pointer hover:underline underline-offset-2"
                                                        href={`/user/admin/users/${rc.last_edited_by.id}`}
                                                    >
                                                        <div>
                                                            ID:{" "}
                                                            {`${rc.last_edited_by.id} `}
                                                        </div>
                                                        <div>
                                                            {rc.last_edited_by
                                                                .name
                                                                ? rc
                                                                      .last_edited_by
                                                                      .name
                                                                : rc
                                                                      .last_edited_by
                                                                      .phone}
                                                        </div>
                                                    </a>
                                                </Link>
                                            ) : (
                                                ""
                                            )}
                                            <span className="text-grey text-sm">
                                                {rc?.date_edited &&
                                                    formateDate(rc.date_edited)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {rc && (
                                    <div className="flex flex-col gap-5">
                                        <span
                                            className="font-semibold text-sm cursor-pointer hover:underline"
                                            onClick={deleteRcItem}
                                        >
                                            Удалить ЖК
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full px-5">
                                <form
                                    onSubmit={sendForm}
                                    encType="multipart/form-data"
                                    ref={formRef}
                                    name={rc ? "editAd" : "addAd"}
                                >
                                    <div className="block w-full">
                                        <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                                            <div className="font-bold mb-2.5 text-sm">
                                                Название
                                            </div>
                                            <div className="mb-5">
                                                <Input
                                                    style={
                                                        "w-full h-11 border-greyborder border"
                                                    }
                                                    name={"name"}
                                                    defaultValue={rc && rc.name}
                                                    required={true}
                                                    minLength={3}
                                                    placeholder={"Название ЖК"}
                                                    onChange={changeFields}
                                                />
                                            </div>

                                            <div className="font-bold mb-2.5 text-sm">
                                                Название (ENG)
                                            </div>
                                            <div className="mb-5">
                                                <Input
                                                    style={
                                                        "w-full h-11 border-greyborder border"
                                                    }
                                                    name={"second_name"}
                                                    defaultValue={
                                                        rc && rc.second_name
                                                    }
                                                    required={false}
                                                    minLength={3}
                                                    placeholder={"Название ЖК"}
                                                    onChange={changeFields}
                                                />
                                            </div>

                                            <div className="font-bold mb-2.5 text-sm">
                                                Город
                                            </div>
                                            <div className="mb-5">
                                                <SelectNoAutocomplete
                                                    style={
                                                        "w-full min-h-[40px] border-greyborder border"
                                                    }
                                                    name={"city_link"}
                                                    type={"Город"}
                                                    defaultOption={
                                                        rc &&
                                                        rc.city_link &&
                                                        citiesList &&
                                                        citiesList.find(
                                                            (city) =>
                                                                city.id ===
                                                                rc.city_link.id
                                                        )
                                                    }
                                                    addCallback={changeFields}
                                                    options={citiesList}
                                                    callback={setSelectedCity}
                                                />
                                            </div>

                                            {areasParentsList &&
                                            areasParentsList.length ? (
                                                <div className="my-2.5">
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Район
                                                    </div>
                                                    <SelectNoAutocomplete
                                                        style={
                                                            "w-full min-h-[40px] border-greyborder border"
                                                        }
                                                        nullable={true}
                                                        options={[
                                                            {
                                                                name: "Не указывать",
                                                                id: "",
                                                            },
                                                            ...areasParentsList,
                                                        ]}
                                                        callback={
                                                            setSelectedParentArea
                                                        }
                                                        defaultValue={
                                                            defValueParent
                                                                ? defValueParent
                                                                : defValue
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                ""
                                            )}

                                            {microAreasList &&
                                            microAreasList.length ? (
                                                <div className="my-2.5">
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Микрорайон
                                                    </div>
                                                    <SelectNoAutocomplete
                                                        style={
                                                            "w-full min-h-[40px] border-greyborder border"
                                                        }
                                                        nullable={true}
                                                        options={[
                                                            {
                                                                name: "Не указывать",
                                                                id: "",
                                                            },
                                                            ...microAreasList,
                                                        ]}
                                                        callback={
                                                            setSelectedMicroArea
                                                        }
                                                        defaultValue={
                                                            defValueParent
                                                                ? defValue
                                                                : null
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                ""
                                            )}

                                            <div className="font-bold mb-2.5 text-sm">
                                                Адрес
                                            </div>

                                            <Input
                                                style={
                                                    "w-full h-11 border-greyborder border "
                                                }
                                                name={"address"}
                                                defaultValue={rc && rc.address}
                                                required={true}
                                                placeholder={"Укажите адрес*"}
                                                // onChange={changeFields}
                                                id={"suggest-address"}
                                            />

                                            <div className="mt-2">
                                                <MapSuggestedInput
                                                    inputId={"suggest-address"}
                                                    address={mapAddress}
                                                    setAddress={setMapAddress}
                                                    handleMapCoordinatesChange={
                                                        handleMapCoordinatesChange
                                                    }
                                                />
                                            </div>

                                            <div className="font-bold text-sm my-2.5">
                                                Форма фиксации
                                            </div>
                                            <div className="mb-5">
                                                <Textarea
                                                    name="fixing_form"
                                                    onChange={changeFields}
                                                    defaultValue={
                                                        (rc &&
                                                            rc.fixing_form) ||
                                                        `АН:
АГЕНТ:
ТЕЛЕФОН АГЕНТА:
ПОКУПАТЕЛЬ:
ТЕЛЕФОН ПОКУПАТЕЛЯ:
КОММЕНТАРИЙ:`
                                                    }
                                                    style={
                                                        "py-2.5 border-greyborder border rounded"
                                                    }
                                                    areaStyle={"rounded h-32"}
                                                    placeholder={
                                                        "Форма фиксации"
                                                    }
                                                />
                                            </div>

                                            <div className="font-bold text-sm my-2.5">
                                                Описание
                                            </div>
                                            <div className="mb-5">
                                                <Textarea
                                                    name="description"
                                                    onChange={changeFields}
                                                    defaultValue={
                                                        rc && rc.description
                                                    }
                                                    style={
                                                        "py-2.5 border-greyborder border rounded"
                                                    }
                                                    areaStyle={"rounded h-64"}
                                                    placeholder={"Описание ЖК"}
                                                />
                                            </div>

                                            <div className="font-bold text-sm my-2.5">
                                                Дополнительно
                                            </div>
                                            <div className="mb-5">
                                                <Textarea
                                                    name="details"
                                                    onChange={changeFields}
                                                    defaultValue={
                                                        rc && rc.details
                                                    }
                                                    style={
                                                        "py-2.5 border-greyborder border rounded"
                                                    }
                                                    areaStyle={"rounded h-11"}
                                                    placeholder={
                                                        "Дополнительно"
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <div className="font-bold mb-2.5 text-sm">
                                                    Застройщик
                                                </div>
                                                <div className="mb-5">
                                                    <Input
                                                        style={
                                                            "w-full h-11 border-greyborder border "
                                                        }
                                                        name={"builder"}
                                                        defaultValue={
                                                            rc && rc.builder
                                                        }
                                                        placeholder={
                                                            "Застройщик"
                                                        }
                                                        onChange={changeFields}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div>
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Статус
                                                    </div>
                                                    <div>
                                                        <SelectNoAutocomplete
                                                            style="w-full h-[45px] border-greyborder border"
                                                            nullable={true}
                                                            options={[
                                                                {
                                                                    name: "Не сдан",
                                                                    id: 2,
                                                                },
                                                                {
                                                                    name: "Сдан",
                                                                    id: 1,
                                                                },
                                                            ]}
                                                            addCallback={
                                                                handleStatusChange
                                                            }
                                                            name="status"
                                                            defaultValue={
                                                                rc && rc?.status
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {status === 1 && (
                                                    <div>
                                                        <div className="font-bold mb-2.5 text-sm">
                                                            Год постройки
                                                        </div>
                                                        <div className="mb-5">
                                                            <Input
                                                                style={
                                                                    "w-full h-11 border-greyborder border "
                                                                }
                                                                name={
                                                                    "build_year"
                                                                }
                                                                defaultValue={
                                                                    rc &&
                                                                    rc.build_year
                                                                }
                                                                placeholder={
                                                                    "Год"
                                                                }
                                                                onChange={
                                                                    changeFields
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {status === 2 && (
                                                    <>
                                                        <div>
                                                            <div className="font-bold mb-2.5 text-sm">
                                                                Плановая дата
                                                                сдачи
                                                            </div>
                                                            <div className="">
                                                                <Input
                                                                    style={
                                                                        "w-full h-11 border-greyborder border "
                                                                    }
                                                                    name={
                                                                        "build_date_planned"
                                                                    }
                                                                    defaultValue={
                                                                        rc &&
                                                                        rc.build_date_planned
                                                                    }
                                                                    placeholder={
                                                                        "Плановая дата сдачи"
                                                                    }
                                                                    onChange={
                                                                        changeFields
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    fields.fz214
                                                                }
                                                                onChange={
                                                                    handleFz214Change
                                                                }
                                                            />
                                                            <label className="font-bold text-sm">
                                                                ФЗ 214
                                                            </label>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="mt-4 grid md:grid-cols-2 gap-5">
                                                <div>
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Оформление
                                                    </div>
                                                    <div>
                                                        {/* {JSON.stringify(documentType)} */}
                                                        <HeadlessMultiSelect
                                                            options={[
                                                                {
                                                                    name: "ДКП",
                                                                    id: 1,
                                                                },
                                                                {
                                                                    name: "ДДУ",
                                                                    id: 2,
                                                                },
                                                                {
                                                                    name: "Преддоговор",
                                                                    id: 3,
                                                                },
                                                                {
                                                                    name: "Другое",
                                                                    id: 4,
                                                                },
                                                            ]}
                                                            selectedOptions={
                                                                documentType ||
                                                                []
                                                            }
                                                            onChange={
                                                                handleDocumentTypeChange
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Варианты оплаты
                                                    </div>
                                                    <div>
                                                        {/* {JSON.stringify(paymentType)} */}
                                                        <HeadlessMultiSelect
                                                            options={[
                                                                {
                                                                    name: "Ипотека",
                                                                    id: 1,
                                                                },
                                                                {
                                                                    name: "Рассрочка",
                                                                    id: 2,
                                                                },
                                                                {
                                                                    name: "Мат. капитал",
                                                                    id: 3,
                                                                },
                                                                {
                                                                    name: "Военная ипотека",
                                                                    id: 4,
                                                                },
                                                                {
                                                                    name: "Гос. поддержка",
                                                                    id: 5,
                                                                },
                                                                {
                                                                    name: "Другое",
                                                                    id: 6,
                                                                },
                                                            ]}
                                                            selectedOptions={
                                                                paymentType ||
                                                                []
                                                            }
                                                            onChange={
                                                                handlePaymentTypeChange
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Комиссия
                                                    </div>
                                                    <div>
                                                        <Input
                                                            style={
                                                                "w-full h-11 border-greyborder border "
                                                            }
                                                            name={"commission"}
                                                            defaultValue={
                                                                rc &&
                                                                rc.commission
                                                            }
                                                            placeholder={
                                                                "Комиссия"
                                                            }
                                                            onChange={
                                                                changeFields
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Ссылка на презентацию
                                                    </div>
                                                    <div>
                                                        <Input
                                                            style={
                                                                "w-full h-11 border-greyborder border "
                                                            }
                                                            name={
                                                                "presentation_link"
                                                            }
                                                            defaultValue={
                                                                rc &&
                                                                rc.presentation_link
                                                            }
                                                            placeholder={
                                                                "Ссылка на презентацию"
                                                            }
                                                            onChange={
                                                                changeFields
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Ссылка на шахматку
                                                    </div>
                                                    <div>
                                                        <Input
                                                            style={
                                                                "w-full h-11 border-greyborder border "
                                                            }
                                                            name={
                                                                "checkerboard_link"
                                                            }
                                                            defaultValue={
                                                                rc &&
                                                                rc.checkerboard_link
                                                            }
                                                            placeholder={
                                                                "Ссылка на шахматку"
                                                            }
                                                            onChange={
                                                                changeFields
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex gap-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={fields.soldout}
                                                        onChange={
                                                            handleSoldoutChange
                                                        }
                                                    />
                                                    <label className="font-bold text-sm">
                                                        Все лоты проданы
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mt-5 border border-[#d5d5d5] rounded-2xl p-5">
                                                <div className="grid md:grid-cols-2 gap-3 items-center">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                fields.trust_management
                                                            }
                                                            onChange={
                                                                handleTrustManagementChange
                                                            }
                                                        />
                                                        <label className="font-bold text-sm">
                                                            Доверительное
                                                            управление
                                                        </label>
                                                    </div>

                                                    {fields.trust_management && (
                                                        <Input
                                                            style={
                                                                "w-full h-11 border-greyborder border "
                                                            }
                                                            name={
                                                                "trust_management_operator"
                                                            }
                                                            defaultValue={
                                                                rc &&
                                                                rc.trust_management_operator
                                                            }
                                                            placeholder={
                                                                "Название оператора"
                                                            }
                                                            onChange={
                                                                changeFields
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-5 border border-[#d5d5d5] rounded-2xl p-5 mb-5">
                                                <h3 className="font-bold mb-2.5 text-xl">
                                                    Отдел продаж
                                                </h3>

                                                <div className="grid md:grid-cols-2 gap-5">
                                                    <div className="col-span-2">
                                                        <PhoneInput
                                                            name={
                                                                "sales_contacts"
                                                            }
                                                            initialPhones={
                                                                rc?.sales_contacts
                                                            }
                                                            onChange={
                                                                changeFields
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* {JSON.stringify(fields)} */}

                                            <div className="font-bold mb-2.5 text-sm">
                                                Опубликовано
                                            </div>
                                            <div className="mb-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {publishedValues &&
                                                        publishedValues.map(
                                                            (val) => (
                                                                <button
                                                                    type="button"
                                                                    key={val.id}
                                                                    onClick={() =>
                                                                        setFields(
                                                                            (
                                                                                prevFields
                                                                            ) => ({
                                                                                ...prevFields,
                                                                                published:
                                                                                    val.id,
                                                                            })
                                                                        )
                                                                    }
                                                                    className={`
                                                                    py-1.5 px-4 rounded-lg 
                                                                    ${
                                                                        fields.published ===
                                                                        val.id
                                                                            ? "bg-blue text-white"
                                                                            : "bg-backdrop/5"
                                                                    }
                                                                `}
                                                                >
                                                                    {val.name}
                                                                </button>
                                                            )
                                                        )}
                                                </div>
                                            </div>

                                            <div className="font-bold mb-2.5 text-sm">
                                                Тип объекта
                                            </div>
                                            <div className="mb-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {rcTypesList &&
                                                        rcTypesList.map(
                                                            (val) => (
                                                                <button
                                                                    type="button"
                                                                    key={val.id}
                                                                    onClick={() =>
                                                                        setFields(
                                                                            (
                                                                                prevFields
                                                                            ) => ({
                                                                                ...prevFields,
                                                                                type_id:
                                                                                    val.id,
                                                                            })
                                                                        )
                                                                    }
                                                                    className={`
                                                                    py-1.5 px-4 rounded-lg 
                                                                    ${
                                                                        fields.type_id ===
                                                                        val.id
                                                                            ? "bg-blue text-white"
                                                                            : "bg-backdrop/5"
                                                                    }
                                                                `}
                                                                >
                                                                    {val.name}
                                                                </button>
                                                            )
                                                        )}
                                                </div>
                                            </div>

                                            <div className="font-bold mb-2.5 text-sm">
                                                Класс объекта
                                            </div>
                                            <div className="mb-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {rcClassesList &&
                                                        rcClassesList.map(
                                                            (val) => (
                                                                <button
                                                                    type="button"
                                                                    key={val.id}
                                                                    onClick={() =>
                                                                        setFields(
                                                                            (
                                                                                prevFields
                                                                            ) => ({
                                                                                ...prevFields,
                                                                                class_id:
                                                                                    val.id,
                                                                            })
                                                                        )
                                                                    }
                                                                    className={`
                                                                    py-1.5 px-4 rounded-lg 
                                                                    ${
                                                                        fields.class_id ===
                                                                        val.id
                                                                            ? "bg-blue text-white"
                                                                            : "bg-backdrop/5"
                                                                    }
                                                                `}
                                                                >
                                                                    {val.name}
                                                                </button>
                                                            )
                                                        )}
                                                </div>
                                            </div>

                                            <div className="font-bold mb-2.5 text-sm">
                                                Рейтинг ЖК
                                            </div>
                                            <div className="mb-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        {
                                                            name: "Не выбрано",
                                                            id: 0,
                                                        },
                                                        {
                                                            name: "5",
                                                            id: 5,
                                                        },
                                                        {
                                                            name: "4",
                                                            id: 4,
                                                        },
                                                        {
                                                            name: "3",
                                                            id: 3,
                                                        },
                                                        {
                                                            name: "2",
                                                            id: 2,
                                                        },
                                                        {
                                                            name: "1",
                                                            id: 1,
                                                        },
                                                    ].map((val) => (
                                                        <button
                                                            type="button"
                                                            key={val.id}
                                                            onClick={() => {
                                                                setRating(
                                                                    val.id
                                                                );
                                                                setFields(
                                                                    (
                                                                        prevFields
                                                                    ) => ({
                                                                        ...prevFields,
                                                                        rating: val.id,
                                                                    })
                                                                );
                                                            }}
                                                            className={`
                                                                    py-1.5 px-4 rounded-lg 
                                                                    ${
                                                                        rating ===
                                                                        val.id
                                                                            ? "bg-blue text-white"
                                                                            : "bg-backdrop/5"
                                                                    }
                                                                `}
                                                        >
                                                            {val.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <FieldImages
                                                name={"images"}
                                                title={
                                                    <div className="font-bold mb-2.5 text-sm">
                                                        Фотографии
                                                    </div>
                                                }
                                                description={"   "}
                                                isRequired={false}
                                                setForm={setFields}
                                                form={fields}
                                                defaultImages={
                                                    rc?.images &&
                                                    JSON.parse(rc?.images)
                                                }
                                            />

                                            <div className="mt-10 border border-backdrop/20 rounded-xl p-5">
                                                <div className="font-bold mb-2.5 text-sm">
                                                    Видео
                                                </div>
                                                <VideoUpload
                                                    rcId={rcId}
                                                    onUploadSuccess={(
                                                        uploadId
                                                    ) => {
                                                        setUploadId(uploadId);
                                                        console.log(uploadId)
                                                    }}
                                                />

                                                {/* {uploadId ? 1 : 0}
                                                {videosEncoded ? 1 : 0} */}

                                                {uploadId && (
                                                    <div>
                                                        Обработка видео...
                                                    </div>
                                                )}

                                                
                                                {videos && videos.length > 0 && (
                                                    <div className="mt-5 grid grid-cols-3 gap-4">
                                                        {videos.map((val) => (
                                                            <VideoPlayer key={val.id} playbackId={val.playback_id} />
                                                        ))}
                                                    </div>
                                                )}




                                            </div>
                                        </div>
                                    </div>
                                    {!MOBILE && (
                                        <div className="flex justify-end w-full mt-[10px]">
                                            <div className="w-[130px] h-[33px]">
                                                <Button className="py-2">
                                                    Сохранить
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </Container>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full">
                        <PreloaderSpinner></PreloaderSpinner>
                    </div>
                )}
            </div>
        </>
    );
}
