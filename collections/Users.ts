import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,

  fields: [
    // Email added by default
    // Add more fields as needed
    { name: "name", type: "text" },
    { name: "googleId", type: "text", admin: { hidden: true } },
    { name: "media", type: "upload", relationTo: "media" },
  ],
};
