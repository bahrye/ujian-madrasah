async function deleteFromCloudinary(url, env) {
  if (!url || !url.includes("res.cloudinary.com")) return false;
  const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || "dfhtjgwcz";
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.warn("Cloudinary API credentials missing. Skipping automatic deletion.");
    return false;
  }
  try {
    const parts = url.split("/");
    const filename = parts.pop() || "";
    const publicId = filename.split(".")[0];
    if (!publicId) return false;
    const resourceType = url.match(/\.(mp3|wav|ogg|m4a)$/i) ? "video" : "image";
    const timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3).toString();
    const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(strToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
      method: "POST",
      body: formData
    });
    const result = await res.json();
    console.log("Cloudinary Destroy Result:", result);
    return result.result === "ok";
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", err);
    return false;
  }
}
export {
  deleteFromCloudinary as d
};
