import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'parves/practice');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Image upload failed');
  return response.json(); // contains public_id, secure_url, etc.
};

const ImageUploader = () => {
  const [file, setFile] = useState(null);

  const { mutate, data, isSuccess, isPending } = useMutation({
    mutationFn: uploadImage,
  });

  const handleUpload = () => {
    if (!file) return;
    mutate(file);
  };

  let optimizedImg;
  if (isSuccess) {
    const img = cld.image(data.public_id); // e.g. 'parves/practice/filename'
    optimizedImg = img
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(500).height(500));
  }

  return (
    <div>
      <h2>Upload & Optimize Image (Cloudinary)</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={isPending}>
        {isPending ? 'Uploading...' : 'Upload'}
      </button>

      {isSuccess && (
        <div style={{ marginTop: '20px' }}>
          <h3>Optimized Image:</h3>
          <AdvancedImage cldImg={optimizedImg} />
          <p>
            Original URL: <a href={data.secure_url} target="_blank" rel="noreferrer">{data.secure_url}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;