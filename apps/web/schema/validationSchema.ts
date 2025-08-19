import * as yup from "yup";

export const createBoardSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(3, "Board title must be at least 3 characters")
    .required("Board title is required"),
  imageId: yup.string().required("Please select an image"),
  imageThumbUrl: yup
    .string()
    .trim()
    .url("Invalid thumbnail URL")
    .required("Thumbnail URL is required"),
  imageFullUrl: yup.string().trim().url("Invalid full image URL").optional(),
  imageLinkHTML: yup.string().trim().url("Invalid HTML link").optional(),
  orgId: yup.string().trim().required("Organization ID is required"),
});

export const boardTitleSchema = yup.object().shape({
  title: yup.string().trim().required("Title cannot be empty"),
});

export type CreateBoardFormData = yup.InferType<typeof createBoardSchema>;

export const CardFormSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Card title is required")
    .min(3, "Title must be at least 3 characters"),
});

export const ListFormschema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("List title is required")
    .min(3, "Title must be at least 3 characters"),
});
export const descriptionSchema = yup.object().shape({
  description: yup
    .string()
    .trim()
    .min(3, "Description must be at least 3 characters")
    .required("Description is required"),
});
