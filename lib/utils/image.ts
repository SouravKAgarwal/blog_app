export async function generateBlurDataURL(imageUrl: string | undefined) {
  if (!imageUrl) return undefined;

  try {
    const url = new URL(imageUrl);

    if (url.hostname.includes("sanity.io")) {
      url.searchParams.set("w", "20");
      url.searchParams.set("blur", "50");
      url.searchParams.set("q", "50");
    } else {
      return undefined;
    }

    const response = await fetch(url.toString());
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error generating blur data URL:", error);
    return undefined;
  }
}
