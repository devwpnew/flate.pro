import React, { useState, useRef } from "react";

const FormUpload = ({ path, name, onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];

            setUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("path", path);
            formData.append("name", name);

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_V2}/file/upload/single`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(
                        "File uploaded successfully, public URL:",
                        data.publicUrl
                    ); // Log image URL
                    onUploadComplete(data.publicUrl); // Call onUploadComplete with the public URL
                } else {
                    console.error("File upload failed");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <button
                className="bg-blue text-white px-4 py-2 rounded-lg"
                onClick={handleButtonClick}
                disabled={uploading}
            >
                {uploading ? "Загрузка..." : "Загрузить видео"}
            </button>
        </div>
    );
};

export default FormUpload;
