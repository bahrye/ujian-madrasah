function getDB(platform) {
  if (!platform?.env?.DB) {
    throw new Error(
      "Database D1 tidak ditemukan. Pastikan binding DB sudah dikonfigurasi di wrangler.toml dan Anda menjalankan dengan --local flag atau sudah deploy ke Cloudflare."
    );
  }
  return platform.env.DB;
}
export {
  getDB as g
};
