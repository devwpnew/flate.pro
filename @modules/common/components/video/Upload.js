import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

const VideoUpload = ({ onUploadSuccess, rcId, tempId }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            await uploadFile(selectedFile);
        }
    };

    const uploadFile = async (file) => {
        setUploading(true);
        setError(null);

        try {
            console.log("MUX start upload client", rcId);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_V2}/mux/upload`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        rc_id: rcId,
                        temp_id: tempId, 
                    }),
                }
            );

            console.log(response);

            if (!response.ok) {
                throw new Error(
                    `Failed to get upload URL: ${response.statusText}`
                );
            }

            const data = await response.json();
            const uploadUrl = data.uploadUrl;
            const uploadId = data.uploadId;

            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            }

            onUploadSuccess(uploadId);
            setFile(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const buttonText = uploading
        ? "Идёт загрузка..."
        : "Добавить видео";

    return (
        <div className="video-upload-container">
            <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="video/*"
            />
            {!uploading && (
                <label htmlFor="file-upload" className="py-2 px-3 rounded-lg bg-[#000] text-white w-fit cursor-pointer">
                    {buttonText}
                </label>
            )}
            {uploading && <ImSpinner2 className="m-auto animate-spin" />}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};

export default VideoUpload;
