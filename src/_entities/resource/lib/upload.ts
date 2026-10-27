// Images are stored on the backend's local disk (POST /api/upload, auth
// cookie required) — the server resizes to WebP and returns a same-origin URL.
export const uploadFile = async (
  file: File
): Promise<{ url: string; id: string } | null> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL as string}/upload`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as { url: string; id: string };
  } catch {
    return null;
  }
};

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
