
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToParts = (base64String: string) => {
    const match = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid base64 string provided");
    }
    return {
        mimeType: match[1],
        data: match[2]
    };
};
