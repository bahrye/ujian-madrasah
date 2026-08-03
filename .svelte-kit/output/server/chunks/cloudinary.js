async function deleteFromCloudinary(url, env) {
  if (!url || !url.includes("res.cloudinary.com")) return { success: false, error: "Bukan URL Cloudinary valid" };
  const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || "dfhtjgwcz";
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.warn("Cloudinary API credentials missing. Skipping automatic deletion.");
    return { success: false, error: "API Key atau Secret Cloudinary belum diatur di Cloudflare Pages (Environment Variables)" };
  }
  try {
    const uploadSplit = url.split("/upload/");
    if (uploadSplit.length < 2) return { success: false, error: "Format URL tidak dikenali" };
    let afterUpload = uploadSplit[1];
    if (afterUpload.match(/^v\d+\//)) {
      afterUpload = afterUpload.replace(/^v\d+\//, "");
    }
    const lastDotIndex = afterUpload.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? afterUpload.substring(0, lastDotIndex) : afterUpload;
    const resourceType = url.includes("/video/") ? "video" : "image";
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
    if (result.result === "ok" || result.result === "not found") {
      return { success: true };
    } else {
      return { success: false, error: result.error?.message || result.result || "Unknown error" };
    }
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", err);
    return { success: false, error: err.message || "Kesalahan koneksi ke Cloudinary API" };
  }
}
export {
  deleteFromCloudinary as d
};
