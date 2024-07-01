import { useState } from "react";

const VideoUpload = ({ onUploadSuccess, rcId }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

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
                    body: JSON.stringify({ rc_id: rcId }),
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

            //console.log("Upload ID:", uploadId);
            onUploadSuccess(uploadId);
        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button
                onClick={handleUpload}
                disabled={uploading}
                className="py-2 px-3 rounded-lg bg-blue text-white"
            >
                {uploading ? "Идёт загрузка..." : "Загрузить видео"}
            </button>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};

export default VideoUpload;
